# Exemplo de implementação de uma Máquina de Estados

Este código tem como objetivo ilustrar 3 formas de implementar uma máquina de estados:
1. usando condicionais (switch, if)
2. usando uma matriz de transição
3. usando objetos

O construtor da classe Unit (em `unit.js`) chama um método específico para a forma de implementação:
* initConditionBasedFSM()
* initMatrixBasedFSM()
* initObjectBasedFSM()

Escolha qual quer testar e comente os demais.

Para testar as modificações, execute:
```sh
node build
```
...e depois recarregue o `index.html`

No "jogo", você (jogador) controla o personagem verde usando as teclas W (ir em frente), A (girar à esquerda), D (girar à direita) e ' ' (tiro), enquanto a IA controla o personagem azul, fazendo-o proteger a "joia" do jogador. A imagem abaixo mostra a máquina de estado implementada (o ponto preto indica o estado inicial).

![MEF](./dist/mef.png)