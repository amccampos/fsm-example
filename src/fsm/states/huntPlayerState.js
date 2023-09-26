import { State } from "../state-oo.js"

/**
 * Estado de caça ao jogador.
 * Depois que o npc entra nesse estado, ele não sai mais.
 */
export class HuntPlayerState extends State {
  constructor(unit) {
    super(unit)
  }

  update() {
    // realiza as ações
    this.unit.turnTo(this.unit.enemy.x, this.unit.enemy.y)
    this.unit.moveForward()
    return this
  }
}
