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
let winner;
let board;
let curGuess;
let code;

/*----- cached elements  -----*/
const gameboardEl = document.getElementById('gameboard');
const errorMsgEl = document.querySelector('.error-msg');
const resultMsgEl = document.querySelector('.result-msg');
const guessContainerEls = [...document.querySelectorAll('.guess-container')];
const turnEl = document.getElementById('turn');
const choiceContainerEl = document.getElementById('choice-container');
const choiceEls = document.querySelectorAll('#choice-container > div');
const miniboardEls = [...document.querySelectorAll('.miniboard > div')];
const prevGuessesEls = [
  ...document.querySelectorAll('.colors-container > div'),
];
const deleteBtn = document.getElementById('delete-btn');
const clearBtn = document.getElementById('clear-btn');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');

/*----- event listeners -----*/
choiceContainerEl.addEventListener('click', updateGuess);

deleteBtn.addEventListener('click', function (e) {
  if (curGuess.length > 0) {
    curGuess.pop();
  }
  renderCurGuess();
});

clearBtn.addEventListener('click', function () {
  if (curGuess.length > 0) {
    curGuess = [];
  }
  renderCurGuess();
});

submitBtn.addEventListener('click', handleGuessSubmit);

resetBtn.addEventListener('click', resetGame);

/*----- functions -----*/
init();
function init() {
  // Initialize state variables
  turn = 1;
  curGuess = [];
  code = generateCode();

  // Render current turn
  renderTurn();

  console.log('Game initialized.');
}

function generateCode() {
  const code = [];
  for (let i = 0; i < GUESS_LEN; i++) {
    const randInt = Math.floor(Math.random() * 6);
    code.push(randInt);
  }
  return { ...code };
}

function handleGuessSubmit() {
  // Clear any previous error messages
  errorMsgEl.innerText = '';

  if (curGuess.length !== GUESS_LEN) {
    errorMsgEl.innerText = 'Your guess must be four colors!';
    return;
  }

  // Interpret guess here
  let codeCopy = { ...code };
  let curGuessCopy = [...curGuess];
  let exactMatch = 0;
  let closeMatch = 0;

  curGuessCopy.forEach(function (guess, i) {
    if (guess === codeCopy[i]) {
      exactMatch += 1;
      curGuessCopy[i] = -1;
      codeCopy[i] = -1;
    }
  });

  curGuessCopy.forEach(function (guess, i) {
    if (guess > -1) {
      if (Object.values(codeCopy).includes(guess)) {
        closeMatch += 1;
        codeCopy[i] = -1;
      }
    }
  });

  renderMiniboard(exactMatch, closeMatch);

  // TODO: Render win/loss message
  // TODO: Disable further guesses if either condition is met
  if (exactMatch === GUESS_LEN || turn === TURN_MAX) {
    deleteBtn.disabled = true;
    clearBtn.disabled = true;
    submitBtn.disabled = true;
    choiceContainerEl.removeEventListener('click', updateGuess);
  }
  if (exactMatch === GUESS_LEN) {
    resultMsgEl.innerText = 'You win!!!';
  } else if (turn === TURN_MAX) {
    resultMsgEl.innerText = 'You lost... try again?';
  }

  // Clear player guess
  curGuess = [];

  if (turn === 12) {
    return;
  }

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
    if (i < exactCount) {
      div.style.backgroundColor = 'green';
    } else if (i >= exactCount && i < closeCount) {
      div.style.backgroundColor = 'yellow';
    }
  });
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
