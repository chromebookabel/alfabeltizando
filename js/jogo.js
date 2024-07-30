const gridCartas = document.querySelector('#cartas')
const menuInicial = document.querySelector('#menu-inicial')
const jogo = document.querySelector('#jogo')
const menuPausa = document.querySelector('.menu-de-pausa')
const menuConseguiu = document.querySelector('.menu-conseguiu')
const menuTempoAcabou= document.querySelector('.menu-tempo-acabou')
const fundo = document.querySelector('.fundo')
const body = document.querySelector('body')

const btnIniciarJogo = document.querySelector('.ri-play-circle-fill') 
const btnPausar = document.querySelector('.ri-pause-fill')
const botoesEncerrar = document.querySelectorAll('.encerrar-jogo')
const btnRetomar = document.querySelector('.retomar-jogo')
const botoesReiniciar = document.querySelectorAll('.reiniciar-jogo')

let loop
let minutos = 0
let segundos = 0
let primeiraCarta = ''
let segundaCarta = ''
let jogoEncerrado = false
let contRegressiva = false

const imagensModo1 = [
    'bola',
    'bola_inicial',
    'casa',
    'casa_inicial',
    'dado',
    'dado_inicial',
    'foca',
    'foca_inicial',
    'gato',
    'gato_inicial',
    'lua',
    'lua_inicial',
    'mala',
    'mala_inicial',
    'pato',
    'pato_inicial'
]

const imagensModo2 = [
    'bala',
    'bala_silaba',
    'bebe',
    'bebe_silaba',
    'bicicleta',
    'bicicleta_silaba',
    'bola',
    'bola_silaba',
    'bule',
    'bule_silaba',
]

const imagensModo3 = [
    'bola',
    'bola_palavra',
    'casa',
    'casa_palavra',
    'dado',
    'dado_palavra',
    'foca',
    'foca_palavra',
    'gato',
    'gato_palavra',
    'lua',
    'lua_palavra',
    'mala',
    'mala_palavra',
    'pato',
    'pato_palavra'
]

const criarElemento = (tag, className) => {
    const elemento = document.createElement(tag)
    elemento.className = className
    return elemento
}

const checarFimDeJogo = () => {
    const cartasDesabilitadas = document.querySelectorAll('.carta-desabilitada')

    setTimeout(() => {
        if(cartasDesabilitadas.length == imagensModo3.length) {
            clearInterval(loop)
            //alert('Parabéns! Você conseguiu!')
            ativarMenuSecundario('conseguiu')
            jogoEncerrado = true
        }
    }, 500)
}

const checarCartas = () => {
    const primeiraImagem = primeiraCarta.getAttribute('data-imagem')
    const segundaImagem = segundaCarta.getAttribute('data-imagem')

    if (primeiraImagem == segundaImagem) {
        primeiraCarta.firstChild.classList.add('carta-desabilitada')
        segundaCarta.firstChild.classList.add('carta-desabilitada')

        primeiraCarta = ''
        segundaCarta = ''

        checarFimDeJogo()
    }
    else {
        setTimeout(() => {
            primeiraCarta.classList.remove('revelar-carta')
            segundaCarta.classList.remove('revelar-carta')

            primeiraCarta = ''
            segundaCarta = ''
        }, 500)
    }
}

const revelarCarta = ( { target } ) => {
    if (target.parentNode.className.includes('revelar-carta')) {
        return
    }

    if (primeiraCarta == '') {
        target.parentNode.classList.add('revelar-carta')
        primeiraCarta = target.parentNode
    } else if(segundaCarta == '') {
        target.parentNode.classList.add('revelar-carta')
        segundaCarta = target.parentNode

        checarCartas()
    }
}

const criarCarta = (imagem) => {
    const carta = criarElemento('div', 'carta')
    const frente = criarElemento('div', 'face frente')
    const traseira = criarElemento('div', 'face traseira')

    //frente.style.backgroundImage = `url('../imagens/modo3/${imagem}.png')`
    frente.style.backgroundImage = `url('https://chromebookabel.github.io/alfabeltizando/imagens/modo3/${imagem}.png')`

    carta.appendChild(frente)
    carta.appendChild(traseira)

    carta.addEventListener('click', revelarCarta)

    const nomeImagem = imagem.split('_')[0] // Pega o nome antes do '_'
    carta.setAttribute('data-imagem', nomeImagem)

    return carta
}

const carregarJogo = () => {
    jogoEncerrado = false

    const cartasSortidas = imagensModo3.sort( () => Math.random() - 0.5)

    cartasSortidas.forEach((imagem) => {
        const carta = criarCarta(imagem)
        gridCartas.appendChild(carta)
    })

    clearInterval(loop)
    minutos = 0
    segundos = 15
    atualizarCronometro()

    const cartas = document.querySelectorAll('.carta')
    cartas.forEach(carta => {
        carta.classList.add('revelar-carta')
    })

    iniciarContagemRegressiva()
}



const formatarTempo = (val) => {
    if (val < 10) {
      return "0" + val
    } else {
      return val.toString()  // Garantindo que o retorno seja sempre uma string
    }
}
  
const atualizarCronometro = () => {
    document.querySelector('.minutos').textContent = formatarTempo(minutos)
    document.querySelector('.segundos').textContent = formatarTempo(segundos)
}

const atualizarTempo = () => {
    if (minutos === 10 && segundos === 0) {
        clearInterval(loop)
        return
    }
    
    if (segundos === 59) {
        minutos++
        segundos = 0
    } else {
        segundos++
    }

    atualizarCronometro()
}

const iniciarTempo = () => {
    loop = setInterval(atualizarTempo, 1000)
}

const pausarTempo = () => {
    clearInterval(loop)
}

const resetarTempo = () => {
    clearInterval(loop)
    minutos = 0
    segundos = 15

    atualizarCronometro()
}

const pararTempo = () => {
    clearInterval(loop)
}

const iniciarContagemRegressiva = () => {
    contRegressiva = true

    loop = setInterval(() => {
        if (segundos > 0 && segundos <= 15) {
            segundos--
        } 
        else if (segundos === 0) {
            clearInterval(loop)
    
            const cartas = document.querySelectorAll('.carta')
            cartas.forEach(carta => {
                carta.classList.remove('revelar-carta')
            })
            
            contRegressiva = false
            iniciarTempo()
        }

        atualizarCronometro()
    }, 1000)
}



const ativarMenuSecundario = (menu) => {
    body.style.overflow = 'hidden'
    fundo.classList.add('fundo-ativo')

    if(menu=='pausa') {
        menuPausa.classList.add('menu-pausa-ativo')
    }
    else if(menu=='conseguiu') {
        menuConseguiu.classList.add('menu-conseguiu-ativo')
    }
    else if(menu=='tempo_acabou') {
        menuConseguiu.classList.add('menu-tempo-acabou-ativo')
    }
}

const desativarMenuSecundario = (menu) => {
    body.style.overflow = 'auto'
    fundo.classList.remove('fundo-ativo')

    // Verificar o tipo de menu e aplicar as classes apropriadas
    if (menu === 'pausa') {
        menuPausa.classList.remove('menu-pausa-ativo')
    } else if (menu === 'conseguiu') {
        menuConseguiu.classList.remove('menu-conseguiu-ativo')
    } else if (menu === 'tempo_acabou') {
        menuConseguiu.classList.remove('menu-tempo-acabou-ativo')
    }
}

const alterarDisplayDoBody = (displayFinal) => {
    if(displayFinal == 'padrao') {
        body.style.display = 'block'
    }
    else {
        body.style.display = 'flex'
        body.style.justifyContent = 'center'
        body.style.alignItems = 'center'
    }
}


const pausarJogo = () => {
    const cartas = document.querySelectorAll('.carta')
    cartas.forEach(carta => {
        carta.removeEventListener('click', revelarCarta)
    })

    pausarTempo()
    ativarMenuSecundario('pausa')
}
btnPausar.addEventListener('click', pausarJogo)


const retomarJogo = () => {
    if(!jogoEncerrado) {
        const cartas = document.querySelectorAll('.carta')
        cartas.forEach(carta => {
            carta.addEventListener('click', revelarCarta)
        })

        desativarMenuSecundario('pausa')

        if(contRegressiva === true) {
            iniciarContagemRegressiva()
        }
        else {
            iniciarTempo()
        }
    }
    else {
        return
    }
}
btnRetomar.addEventListener('click', function() {
    setTimeout(retomarJogo, 700)
})


const reiniciarJogo = (menuAtivo) => {
    jogoEncerrado = true
    
    desativarMenuSecundario(menuAtivo)

    // Limpar o conteúdo atual do grid de cartas
    gridCartas.innerHTML = ''

    // Limpar variáveis de controle
    primeiraCarta = ''
    segundaCarta = ''
    resetarTempo()

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Para uma rolagem suave
    })

    carregarJogo()
}
const handleClickReiniciar = (menuAtivo) => {
    setTimeout(function() {
        reiniciarJogo(menuAtivo)
    }, 700)
}
botoesReiniciar.forEach(botao => {
    botao.addEventListener('click', function() {
        // Determinar o parâmetro específico com base no menu associado ao botão
        let menuAtivo

        if (botao.classList.contains('btn-menu-pausa')) {
            menuAtivo = 'pausa'
        } else if (botao.classList.contains('btn-menu-conseguiu')) {
            menuAtivo = 'conseguiu'
        } else if (botao.classList.contains('btn-menu-tempo-acabou')) {
            menuAtivo = 'tempo_acabou'
        }

        handleClickReiniciar(menuAtivo)
    })
})


const iniciarJogo = () => {
    menuInicial.style.display = 'none'
    alterarDisplayDoBody('padrao')
    jogo.classList.add('jogo-ativo')

    carregarJogo()
}
btnIniciarJogo.addEventListener('click', iniciarJogo)


const encerrarJogo = (menuAtivo) => {
    jogoEncerrado = true

    desativarMenuSecundario(menuAtivo)
    jogo.classList.remove('jogo-ativo')

    // Limpar o conteúdo atual do grid de cartas
    gridCartas.innerHTML = ''

    // Limpar variáveis de controle
    primeiraCarta = ''
    segundaCarta = ''
    resetarTempo()

    alterarDisplayDoBody()
    menuInicial.style.display = 'grid'
}
const handleClickEncerrar = (menuAtivo) => {
    setTimeout(function() {
        encerrarJogo(menuAtivo)
    }, 700)
}
botoesEncerrar.forEach(botao => {
    botao.addEventListener('click', function() {
        // Determinar o parâmetro específico com base no menu associado ao botão
        let menuAtivo

        if (botao.classList.contains('btn-menu-pausa')) {
            menuAtivo = 'pausa'
        } else if (botao.classList.contains('btn-menu-conseguiu')) {
            menuAtivo = 'conseguiu'
        } else if (botao.classList.contains('btn-menu-tempo-acabou')) {
            menuAtivo = 'tempo_acabou'
        }

        handleClickEncerrar(menuAtivo)
    })
})