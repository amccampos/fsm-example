
/** Super-classe dos objetos que deve ser atualizados ou desenhados no jogo. */
export class GameObject {

  constructor(game, type, x, y, dir = 0, size = 10, speed = 5) {
    this.game = game
    this.type = type
    this.x = x
    this.y = y
    this.dir = dir
    this.size = size
    this.speed = speed

    // sempre que um GameObject for criado, ele é adicionado aos objs do jogo
    this.game.addGameObj(this)
  }

  /** Por padrão, não faz nada. */
  update() { }

  /** Por padrão, não desenha nada. */
  draw() { }

  /** Verifica se um ponto encontra-se em sua área. */
  inBoundingBox(x, y) {
    return (
      x >= this.x - this.size &&
      x <= this.x + this.size &&
      y >= this.y - this.size &&
      y <= this.y + this.size
    )
  }

  /** Remove-se do conjunto de ojetos do jogo. */
  destroy() {
    this.game.removeGameObj(this)
  }
}