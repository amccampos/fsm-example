import { State } from "../state-oo.js"
import { ChasePlayerState } from "./chasePlayerState.js"
import { TurnToPointState } from "./turnToPointState.js"

/**
 * Estado de "ronda" ao redor da joia.
 * Possui como possíveis sub-estados TurnToPointState e MoveToPointState
 */
export class RoundState extends State {
  constructor(unit) {
    super(unit)
    this.substate = new TurnToPointState(unit)
  }

  update() {
    // realiza as ações (do subestado)
    const newState = this.substate?.update()
    if (newState !== this.substate) {
      this.substate = this.substate.changeState(newState)
    }

    // verifica transições
    if (this.unit.isPlayerCloseToGem()) {
      return new ChasePlayerState(this.unit)
    }
    return this
  }

}