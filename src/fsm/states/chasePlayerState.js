import { State } from "../state-oo.js"
import { RoundState } from "./roundState.js"

/**
 * Estado de caçar/perseguir o jogador. 
 * Nesse estado, se o jogador estiver longe da joia, o npc volta a
 * fazer a ronda sobre a joia.
 */
export class ChasePlayerState extends State {
  constructor(unit) {
    super(unit)
  }

  update() {
    // realiza as ações
    this.unit.turnTo(this.unit.enemy.x, this.unit.enemy.y)
    this.unit.moveForward()

    // verifica as transições
    if (this.unit.isPlayerFarFromGem()) {
      return new RoundState(this.unit)
    }
    return this
  }
}