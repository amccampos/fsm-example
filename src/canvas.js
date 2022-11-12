export class Canvas {
  
  /** Cria um novo canvas(js) associado a um canvas (html) cujo id é passado. */
  constructor(id) {
    this.htmlCanvas = document.getElementById(id)
    if (this.htmlCanvas) {
      this.context2d = this.htmlCanvas.getContext('2d')
    }
  }

  /** largura do canvas. */
  width() { return this.htmlCanvas.width }

  /** altura do canvas. */
  height() { return this.htmlCanvas.height }

  /** Apaga tudo que está no canvas. */
  clear() {
    this.context2d.clearRect (0, 0, this.htmlCanvas.width, this.htmlCanvas.height)
  }

  /** Verifica se um ponto se encontra fora da área do canvas. */
  isOutside(x, y) {
    return x < 0 || y < 0 || x > this.htmlCanvas.width || y > this.htmlCanvas.height
  }

}