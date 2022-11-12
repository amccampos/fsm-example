import { GameObject } from './gameobj'
import { State, Transition, FiniteStateMachine } from './fsm'
import { calcAngleToTarget, DegToRad, distance, projectPoint } from './math'

export class Unit extends GameObject {
  constructor(game, x, y, dir) {
    super(game, 'unit', x, y, dir)

    this.precious = this.game.objs.find(obj => obj.type === 'gem')
    this.enemy = this.game.objs.find(obj => obj.type === 'player')
    
    // define os pontos de patrulho ao seu redor
    this.patrolPoints = [
      { x: this.precious.x - 50, y: this.precious.y - 50 },
      { x: this.precious.x + 50, y: this.precious.y - 50 },
      { x: this.precious.x + 50, y: this.precious.y + 50 },
      { x: this.precious.x - 50, y: this.precious.y + 50 },
    ]
    this.currentPoint = 0

    // this.initConditionBasedFSM()
    this.initMatrixBasedFSM()
    // this.initObjectBasedFSM()
  }

  // --- AÇÕES  ---------------------------------------------

  /** Gira em direção ao ponto de patrulha atual. */
  turnToPoint() {
    const p = this.patrolPoints[this.currentPoint]
    this.turnTo(p.x, p.y)
  }

  /** Anda um pouco para frente (em função de sua direção e velocidade) */
  moveForward() {
    const [x, y] = projectPoint(this.x, this.y, this.dir, this.speed)
    if (!this.game.canvas.isOutside(x, y)) {
      this.x = x
      this.y = y
    }
  }

  /** Gira em direção ao jogador e anda para frente. */
  chasePlayer() {
    this.turnTo(this.enemy.x, this.enemy.y)
    this.moveForward()
  }

  // --- UPDATES --------------------------------------------------------

  initConditionBasedFSM() {
    this.state = 'turnToPoint'
    this.update = this.updateUsingConditions
  }

  updateUsingConditions() {
    switch(this.state) {
      case 'turnToPoint':
        // realiza ação
        this.turnToPoint()

        // verifica transições
        if (this.isFacingPoint()) {
          this.state = 'moveToPoint'
        }
        else if (this.isPlayerCloseToGem()) {
          this.state = 'chasePlayer'
        }
        break;

      case 'moveToPoint':
        // realiza ação
        this.moveForward()

        // verifica transições
        if (this.isOverPoint()) {
          this.nextPoint()
          this.state = 'turnToPoint'
        }
        else if (this.isPlayerCloseToGem()) {
          this.state = 'chasePlayer'
        }
        break;

      case 'chasePlayer':
        // realiza ação
        this.chasePlayer()

        // verifica transições
        if (this.isPlayerFarFromGem()) {
          this.state = 'turnToPoint'
        }
        break;

    }
  }

  // ---------------------

  initMatrixBasedFSM() {
    /*                   turnToPoint       moveToPoint       chasePlayer  */
    this.states =      [ this.turnToPoint, this.moveForward, this.chasePlayer ]
    this.entryAction = [ this.nextPoint,   null,             null             ]
    // this.exitActions = [ ... ]
    
    // this.transitions = [  /* turnToPoint              moveToPoint         chasePlayer              */
    //      /* turnToPoint */ [ null,                    this.isFacingPoint, this.isPlayerCloseToGem ],
    //      /* moveToPoint */ [ this.isOverPoint,        null,               this.isPlayerCloseToGem ],
    //      /* chasePlayer */ [ this.isPlayerFarFromGem, null,               null                    ],
    // ]
    this.stateIndex = 0
    this.update = this.updateUsingMatrix

    // Alternativa
    this.conditions = [ null, this.isFacingPoint, this.isPlayerCloseToGem, this.isPlayerFarFromGem, this.isOverPoint ]
    this.transitions = [
      [ 0, 1, 2 ],
      [ 4, 0, 2 ],
      [ 3, 0, 0 ],
    ]
  }

  updateUsingMatrix() {
    // realiza ação
    const action = this.states[this.stateIndex]
    action.apply(this)

    // verifica transições
    const transitions = this.transitions[this.stateIndex]
    const newState = transitions.findIndex(t => {
      const condition = this.conditions[t]
      return condition && condition.apply(this)
    })
    // se houve a transição
    if (newState >= 0) {
      const entry = this.entryAction[newState]
      if (entry) {
        entry.apply(this)
      }
      this.stateIndex = newState
    }
  }

  // ---------------------

  initObjectBasedFSM() {
    const turnToPoint = new State(this.turnToPoint)
    const moveToPoint = new State(this.moveForward)
    const chasePlayer = new State(this.chasePlayer)

    const t1 = new Transition(turnToPoint, moveToPoint, this.isFacingPoint)
    const t2 = new Transition(turnToPoint, chasePlayer, this.isPlayerCloseToGem)
    const t3 = new Transition(moveToPoint, turnToPoint, this.isOverPoint, this.nextPoint)
    const t4 = new Transition(moveToPoint, chasePlayer, this.isPlayerCloseToGem)
    const t5 = new Transition(chasePlayer, turnToPoint, this.isPlayerFarFromGem)

    this.fsm = new FiniteStateMachine(turnToPoint, [ t1, t2, t3, t4, t5 ])
    this.update = this.updateUsingObjects
  }

  updateUsingObjects() {
    this.fsm.update(this)
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
    const ctx = this.game.canvas.context2d
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
