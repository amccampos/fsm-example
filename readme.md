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

No "jogo", você (usuário) controla o personagem verde e a IA controla o personagem azul, fazendo-o proteger a "joia" do jogador. A imagem abaixo mostra a máquina de estado implementada (o ponto preto indica o estado inicial).

![MEF](./dist/mef.png)