
/** Estado de uma máquina de estado finito. */
export class State {
  constructor(unit) {
    this.unit = unit
    this.substate = undefined
    this.nextState = undefined
  }

  /** Método executado quando o NPC entra neste estado. */
  entry()  { if (this.substate) this.substate.entry() }

  /** Método executado quando o NPC sai deste estado. */
  exit()   { if (this.substate) this.substate.exit() }

  /** Método executado (default) enquanto o NPC se encontra neste estado. */
  update() {
    // se o estado foi configurado para ser alterado (via onMessage)...
    // .. retorna o dito estado para que haja alteração de "estado-pai"
    if (this.nextState) {
      return this.nextState
    }
    // casos contrário, realiza as ações e verifica se houve alterações
    // no "estado-filho". Caso haja, altera o estado-filho.
    const newState = this.substate?.update()
    if (newState !== this.substate) {
      this.substate = this.substate.changeState(newState)
    }
    return this
  }

  /** Atualiza o estado, chamando seu método `exit()` e o `entry()` do novo estado. */
  changeState(newState) {
    this.exit()
    newState.entry(this)
    return newState
  }

  /** Método chamado quando uma mensagem é processada. */
  onMessage(message) {}

  /** Insere uma mensagem na fila para ser processada posteriormente. */
  sendMessage(message) {}
}

