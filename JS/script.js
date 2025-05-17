const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.querySelector('.score');
const btnStart = document.querySelector('.btn-start');
const btnReset = document.querySelector('.btn-reset');

let score = 0;
let maxScore = localStorage.getItem('maxScore') || 0;
let scored = false;
let gameRunning = false;
let loop = null;

scoreElement.innerHTML = `Score: ${score}<br>Max: ${maxScore}`;

// Função de pulo
const jump = () => {
  console.log('Tentou pular', gameRunning); // Para depuração
  if (!gameRunning) return;
  if (!mario.classList.contains('jump')) {
    mario.classList.add('jump');
    setTimeout(() => {
      mario.classList.remove('jump');
    }, 500);
  }
};

// Função principal do jogo
function gameLoop() {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  if (pipePosition < 0 && !scored) {
    score++;
    scored = true;
    if (score > maxScore) {
      maxScore = score;
      localStorage.setItem('maxScore', maxScore);
    }
    scoreElement.innerHTML = `Score: ${score}<br>Max: ${maxScore}`;
  }
  if (pipePosition > 120) {
    scored = false;
  }

  // Verifica colisão
  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    mario.src = 'Images/game-over.png';
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    clearInterval(loop);
    gameRunning = false;
    btnReset.style.display = 'block';
  }
}

// Iniciar o jogo
function startGame() {
  clearInterval(loop); // Garante que não há múltiplos loops

  // Resetar variáveis e estilos
  score = 0;
  scored = false;
  mario.src = 'Images/mario.gif';
  mario.style.width = '150px';
  mario.style.marginLeft = '0px';
  mario.style.bottom = '0px';
  // Força o reset da animação do pipe
  pipe.style.animation = 'none';
  void pipe.offsetWidth; // Força reflow para reiniciar a animação
  pipe.style.animation = 'pipe-animation 1s infinite linear';
  pipe.style.left = '';
  scoreElement.innerHTML = `Score: ${score}<br>Max: ${maxScore}`;
  btnStart.style.display = 'none';
  btnReset.style.display = 'none';

  // Iniciar o loop do jogo
  gameRunning = true;
  loop = setInterval(gameLoop, 10);
}

// Resetar o jogo (volta para tela inicial)
function resetGame() {
  location.reload();
}

// Tocar música de fundo ao abrir o site ou na primeira interação
window.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
    bgMusic.volume = 0.5; // Ajuste o volume se quiser
    bgMusic.play().catch(() => {
      // Se o navegador bloquear, toca no primeiro clique
      document.body.addEventListener('click', () => {
        bgMusic.play();
      }, { once: true });
    });
  }
});


// Eventos dos botões
btnStart.addEventListener('click', startGame);
btnReset.addEventListener('click', resetGame);

// Eventos de pulo só funcionam durante o jogo
document.addEventListener('keydown', (e) => {
  if (gameRunning) jump();
});
document.addEventListener('mousedown', (e) => {
  if (gameRunning) jump();
});
document.addEventListener('touchstart', (e) => {
  if (gameRunning) jump();
});