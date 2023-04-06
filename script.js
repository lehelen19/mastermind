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
const miniboardEl = [...document.querySelectorAll('.miniboard')];
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

function deleteGuess() {
  if (curGuess.length > 0) {
    curGuess.pop();
  }
}

function clearGuess() {
  if (curGuess.length > 0) {
    curGuess = [];
  }
}

function handleGuessSubmit() {
  clearErrorMsg();

  if (curGuess.length !== GUESS_LEN) {
    renderErrorMsg();
    return;
  }

  // Render game logic
  [exactMatch, closeMatch] = checkForMatches();
  renderMiniboard(exactMatch, closeMatch);

  // Disable game functionality if game is over
  if (exactMatch === GUESS_LEN || turn === TURN_MAX) {
    deleteBtn.disabled = true;
    clearBtn.disabled = true;
    submitBtn.disabled = true;
    choiceContainerEl.removeEventListener('click', updateGuess);
  }

  // Render win/loss messages
  if (exactMatch === GUESS_LEN) {
    renderWin();
    return;
  } else if (turn === TURN_MAX) {
    renderLoss();
    return;
  }

  // Clear player guess
  curGuess = [];

  // Render next turn
  turn += 1;
  renderTurn();
}

function checkForMatches() {
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

  return [exactMatch, closeMatch];
}

function renderWin() {
  resultMsgEl.innerText = "You win! You're a mastermind 🧐";
  resultMsgEl.classList.add('animate__animated', 'animate__jackInTheBox');
}

function renderLoss() {
  resultMsgEl.innerText = 'Maybe next time... 😪';
  resultMsgEl.classList.add('animate__animated', 'animate__zoomIn');
}

function renderErrorMsg() {
  errorMsgEl.classList.add('animate__animated', 'animate__headShake');
  errorMsgEl.innerText = 'Your guess must be four colors!';
}

function clearErrorMsg() {
  errorMsgEl.innerText = '';
  errorMsgEl.classList.remove('animate__animated', 'animate__headShake');
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

function clearTurnHighlight() {
  guessContainerEls[turn - 1].style.border = 'none';
  guessContainerEls[turn - 1].style.backgroundColor = 'transparent';
}

function clearBoards() {
  prevGuessesEls.forEach(function (div) {
    div.style.backgroundColor = 'transparent';
  });
  miniboardEls.forEach(function (div) {
    div.style.backgroundColor = 'lightgray';
  });
}

function enableButtons() {
  deleteBtn.disabled = false;
  clearBtn.disabled = false;
  submitBtn.disabled = false;
}

function clearResultMsg() {
  resultMsgEl.innerText = '';
  resultMsgEl.classList.remove(
    'animate__animated',
    'animate__jackInTheBox',
    'animate__zoomIn'
  );
}

function resetBoard() {
  clearTurnHighlight();
  clearBoards();
  enableButtons();
  clearResultMsg();
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
  code.forEach(function (guess, i) {
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
