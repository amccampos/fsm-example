
class Unit extends GameObject {
  constructor(x, y, dir) {
    super('unit', x, y, dir)
    this.fill = 'rgb(36, 45, 153)'

    const g = Game.gem
    this.patrolPoints = [
      { x: g.x - 50, y: g.y - 50 },
      { x: g.x + 50, y: g.y - 50 },
      { x: g.x + 50, y: g.y + 50 },
      { x: g.x - 50, y: g.y + 50 },
    ]
    this.currentPoint = 0

    this.initConditionBasedFSM()
    // this.initMatrixBasedFSM()
    // this.initObjectBasedFSM()
  }

  // --- AÇÕES  ---

  /** Gira em direção ao ponto de patrulha atual. */
  turnToPoint() {
    const p = this.patrolPoints[this.currentPoint]
    this.turnTo(p.x, p.y)
  }

  /** Anda um pouco para frente (em função de sua direção e velocidade) */
  moveForward() {
    const [x, y] = projectPoint(this.x, this.y, this.dir, this.speed)
    if (!Game.canvas.isOutside(x, y)) {
      this.x = x
      this.y = y
    }
  }

  /** Gira em direção ao jogador e anda para frente. */
  chasePlayer() {
    this.turnTo(Game.player.x, Game.player.y)
    this.moveForward()
  }

  // --- UPDATES ---

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
    this.transitions = [  /* turnToPoint              moveToPoint         chasePlayer              */
         /* turnToPoint */ [ null,                    this.isFacingPoint, this.isPlayerCloseToGem ],
         /* moveToPoint */ [ this.isOverPoint,        null,               this.isPlayerCloseToGem ],
         /* chasePlayer */ [ this.isPlayerFarFromGem, null,               null                    ],
    ]
    this.stateIndex = 0
    this.update = this.updateUsingMatrix

    /* Alternativa
    this.conditions = [ null, this.isFacingPoint, this.isPlayerCloseToGem, this.isPlayerFarFromGem, this.isOverPoint ]
    this.transitions = [
      [ 0, 1, 2 ],
      [ 4, 0, 2 ],
      [ 3, 0, 0 ],
    ]
    */
  }

  updateUsingMatrix() {
    // realiza ação
    const action = this.states[this.stateIndex]
    action.apply(this)

    // verifica transições
    const transitions = this.transitions[this.stateIndex]
    const newState = transitions.findIndex(t => t && t.apply(this))
    if (newState >= 0) {
      const entry = this.entryAction[newState]
      entry && entry.apply(this)
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

    this.fsm = new FiniteStateMachine( turnToPoint, [ t1, t2, t3, t4, t5 ])
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
    const d = distance(Game.player.x, Game.player.y, Game.gem.x, Game.gem.y)
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

}
