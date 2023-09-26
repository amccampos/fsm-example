import { State } from '../state-oo.js'
import { TurnToPointState } from './turnToPointState.js'

/**
 * Estado de girar em direção a um ponto da ronda sobre a joia.
 * Se o npc não conseguir se movimentar (ou seja, saiu da área do canvas)
 * ou se chegou ao seu alvo (ponto da ronda), então muda de estado para
 * girar para o próximo ponto da ronda.
 */
export class MoveToPointState extends State {
  constructor(unit) {
    super(unit)
  }

  update() {
    // realiza as ações
    const hasMoved = this.unit.moveForward()

    // verifica as transições
    if (!hasMoved || this.unit.isOverPoint()) {
      this.unit.nextPoint()
      return new TurnToPointState(this.unit)
    }
    return this
  }
}