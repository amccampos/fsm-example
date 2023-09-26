import { gameObjPool } from "../gameobjpool.js"

/** Enumeração com os tipos de eventos tratados */
export const MessageType = {
  BulletFired: 0,
  BulletHit: 1
}

/** Informações de uma mensagem: remetende, destinatário, tipo e conteúdo. */
export class Message {
  constructor(sender, receiver, type, content = {}) {
    this.sender = sender
    this.receiver = receiver
    this.type = type
    this.content = content
  }
}

let messageQueue = []
/** Fila de mensagens. */
class MessageQueue {

  /** Adiciona uma mensagen à fila. */
  add(message) {
    messageQueue.push(message)
  }

  /** Processa a fila, distribuindo todas as mensagens aos seus destinatários. */
  process() {
    messageQueue.forEach(message => {
      // os destinatários são todos objetos cujo `type` é igual a `receiver` da mensagem
      const receivers = gameObjPool.objs.filter(obj => obj.type === message.receiver)
      receivers.forEach(receiver => receiver.state.onMessage(message))
    })
    messageQueue = []
  }
}

/** messageManager é um singleton com a fila de mensagens do jogo. */
export const messageManager = Object.freeze(new MessageQueue())