import { game } from "./game.js"
import { gameObjPool } from "./gameobjpool.js"
import { projectPoint, randomIntRange } from "./math.js"

/** Tipos de objetos presentes no jogo (js não tem enum...) */
export const GameObjectType = {
  Player: 'player',
  Unit: 'unit',
  Gem: 'gem',
  Bullet: 'bullet'
}


/** Super-classe dos objetos que deve ser atualizados ou desenhados no jogo. */
export class GameObject {

  constructor(type, x, y, dir = 0, size = 10, speed = 5) {
    // se x e y não forem passados, posiciona num local aleatório dentro do canvas.
    x = x === undefined ? randomIntRange(game.canvas.width - size, size) : x
    y = y === undefined ? randomIntRange(game.canvas.height - size, size) : y
    this.type = type
    this.x = x
    this.y = y
    this.dir = dir
    this.size = size
    this.speed = speed
  }

  /** Por padrão, não faz nada. Precisa ser sobrecarregado na subclasse. */
  update() { }

  /** Por padrão, não desenha nada. Precisa ser sobrecarregado na subclasse. */
  draw() { }

  /** Por padrão, não há nada a ser inicializado. Precisa ser sobrecarregado na subclasse. */
  init() { }

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
    gameObjPool.remove(this)
  }

  // --- ações comuns ---

  /**
   * Anda um pouco para frente (em função de sua direção e velocidade).
   * @returns verdadeiro se a nova posição está dentro do mundo ou
   *          falso caso contrário.
   */
  moveForward() {
    const [x, y] = projectPoint(this.x, this.y, this.dir, this.speed)
    if (!game.canvas.isOutside(x, y)) {
      this.x = x
      this.y = y
      return true
    }
    return false
  }

}