import { Canvas } from './canvas'
import { GameObject } from './gameobj'
import { Gem } from './gem'
import { Player } from './player'
import { Unit } from './unit'
import { randomIntRange, randomFloatRange } from './math'

export class Game {

  constructor(canvasId) {
    this.canvas = new Canvas(canvasId || 'canvas')
    this.objs = []
    this.reset()
  }

  /** A cada iteração do jogo */
  tick() {
    this.canvas.clear()
    this.objs.forEach(item => {
      item.update()
      item.draw()
    })
  }

  reset() {
    const rndX = limit => randomIntRange(this.canvas.width() - limit, limit)
    const rndY = limit => randomIntRange(this.canvas.height() - limit, limit)

    this.canvas.clear()
    this.objs = []
    
    new Gem(this, rndX(50), rndY(50))
    new Player(this, rndX(50), rndY(50))
    new Unit(this, rndX(50), rndY(50), randomFloatRange(Math.PI, -Math.PI))
    
    this.objs.forEach(item => item.draw()) 
  }

  start() {
    this.stop()
    this.interval = setInterval(() => this.tick(), 30)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  addGameObj(obj) {
    this.objs.push(obj)
  }

  removeGameObj(obj) {
    this.objs = this.objs.filter(o => o !== obj)
  }
}
