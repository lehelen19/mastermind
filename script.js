/*----- constants -----*/
const CHOICES = [0, 1, 2, 3, 4, 5];
const GUESS_LEN = 4;

/*----- state variables -----*/
let turn;
let winner;
let board;
let curGuess;
let code;

/*----- cached elements  -----*/
const choiceContainerEl = document.getElementById('choice-container');
const choiceEls = document.querySelectorAll('#choice-container > div');
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
  console.log(curGuess);
});

deleteBtn.addEventListener('click', function (e) {
  if (curGuess.length > 0) {
    curGuess.pop();
  }
  console.log(curGuess);
});

clearBtn.addEventListener('click', function () {
  if (curGuess.length > 0) {
    curGuess = [];
  }
  console.log(curGuess);
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
    console.log('GUESS IS NOT COMPLETE.');
    return;
  }
  // Interpret guess here
  let codeCopy = { ...code };
  let exactMatch = 0;
  let closeMatch = 0;
  console.log(codeCopy);
  curGuess.forEach(function (guess, i) {
    if (guess === codeCopy[i]) {
      exactMatch += 1;
      curGuess[i] = -1;
      codeCopy[i] = -1;
    }
  });
  console.log('after', codeCopy);
  console.log('after', curGuess);
  curGuess.forEach(function (guess) {
    if (guess > -1) {
      if (Object.values(codeCopy).includes(guess)) {
        closeMatch += 1;
      }
    }
  });
  console.log('exact', exactMatch);
  console.log('close', closeMatch);

  // Reset guess
  curGuess = [];
}
