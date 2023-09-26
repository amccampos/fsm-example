import { State } from "../state-oo.js"
import { MoveToPointState } from "./moveToPointState.js"

/**
 * Estado que faz o npc girar para um ponto da ronda.
 * Quando o npc estiver de frente para o ponto, poderá mudar de estado
 * para ir em direção ao ponto.
 */
export class TurnToPointState extends State {
  constructor(unit) {
    super(unit)
  }

  update() {
    // realiza as ações
    this.unit.turnToPoint()

    // verifica as transições
    if (this.unit.isFacingPoint()) {
      return new MoveToPointState(this.unit)
    }
    return this
  }
}
