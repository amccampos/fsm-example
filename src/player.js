import { GameObject, GameObjectType } from './gameobj.js'
import { gameObjPool } from './gameobjpool.js'
import { Bullet } from './bullet.js'
import { projectPoint, DegToRad, randomFloatRange } from './math.js'
import { game } from './game.js'

/** 
 * Representa um jogador do jogo.
 * Reage às teclas `w` e `s` para ir para frente e para trás, e `a` e `d` para girar à esquerda e direita.
 * A tecla ' ' solta um tiro na direção em que ele se encontra.
 */
export class Player extends GameObject {

  constructor() {
    super(GameObjectType.Player)
    this.dir = randomFloatRange(Math.PI, -Math.PI)
    this.onLeft = false     // está com a tecla para girar à esquerda pressionada?
    this.onRight = false    // está para girar à direita?
    this.onForward = false  // ou para ir pra frente?
    this.onFire = false     // ou pra trás?
    this.armed = true       // está com a arma carregada?

    // atualiza o estado dos movimentos quando o usuário pressiona uma tecla
    document.addEventListener('keydown', event => {
      event.preventDefault()
      switch (event.key) {
        case 'a': this.onLeft = true;    break;
        case 'd': this.onRight = true;   break;
        case 'w': this.onForward = true; break;
        case ' ':
          if (this.armed) { // só atira se estiver armado (precisa precionar o botão novamente)
            this.onFire = true
            this.armed = false
          }
          break;
      }
    })
    // atualiza o estado dos movimentos quando o usuário solta uma tecla
    document.addEventListener('keyup', event => {
      event.preventDefault()
      switch (event.key) {
        case 'a': this.onLeft = false;    break;
        case 'd': this.onRight = false;   break;
        case 'w': this.onForward = false; break;
        case ' ': this.armed = true;      break;  // agora pode atirar
      }
    })
  }

  /** Atira ou atualiza a posição e/ou direção em função do estado das teclas. */
  update() {
    if (this.onLeft) { this.turnLeft() }
    if (this.onRight) { this.turnRight() }
    if (this.onForward) { this.moveForward() }
    if (this.onFire) {
      this.fire()
      this.onFire = false // para atirar novamente, precisa pressionar o botão mais uma vez 
    }
  }

  /** Gira um pouco à esquerda. */
  turnLeft() {
    this.dir -= this.speed * 2*DegToRad
  }

  /** Gira um pouco à direita. */
  turnRight() {
    this.dir += this.speed * 2*DegToRad
  }

  /** Dispara uma bala. */
  fire() {
    const [x, y] = projectPoint(this.x, this.y, this.dir, this.size + 5)
    gameObjPool.add(new Bullet(x, y, this.dir))
  }

  draw() {
    const ctx = game.canvas.context2d
    ctx.fillStyle = 'rgb(36, 153, 72)'
    ctx.strokeStyle = 'rgb(255, 255, 255)'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x + this.size * Math.cos(this.dir), this.y + this.size * Math.sin(this.dir))
    ctx.stroke()
  }

}