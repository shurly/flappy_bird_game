console.log('Flappy Bird [Shurly]');


let frames = 0;
const som_hit = new Audio();
som_hit.src = './efeitos/hit.wav';

const som_hit2 = new Audio();
som_hit2.src = './efeitos/pulo.wav';

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
        pulo: 2,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.10,
        velocidade: 0,
        atualiza() {
            if (colisão(flappyBird, globais.chao)) {
                som_hit.play();

              
                    mudaTela(telas.gameOver);
              

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


function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            canos.pares.forEach(function (par) {
                const randomY = par.y;
                const espacoCanos = 90;

                const canoCeuX = par.x;
                const canoCeuY = randomY;

                //Canos do Céu
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,//Sprite x e sprite y
                    canos.largura, canos.altura, //tamanho do recorte da imagem do sprite
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                );

                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacoCanos + randomY;
                //Canos do Chão
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,//Sprite x e sprite y
                    canos.largura, canos.altura, //tamanho do recorte da imagem do sprite
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )
                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })

        },
        colidiuFlappy(par) {
            const cabecaFlappy = globais.flappyBird.y + (globais.flappyBird.altura - 1);
            const peFlappy = globais.flappyBird.y + (globais.flappyBird.altura - 2);

            if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
                if (cabecaFlappy <= par.canoCeu.y) {
                    return true;
                }

                if (peFlappy >= par.canoChao.y) {
                    return true;
                }

            }


            return false;
        },
        pares: [],
        atualiza() {
            const passou100Frames = frames % 100 === 0;
            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            canos.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (canos.colidiuFlappy(par)) {
                    som_hit.play();
                    mudaTela(telas.gameOver);
                    
                }

                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });

        },
    }
    return canos;
}


function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha() {
            contexto.font = '35px "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = 'white';
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);

        },
        atualiza() {
            const intervaloFrames = 100;
            const passouIntervalo = frames % intervaloFrames === 0;

            if (passouIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
            }

        },
    }

    return placar;
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

//Tela de Game Over
const mensagemGameOver = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    pontuacao: 0,
    desenha() {
           
        contexto.drawImage(
            sprites,
            mensagemGameOver.spriteX, mensagemGameOver.spriteY,//Sprite x e sprite y
            mensagemGameOver.largura, mensagemGameOver.altura, //tamanho do recorte da imagem do sprite
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura, mensagemGameOver.altura,
        );
        //Pontuação do Score Game Over
        contexto.font = '35px "VT323"';
        contexto.textAlign = 'right';
        contexto.fillStyle = 'black';
        contexto.fillText(`${globais.placar.pontuacao}`, canvas.width - 70, 150);
        //Medalha
        

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
            globais.canos = criaCanos();
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
    inicializa() {
        globais.placar = criaPlacar();
    },
    desenha() {
        planoFundo.desenha(); //Seguir a ordem de desenho para um não sobressair o outro
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
        globais.placar.desenha();
    },
    click() {
        som_hit2.play();
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
        globais.placar.atualiza();

    }
};

//Game Over
telas.gameOver = {
    desenha() {
        mensagemGameOver.desenha();
    },
    atualiza() {

    },
    click() {
        mudaTela(telas.inicio);
    },
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