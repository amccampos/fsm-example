
class Player extends GameObject {

  constructor(x, y, dir) {
    super('player', x, y, dir)
    this.fill = 'rgb(36, 153, 72)'
    this.onLeft = false
    this.onRight = false
    this.onForward = false
    this.onFire = false
    this.armed = true

    // atualiza o estado dos movimentos quando o usuário pressiona uma tecla
    document.addEventListener('keydown', event => {
      switch (event.key) {
        case 'a': this.onLeft = true;    break;
        case 'd': this.onRight = true;   break;
        case 'w': this.onForward = true; break;
        case ' ':
          if (this.armed) {
            this.onFire = true
            this.armed = false
          }
          break;
      }
      event.preventDefault()
    })
    // atualiza o estado dos movimentos quando o usuário solta uma tecla
    document.addEventListener('keyup', event => {
      switch (event.key) {
        case 'a': this.onLeft = false;    break;
        case 'd': this.onRight = false;   break;
        case 'w': this.onForward = false; break;
        case ' ': this.armed = true;      break;
      }
      event.preventDefault()
    })
  }

  /** Atira ou atualiza a posição e/ou direção em função do estado das teclas. */
  update() {
    if (this.onLeft) { this.turnLeft() }
    if (this.onRight) { this.turnRight() }
    if (this.onForward) { this.moveForward() }
    if (this.onFire) {
      this.fire()
      this.onFire = false
    }
  }

  /** Segue em frente. */
  moveForward() {
    const [x, y] = projectPoint(this.x, this.y, this.dir, this.speed)
    if (!Game.canvas.isOutside(x, y)) {
      this.x = x
      this.y = y
    }
  }

  /** Gira um pouco à esquerda. */
  turnLeft() {
    this.dir -= this.speed * 2* DegToRad
  }

  /** Gira um pouco à direita. */
  turnRight() {
    this.dir += this.speed * 2* DegToRad
  }

  /** Dispara uma bala. */
  fire() {
    const [x, y] = projectPoint(this.x, this.y, this.dir, this.size + 5)
    new Bullet(x, y, this.dir)
  }

}