import { Canvas } from './canvas.js'
import { gameObjPool } from './gameobjpool.js'
import { Gem } from './gem.js'
import { Player } from './player.js'
import { Guardian } from './guardian.js'
import { messageManager } from './fsm/msg-manager.js'

let canvas
let interval

/** Classe representando o jogo. */
class Game {
  get canvas() { return canvas }
  
  /** associa o elemento html com id `canvasId` ao canvas do jogo. */
  createCanvas(canvasId) {
    canvas = new Canvas(canvasId)
    this.reset()
  }

  /** A cada iteração do jogo. */
  tick() {
    this.update() // atualiza os objetos do jogo
    this.draw()   // e desenha-os
  }

  /** processa as mensagens (eventos) e atualiza os objetos. */
  update() {
    messageManager.process()
    gameObjPool.objs.forEach(obj => obj.update()) 
  }

  /** apaga a área de desenho e desenha novamente todos os objetos. */
  draw() {
    if (this.canvas) {
      this.canvas.clear()
      gameObjPool.objs.forEach(obj => obj.draw()) 
    }
  }

  /** cria o cenário do jogo. */
  init() {
    gameObjPool.reset()
    gameObjPool.add(new Player())

    const yGem = this.canvas.height / 2
    const xGem = this.canvas.width / 4

    for(let numGems = 1; numGems <= 3; numGems++) {
      const gem = new Gem(numGems * xGem, yGem)
      const guardian = new Guardian(gem)
      gameObjPool.add(gem)
      gameObjPool.add(guardian)
    }

    gameObjPool.objs.forEach(obj => obj.init())
  }

  /** Reinicia o jogo. */
  reset() {
    this.init()
    this.draw()
  }

  /** Inicia o laço do jogo chamando a o método tick() num intervalo regular. */
  start() {
    const frameRate = 1000/30  // 30 frames por segundo
    this.stop()
    interval = setInterval(() => this.tick(), frameRate)
  }

  /** Para a atualização do jogo. */
  stop() {
    if (interval) {
      clearInterval(interval)
    }
  }
}

/** game é um objeto único que representa o jogo (singleton) */
export const game = Object.freeze(new Game())