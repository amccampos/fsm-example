import { game } from './game.js'
import { GameObject, GameObjectType } from './gameobj.js'

/** joia (gema) */
export class Gem extends GameObject {
  constructor(x, y) {
    super(GameObjectType.Gem, x, y)
    this.fill = 'rgb(255, 0, 0)'
    this.stroke = 'rgb(255, 255, 255)'
  }

  draw() {
    const ctx = game.canvas.context2d
    ctx.fillStyle = this.fill
    ctx.strokeStyle = this.stroke
    ctx.beginPath()
    ctx.moveTo(this.x, this.y+5)
    ctx.lineTo(this.x-10, this.y-5)
    ctx.lineTo(this.x-7, this.y-10)
    ctx.lineTo(this.x+7, this.y-10)
    ctx.lineTo(this.x+10, this.y-5)
    ctx.lineTo(this.x, this.y+5)
    ctx.fill()
    ctx.stroke()
  }
}