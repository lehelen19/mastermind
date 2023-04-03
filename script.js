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
const choiceContainerEl = document.getElementById('choice-container');
const choiceEls = document.querySelectorAll('#choice-container > div');
const miniboardEls = [...document.querySelectorAll('.miniboard > div')];
const guessContainerEls = [
  ...document.querySelectorAll('.guess-container > div.colors-container > div'),
];
const deleteBtn = document.getElementById('delete-btn');
const clearBtn = document.getElementById('clear-btn');
const submitBtn = document.getElementById('submit-btn');

/*----- event listeners -----*/
choiceContainerEl.addEventListener('click', function (e) {
  if (e.target.id) {
    return;
  }
  if (curGuess.length < GUESS_LEN) {
    curGuess.push(Number(e.target.dataset.index));
  }
});

deleteBtn.addEventListener('click', function (e) {
  if (curGuess.length > 0) {
    curGuess.pop();
  }
});

clearBtn.addEventListener('click', function () {
  if (curGuess.length > 0) {
    curGuess = [];
  }
});

submitBtn.addEventListener('click', handleGuessSubmit);

/*----- functions -----*/
init();
function init() {
  console.log('Game initialized.');
  curGuess = [];
  code = generateCode();
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

  // TODO: Render new guess + new miniboard
  renderGuess(exactMatch, closeMatch);

  // Reset guess
  curGuess = [];
}

function renderGuess(exactCount, closeCount) {
  // TODO: Render guess
  guessContainerEls.forEach(function (guess, i) {
    guess.style.backgroundColor = COLORS_MAP[curGuess[i]];
  });

  // Render miniboard
  for (let i = 0; i < exactCount; i++) {
    miniboardEls[i].style.backgroundColor = 'green';
  }
  for (let j = exactCount; j < closeCount; j++) {
    miniboardEls[j].style.backgroundColor = 'yellow';
  }
}
