import { MessageType } from "../msg-manager.js"
import { State } from "../state-oo.js"
import { HuntPlayerState } from "./huntPlayerState.js"
import { RoundState } from "./roundState.js"

/**
 * Estado de patrulha. Reage quando uma bala atinge outro npc.
 */
export class PatrolState extends State {
  constructor(unit) {
    super(unit)
    this.substate = new RoundState(unit)
  }

  onMessage(message) {
    // se durante a patrulha (seja qual for seu sub-estado), receber uma
    // mensagem de que outra unidade foi atingida, então o próximo estado
    // deve ser "caçar o jogador".
    if (message.type === MessageType.BulletHit) {
      this.nextState = new HuntPlayerState(this.unit)
    }
    // caso contrário, deixa a mensagem ser tratada pelo sub-estado
    else if (this.substate) {
      this.substate.onMessage(message)
    }
  }
}