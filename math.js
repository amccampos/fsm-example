
/** Constante multiplicativa para transformar graus em radianos */
const DegToRad = (2*Math.PI) / 360

/** Constante multiplicativa para transformar radianos em graus */
const RadToDeg = 360 / (2*Math.PI)

/** Gerador de número inteiro, dentro de um intervalo. */
function randomIntRange(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Gerador de número real, dentro de um intervalo. */
function randomFloatRange(max, min = 0) {
  return Math.random() * (max - min) + min
}

/** Calcula a distência entre dois pontos */
function distance(x0, y0, x1, y1) {
  const dx = x1 - x0
  const dy = y1 - y0
  return Math.sqrt(dx*dx + dy*dy)
}

/**
 * projeta o ponto (x,y) na direção dir. Ou seja, se (x,y) for na
 * direção dir a uma distância dist, onde ele estará.
 */
function projectPoint(x, y, dir, dist = 1) {
  const px = x + dist * Math.cos(dir)
  const py = y + dist * Math.sin(dir)
  return [px, py]
}

/**
 * Retorna o ângulo formado pelas retas:
 * - de (x,y) à projeção de (x,y) na direção dir
 * - de (x,y) a (tx, ty)
 */
function calcAngleToTarget(x, y, dir, tx, ty) {
  const dist = distance(x, y, tx, ty)
  const [fx, fy] = projectPoint(x, y, dir, dist)
  let angle = Math.atan2(ty - y, tx - x) - Math.atan2(fy - y, fx - x)
  if (angle < -Math.PI) angle += 2*Math.PI
  if (angle > Math.PI) angle -= 2*Math.PI
  return angle
}