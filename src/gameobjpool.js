
let objs = []

/** Conjunto de todos os objetos do jogo. */
class ObjPool {
  /** propriedade para acessar os objetos do jogo. */
  get objs()  { return objs }

  /** insere um objeto no jogo. */
  add(obj)    { objs.push(obj) }

  /** remove um objeto do jogo. */
  remove(obj) { objs = objs.filter(o => o !== obj) }

  /** remove todos os objetos do jogo. */
  reset()     { objs = [] }
}

/** gameObjPool é um singleton com o conjunto dos objetos do jogo. */
export const gameObjPool = Object.freeze(new ObjPool())