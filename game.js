
class Game {
  static #interval
  static canvas
  static player
  static unit
  static gem

  /** A cada iteração do jogo */
  static tick() {
    GameObject.objs.forEach(item => item.update())
    Game.canvas.clear()
    GameObject.objs.forEach(item => Game.canvas.draw(item))  
  }

  static init(canvasId) {
    if (canvasId || !Game.canvas) {
      Game.canvas = new Canvas(canvasId || 'canvas')
    }
    Game.canvas.clear()
    GameObject.reset()

    // objetos presentes no jogo: uma unidade, uma joia e um jogador.
    Game.gem = new Gem(
      randomIntRange(Game.canvas.width() - 50, 50),
      randomIntRange(Game.canvas.height() - 50, 50)
    )
    Game.player = new Player(
      randomIntRange(Game.canvas.width()),
      randomIntRange(Game.canvas.height()),
      randomFloatRange(Math.PI, -Math.PI)
    )
    Game.unit = new Unit(
      randomIntRange(Game.canvas.width()),
      randomIntRange(Game.canvas.height()),
      randomFloatRange(Math.PI, -Math.PI)
    )
    GameObject.objs.forEach(item => Game.canvas.draw(item)) 
  }

  static start() {
    Game.stop()
    Game.#interval = setInterval(Game.tick, 33)
  }

  static stop() {
    clearInterval(Game.#interval)
  }
}
