import { GameObject } from './gameobj'

export class Gem extends GameObject {
  constructor(game, x, y) {
    super(game, 'gem', x, y)
    this.fill = 'rgb(255, 0, 0)'
  }

  draw() {
    const ctx = this.game.canvas.context2d
    ctx.fillStyle = 'rgb(255, 0, 0)'
    ctx.strokeStyle = 'rgb(255, 255, 255)'
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