console.log('Flappy Bird [Shurly]');


let frames = 0;
const som_hit = new Audio();
som_hit.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

function criaChao() {
    //Chão
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            chao.x = movimentacao % repeteEm;
        },
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
        },
    };
    return chao;
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

function colisão(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if (colisão(flappyBird, globais.chao)) {
                som_hit.play();

                setTimeout(() => {
                    mudaTela(telas.inicio);
                }, 500);

                return;
            }


            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
        ],
        frameAtual: 0,
        atualizarFrameAtual() {
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;
            if (passouIntervalo) {
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            flappyBird.atualizarFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY,//Sprite x e sprite y
                flappyBird.largura, flappyBird.altura, //tamanho do recorte da imagem do sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}



//Tela de inicio
const mensagemInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
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
const globais = {};
let telaAtiva = {};
function mudaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}


const telas = {
    inicio: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha() {
            planoFundo.desenha(); //Seguir a ordem de desenho para um não sobressair o outro
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemInicio.desenha();
        },
        click() {
            mudaTela(telas.jogo);
        },
        atualiza() {
            globais.chao.atualiza();

        },
    }
};

telas.jogo = {
    desenha() {
        planoFundo.desenha(); //Seguir a ordem de desenho para um não sobressair o outro
        globais.flappyBird.desenha();
        globais.chao.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
        globais.chao.atualiza();

    }
}



function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;

    requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});


mudaTela(telas.inicio);
loop();