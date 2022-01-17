
/** Estado de uma máquina de estado finito. */
class State {
  constructor(action, entryAction, exitAction) {
    this.action = action           // ação executada enquanto estiver no estado
    this.entryAction = entryAction // ação executada no momento que entrar no estado
    this.exitAction = exitAction   // ação executada no momento que sair do estado
  }
}

class Transition {
  constructor(from, to, condition, action) {
    this.from = from            // estado da unidade em que a transição é testada
    this.to = to                // estado para o qual a unidade vai mudar
    this.condition = condition  // condição que ativa a transição (se retornar verd.)
    this.action = action        // o que fazer se a transição for ativada.
  }
}


class FiniteStateMachine {

  constructor(initialState, transitions = []) {
    this.state = initialState
    this.transitions = transitions
  }

  update(unit) {
    // realiza ação
    this.state.action.apply(unit)

    // verifica transições
    const transition = this.transitions
      .filter(t => t.from === this.state)
      .find(t => t.condition.apply(unit))
    if (transition) {
      this.state.exitAction && this.state.exitAction.apply(unit)
      transition.action && transition.action.apply(unit)
      this.state = transition.to
      this.state.entryAction && this.state.entryAction.apply(unit)
    }
  }
}

