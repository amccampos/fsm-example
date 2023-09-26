import { GameObject, GameObjectType } from './gameobj.js'
import { gameObjPool } from './gameobjpool.js'
import { calcAngleToTarget, DegToRad, distance, randomFloatRange } from './math.js'
import { game } from './game.js'
import { PatrolState } from './fsm/states/patrolState.js'

/** Guardião de uma joia. Ele fica patrulhando ao redor da uma joia (Gem) que lhe é associado. */
export class Guardian extends GameObject {
  constructor(precious) {
    super(GameObjectType.Unit)
    this.precious = precious
    this.dir = randomFloatRange (Math.PI, -Math.PI)
    this.enemy = null
    this.patrolPoints = []
    this.currentPoint = null
  }

  /** Configuração inicial. */
  init() {
    this.enemy = gameObjPool.objs.find(obj => obj.type === GameObjectType.Player)
    
    // define os pontos de patrulho ao seu redor
    this.patrolPoints = [
      { x: this.precious.x - 50, y: this.precious.y - 50 },
      { x: this.precious.x + 50, y: this.precious.y - 50 },
      { x: this.precious.x + 50, y: this.precious.y + 50 },
      { x: this.precious.x - 50, y: this.precious.y + 50 },
    ]
    this.currentPoint = 0
    this.state = new PatrolState(this)
    this.state.entry()
  }

  // --- AÇÕES  ---------------------------------------------

  /** Gira em direção ao ponto de patrulha atual. */
  turnToPoint() {
    const p = this.patrolPoints[this.currentPoint]
    this.turnTo(p.x, p.y)
  }

  /** Gira em direção ao jogador e anda para frente. */
  chasePlayer() {
    this.turnTo(this.enemy.x, this.enemy.y)
    this.moveForward()
  }

  // --- UPDATES --------------------------------------------------------

  /**
   * Atualiza o mundo de acordo com seu estado interno. Se a atualização do estado retornar um novo
   * estado, então uma transição para esse novo estado deve ser feita.
   */
  update() {
    const newState = this.state.update(this)
    if (newState !== this.state) {
      this.state = this.state.changeState(newState)
    }
  }
  

  // --- métodos auxiliares ---

  /** Gira em direção a um ponto sem exceder sua velocidade de rotação. */
  turnTo(x, y) {
    const rotationSpeed = 2 * this.speed * DegToRad
    const ang = calcAngleToTarget(this.x, this.y, this.dir, x, y)
    const angle = ang < 0 ? Math.max(ang, -rotationSpeed) : Math.min(ang, rotationSpeed) 
    this.dir += angle
  }

  /** Atualiza o ponto de patrula para ser o próximo do array (circular). */
  nextPoint() {
    this.currentPoint = (this.currentPoint + 1) % this.patrolPoints.length
  }

  /** Verifica se o ponto atual da patrulha está à frente da unidade. */
  isFacingPoint() {
    const p = this.patrolPoints[this.currentPoint]
    const a = calcAngleToTarget(this.x, this.y, this.dir, p.x, p.y)
    return Math.abs(a) < DegToRad
  }

  /** Verifica se o jogador está próximo à joia. */
  isPlayerCloseToGem() {
    const d = distance(this.enemy.x, this.enemy.y, this.precious.x, this.precious.y)
    return d < 200
  }

  /** Verifica se o jogador se encontra longe da joia. */
  isPlayerFarFromGem() {
    return !this.isPlayerCloseToGem()
  }

  /** Verifica se a unidade se encontra sobre um ponto de patrulha. */
  isOverPoint() {
    const p = this.patrolPoints[this.currentPoint]
    return distance(this.x, this.y, p.x, p.y) < this.speed
  }

  draw() {
    const ctx = game.canvas.context2d
    ctx.fillStyle = 'rgb(36, 45, 153)'
    ctx.strokeStyle = 'rgb(255, 255, 255)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x + this.size * Math.cos(this.dir), this.y + this.size * Math.sin(this.dir))
    ctx.stroke()
  }
}
