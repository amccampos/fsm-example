import { GameObject } from "./gameobj"

export class Bullet extends GameObject {
  constructor(game, x, y, dir) {
    super(game, 'bullet', x, y, dir, 2, 10)
    this.fill = 'rgb(255, 255, 255)'
  }

  update() {
    // atualiza a posição em função da direção
    this.x += this.speed * Math.cos(this.dir)
    this.y += this.speed * Math.sin(this.dir)

    // se ficar fora da área do canvas, pode remover.
    if (this.game.canvas.isOutside(this.x, this.y)) {
      this.destroy()
    }

    // se bater em algum objeto, remove o objeto e a si mesmo.
    this.game.objs.find(obj => {
      if (obj !== this && obj.inBoundingBox(this.x, this.y)) {
        obj.destroy()
        this.destroy()
      }
    })
  }

  draw() {
    const ctx = this.game.canvas.context2d
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.strokeStyle = 'rgb(255, 255, 255)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
  }
}
