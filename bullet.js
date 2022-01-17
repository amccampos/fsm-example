class Bullet extends GameObject {
  constructor(x, y, dir) {
    super('bullet', x, y, dir, 2, 10)
    this.fill = 'rgb(255, 255, 255)'
  }

  update() {
    // atualiza a posição em função da direção
    this.x += this.speed * Math.cos(this.dir)
    this.y += this.speed * Math.sin(this.dir)

    // se ficar fora da área do canvas, pode remover.
    if (Game.canvas.isOutside(this.x, this.y)) {
      this.destroy()
    }

    // se bater em algum objeto, remove o objeto e a si mesmo.
    GameObject.objs.find(obj => {
      if (obj !== this && obj.inBoundingBox(this.x, this.y)) {
        obj.destroy()
        this.destroy()
      }
    })
  }
}
