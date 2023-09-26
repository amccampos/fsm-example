import { Message, MessageType, messageManager } from "./fsm/msg-manager.js"
import { game } from "./game.js"
import { GameObject, GameObjectType } from "./gameobj.js"
import { gameObjPool } from "./gameobjpool.js"

/** Bala disparada pelo jogador. */
export class Bullet extends GameObject {
  constructor(x, y, dir) {
    super(GameObjectType.Bullet, x, y, dir, 2, 10)
    this.fill = 'rgb(255, 255, 255)'
  }

  update() {
    // se sair do mundo, pode se remover dele
    if (!this.moveForward()) {
      this.destroy()
    }

    // se bater em algum objeto, remove o objeto e a si mesmo... e cadastra uma mensagem informando que
    // esse evento ocorreu.
    gameObjPool.objs.find(obj => {
      if (obj !== this && obj.inBoundingBox(this.x, this.y)) {
        const message = new Message(this, GameObjectType.Unit, MessageType.BulletHit)
        messageManager.add(message)
        obj.destroy()
        this.destroy()
      }
    })
  }

  draw() {
    const ctx = game.canvas.context2d
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.strokeStyle = 'rgb(255, 255, 255)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
  }
}
