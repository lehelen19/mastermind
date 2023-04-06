/*----- constants -----*/
const CHOICES = [0, 1, 2, 3, 4, 5];
const GUESS_LEN = 4;
const TURN_MAX = 12;
const COLORS_MAP = {
  0: '#c44601',
  1: '#0073e6',
  2: '#5ba300',
  3: '#e6308a',
  4: '#55245b',
  5: '#c08300',
};

/*----- state variables -----*/
let turn;
let curGuess;
let code;

/*----- cached elements  -----*/
const errorMsgEl = document.querySelector('.error-msg');
const resultMsgEl = document.querySelector('.result-msg');
const guessContainerEls = [...document.querySelectorAll('.guess-container')];
const turnEl = document.getElementById('turn');
const choiceContainerEl = document.getElementById('choice-container');
const miniboardEls = [...document.querySelectorAll('.miniboard > div')];
const prevGuessesEls = [
  ...document.querySelectorAll('.colors-container > div'),
];
const deleteBtn = document.getElementById('delete-btn');
const clearBtn = document.getElementById('clear-btn');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const showBtn = document.getElementById('show-btn');
const codeBox = document.getElementById('code-box');
const codeEls = [
  ...document
    .getElementById('code-box')
    .querySelectorAll('.colors-container > div'),
];

/*----- event listeners -----*/
choiceContainerEl.addEventListener('click', updateGuess);

deleteBtn.addEventListener('click', function () {
  deleteGuess();
  renderCurGuess();
});

clearBtn.addEventListener('click', function () {
  clearGuess();
  renderCurGuess();
});

submitBtn.addEventListener('click', handleGuessSubmit);

resetBtn.addEventListener('click', resetGame);

showBtn.addEventListener('click', toggleCode);

/*----- functions -----*/
init();
function init() {
  turn = 1;
  curGuess = [];
  code = generateCode();

  renderCode();
  renderTurn();
}

function generateCode() {
  const code = [];
  for (let i = 0; i < GUESS_LEN; i++) {
    const randInt = Math.floor(Math.random() * 6);
    code.push(randInt);
  }
  return code;
}

function clearGuess() {
  if (curGuess.length > 0) {
    curGuess = [];
  }
}

function deleteGuess() {
  if (curGuess.length > 0) {
    curGuess.pop();
  }
}

function clearErrorMsg() {
  errorMsgEl.innerText = '';
  errorMsgEl.classList.remove('animate__animated', 'animate__headShake');
}

function handleGuessSubmit() {
  clearErrorMsg();

  if (curGuess.length !== GUESS_LEN) {
    errorMsgEl.classList.add('animate__animated', 'animate__headShake');
    errorMsgEl.innerText = 'Your guess must be four colors!';
    return;
  }

  let codeCopy = [...code];
  let exactMatch = 0;
  let closeMatch = 0;

  curGuess.forEach(function (guess, i) {
    if (guess === codeCopy[i]) {
      exactMatch += 1;
      curGuess[i] = -1;
      codeCopy[i] = -1;
    }
  });

  curGuess.forEach(function (guess, i) {
    const index = codeCopy.indexOf(guess);
    if (guess > -1 && index > -1) {
      closeMatch += 1;
      codeCopy[index] = -1;
    }
  });

  renderMiniboard(exactMatch, closeMatch);

  if (exactMatch === GUESS_LEN || turn === TURN_MAX) {
    deleteBtn.disabled = true;
    clearBtn.disabled = true;
    submitBtn.disabled = true;
    choiceContainerEl.removeEventListener('click', updateGuess);
  }
  if (exactMatch === GUESS_LEN) {
    resultMsgEl.innerText = "You win! You're a mastermind 🧐";
    resultMsgEl.classList.add('animate__animated', 'animate__jackInTheBox');
    return;
  } else if (turn === TURN_MAX) {
    resultMsgEl.innerText = 'Maybe next time... 😪';
    resultMsgEl.classList.add('animate__animated', 'animate__zoomIn');
    return;
  }

  // Clear player guess
  curGuess = [];

  // Render next turn
  turn += 1;
  renderTurn();
}

function renderMiniboard(exactCount, closeCount) {
  const miniboardDivArr = [
    ...document.getElementById(`${turn}`).querySelectorAll('.miniboard > div'),
  ];

  miniboardDivArr.forEach(function (div, i) {
    div.style.backgroundColor = 'red';
  });

  for (let i = 0; i < exactCount; i++) {
    miniboardDivArr[i].style.backgroundColor = 'green';
  }
  for (let i = exactCount; i < exactCount + closeCount; i++) {
    miniboardDivArr[i].style.backgroundColor = 'yellow';
  }
}

function renderCurGuess() {
  const guessDivArr = [
    ...document
      .getElementById(`${turn}`)
      .querySelectorAll('.colors-container > div'),
  ];
  guessDivArr.forEach(function (div) {
    div.style.backgroundColor = 'transparent';
  });
  curGuess.forEach(function (guess, i) {
    guessDivArr[i].style.backgroundColor = COLORS_MAP[guess];
  });
}

function renderTurn() {
  if (turn > 1) {
    guessContainerEls[turn - 2].style.backgroundColor = 'transparent';
    guessContainerEls[turn - 2].style.border = 'none';
  }
  guessContainerEls[turn - 1].style.backgroundColor = '#a393eb';
  guessContainerEls[turn - 1].style.border = '2px solid #5e63b6';
  turnEl.innerText = ' ' + turn;
}

function resetBoard() {
  guessContainerEls[turn - 1].style.border = 'none';
  guessContainerEls[turn - 1].style.backgroundColor = 'transparent';

  prevGuessesEls.forEach(function (div) {
    div.style.backgroundColor = 'transparent';
  });
  miniboardEls.forEach(function (div) {
    div.style.backgroundColor = 'lightgray';
  });

  deleteBtn.disabled = false;
  clearBtn.disabled = false;
  submitBtn.disabled = false;

  resultMsgEl.innerText = '';
  resultMsgEl.classList.remove(
    'animate__animated',
    'animate__jackInTheBox',
    'animate__zoomIn'
  );

  choiceContainerEl.addEventListener('click', updateGuess);
}

function resetGame() {
  resetBoard();
  init();
}

function updateGuess(e) {
  if (e.target.id || curGuess.length === GUESS_LEN) {
    return;
  }
  if (curGuess.length < GUESS_LEN) {
    curGuess.push(Number(e.target.dataset.index));
    renderCurGuess();
  }
}

function renderCode() {
  Object.values(code).forEach(function (guess, i) {
    codeEls[i].style.backgroundColor = COLORS_MAP[guess];
  });
}

function toggleCode() {
  if (codeBox.style.visibility === 'visible') {
    codeBox.style.visibility = 'hidden';
    showBtn.innerText = 'Show Code';
  } else {
    codeBox.style.visibility = 'visible';
    showBtn.innerText = 'Hide Code';
  }
}
