
class Canvas {
  #htmlCanvas
  #context2d
  
  /** Cria um novo canvas(js) associado a um canvas (html) cujo id é passado. */
  constructor(id) {
    this.#htmlCanvas = document.getElementById(id)
    if (this.#htmlCanvas) {
      this.#context2d = this.#htmlCanvas.getContext('2d')
    }
  }

  /** largura do canvas. */
  width() { return this.#htmlCanvas.width }

  /** altura do canvas. */
  height() { return this.#htmlCanvas.height }

  /** Apaga tudo que está no canvas. */
  clear() {
    this.#context2d.clearRect (0, 0, this.#htmlCanvas.width, this.#htmlCanvas.height)
  }

  /** Verifica se um ponto se encontra fora da área do canvas. */
  isOutside(x, y) {
    return x < 0 || y < 0 || x > this.#htmlCanvas.width || y > this.#htmlCanvas.height
  }

  /** Desenha um objeto do jogo (idealmente este método deveria estar no obj) */
  draw(gameobj) {
    this.#context2d.fillStyle = gameobj.fill || 'rgb(40, 40, 120)'
    this.#context2d.strokeStyle = gameobj.stroke || 'rgb(255, 255, 255)'
    this.#context2d.beginPath()
    this.#context2d.arc(gameobj.x, gameobj.y, gameobj.size, 0, 2 * Math.PI)
    this.#context2d.fill()
    if (gameobj.type === 'unit' || gameobj.type === 'player') {
      this.#context2d.moveTo(gameobj.x, gameobj.y)
      this.#context2d.lineTo(gameobj.x + gameobj.size * Math.cos(gameobj.dir), gameobj.y + gameobj.size * Math.sin(gameobj.dir))
      this.#context2d.stroke()
    }
  }
}