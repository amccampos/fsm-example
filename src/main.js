import { game } from './game.js'

window.onload = () => {
  const start_btn = document.getElementById('start_btn')
  const pause_btn = document.getElementById('pause_btn')
  const reset_btn = document.getElementById('reset_btn')

  game.createCanvas('canvas')
  start_btn.onclick = () => game.start()
  pause_btn.onclick = () => game.stop()
  reset_btn.onclick = () => game.reset()
}
