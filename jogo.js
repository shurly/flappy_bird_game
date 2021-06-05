console.log('Flappy Bird [Shurly]');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


//Chão
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    desenha() {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,//Sprite x e sprite y
            chao.largura, chao.altura, //tamanho do recorte da imagem do sprite
            chao.x, chao.y,
            chao.largura, chao.altura,
        );

        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY,//Sprite x e sprite y
            chao.largura, chao.altura, //tamanho do recorte da imagem do sprite
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
        );
    }
}


//Fundo
const planoFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 104,
    x: 0,
    y: canvas.height - 215,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoFundo.spriteX, planoFundo.spriteY,//Sprite x e sprite y
            planoFundo.largura, planoFundo.altura, //tamanho do recorte da imagem do sprite
            planoFundo.x, planoFundo.y,
            planoFundo.largura, planoFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoFundo.spriteX, planoFundo.spriteY,//Sprite x e sprite y
            planoFundo.largura, planoFundo.altura, //tamanho do recorte da imagem do sprite
            (planoFundo.x + planoFundo.largura), planoFundo.y,
            planoFundo.largura, planoFundo.altura,
        );
    }
}


const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    atualiza(){
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenha() {
        contexto.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY,//Sprite x e sprite y
            flappyBird.largura, flappyBird.altura, //tamanho do recorte da imagem do sprite
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura,
        );
    },
}


//Tela de inicio
const mensagemInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemInicio.spriteX, mensagemInicio.spriteY,//Sprite x e sprite y
            mensagemInicio.largura, mensagemInicio.altura, //tamanho do recorte da imagem do sprite
            mensagemInicio.x, mensagemInicio.y,
            mensagemInicio.largura, mensagemInicio.altura,
        );
    }
}

//Telas
let telaAtiva = {};
function mudaTela(novaTela) {
    telaAtiva = novaTela;
}


const telas = {
    inicio: {
        desenha(){
            planoFundo.desenha(); //Seguir a ordem de desenho para um não sobressair o outro
            flappyBird.desenha();
            chao.desenha();
            mensagemInicio.desenha();
        },
        click(){
            mudaTela(telas.jogo);
        },
        atualiza(){

        },
    }
};

    telas.jogo = {
        desenha(){
            planoFundo.desenha(); //Seguir a ordem de desenho para um não sobressair o outro
            flappyBird.desenha();
            chao.desenha();
        },
        atualiza(){
            flappyBird.atualiza();

        }
    }



function loop() {
   
    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
});


mudaTela(telas.inicio);
loop();