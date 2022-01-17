
/** Super-classe dos objetos que deve ser atualizados ou desenhados no jogo. */
class GameObject {
  static objs = [] // objetos do jogo
  static reset() { GameObject.objs = [] } // reinicia os objs do jogo

  constructor(type, x, y, dir = 0, size = 10, speed = 5) {
    this.type = type
    this.x = x
    this.y = y
    this.dir = dir
    this.size = size
    this.speed = speed

    // sempre que um GameObject for criado, ele é adicionado aos objs do jogo
    GameObject.objs.push(this)
  }

  /** Por padrão, não faz nada. */
  update() { }

  /** Verifica se um ponto encontra-se em sua área. */
  inBoundingBox(x, y) {
    return (
      x >= this.x - this.size &&
      x <= this.x + this.size &&
      y >= this.y - this.size &&
      y <= this.y + this.size
    )
  }

  /** Remove a si mesmo do conjunto de ojetos do jogo. */
  destroy() {
    GameObject.objs = GameObject.objs.filter(obj => obj !== this)
  }
}