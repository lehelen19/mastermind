/*----- constants -----*/
const CHOICES = [0, 1, 2, 3, 4, 5];
const GUESS_LEN = 4;
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
const guessContainerEls = [...document.querySelectorAll('.guess-container')];
const turnEl = document.getElementById('turn');
const choiceContainerEl = document.getElementById('choice-container');
const choiceEls = document.querySelectorAll('#choice-container > div');
const miniboardEls = [...document.querySelectorAll('.miniboard > div')];
const deleteBtn = document.getElementById('delete-btn');
const clearBtn = document.getElementById('clear-btn');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');

/*----- event listeners -----*/
choiceContainerEl.addEventListener('click', function (e) {
  if (e.target.id || curGuess.length === GUESS_LEN) {
    return;
  }
  if (curGuess.length < GUESS_LEN) {
    curGuess.push(Number(e.target.dataset.index));
    renderCurGuess();
  }
});

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

resetBtn.addEventListener('click', init);

/*----- functions -----*/
init();
function init() {
  // Clear board
  // clearBoard();

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
  if (curGuess.length !== GUESS_LEN) {
    // TODO: Render user error message to screen
    console.log('GUESS IS NOT COMPLETE.');
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
  // CHECK FOR WIN/LOSS CONDITION
  // TODO: Disable further guesses if either condition is met
  if (exactMatch === GUESS_LEN) {
    console.log('You have won!');
  } else if (turn === 12) {
    // CHECK FOR LOSS CONDITION
    console.log('You have lost.');
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
    guessContainerEls[turn - 2].style.border = 'none';
  }
  guessContainerEls[turn - 1].style.border = '2px solid lightblue';
  turnEl.innerText = ' ' + turn;
}
