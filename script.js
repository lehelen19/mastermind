/*----- constants -----*/
const CHOICES = [0, 1, 2, 3, 4, 5];
const GUESS_LEN = 4;
const COLORS_MAP = {
  0: 'pink',
  1: 'lightgreen',
  2: 'lightblue',
  3: 'palevioletred',
  4: 'blueviolet',
  5: 'yellow',
};

/*----- state variables -----*/
let turn;
let winner;
let board;
let curGuess;
let code;

/*----- cached elements  -----*/
const gameboardEl = document.getElementById('gameboard');
const turnEl = document.getElementById('turn');
const curGuessEls = [...document.querySelectorAll('#player-guess > div')];
const choiceContainerEl = document.getElementById('choice-container');
const choiceEls = document.querySelectorAll('#choice-container > div');
const miniboardEls = [...document.querySelectorAll('.miniboard > div')];
const guessContainerEls = [
  ...document.querySelectorAll('.guess-container > div.colors-container > div'),
];
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

  curGuessCopy.forEach(function (guess) {
    if (guess > -1) {
      if (Object.values(codeCopy).includes(guess)) {
        closeMatch += 1;
      }
    }
  });

  renderGuess(exactMatch, closeMatch);

  turn += 1;
  renderTurn();

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
  renderCurGuess();
}

function renderGuess(exactCount, closeCount) {
  // Render submitted guess
  const guessContainerDiv = document.createElement('div');
  guessContainerDiv.className = 'guess-container';

  const colorsContainerDiv = document.createElement('div');
  colorsContainerDiv.className = 'colors-container';
  for (let i = 0; i < 4; i++) {
    const colorDiv = document.createElement('div');
    colorDiv.style.backgroundColor = COLORS_MAP[curGuess[i]];
    colorsContainerDiv.appendChild(colorDiv);
  }
  guessContainerDiv.appendChild(colorsContainerDiv);

  // Render miniboard
  const miniboardDiv = document.createElement('div');
  miniboardDiv.className = 'miniboard';
  for (let i = 0; i < 4; i++) {
    const miniColorDiv = document.createElement('div');
    if (i < exactCount) {
      miniColorDiv.style.backgroundColor = 'green';
    } else if (i >= exactCount && i < closeCount) {
      miniColorDiv.style.backgroundColor = 'yellow';
    }
    miniboardDiv.appendChild(miniColorDiv);
  }
  guessContainerDiv.appendChild(miniboardDiv);

  gameboardEl.appendChild(guessContainerDiv);
}

function renderCurGuess() {
  curGuessEls.forEach(function (el) {
    el.style.backgroundColor = 'transparent';
  });
  curGuess.forEach(function (guess, i) {
    curGuessEls[i].style.backgroundColor = COLORS_MAP[guess];
  });
}

function renderTurn() {
  turnEl.innerText = ' ' + turn;
}

function clearBoard() {
  while (gameboardEl.childNodes.length > 2) {
    gameboardEl.removeChild(gameboardEl.lastChild);
  }
}
