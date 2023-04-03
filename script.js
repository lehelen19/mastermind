/*----- constants -----*/
const choices = [0, 1, 2, 3, 4, 5];

/*----- state variables -----*/
let turn;
let winner;
let board;
let curGuess;

/*----- cached elements  -----*/
const choiceContainerEl = document.getElementById('choice-container');
const choiceEls = document.querySelectorAll('#choice-container > div');

/*----- event listeners -----*/
choiceContainerEl.addEventListener('click', function (e) {
  if (e.target.id) {
    return;
  }
  if (curGuess.length < 6) {
    curGuess.push(e.target.dataset.index);
  }
  console.log(curGuess);
});

/*----- functions -----*/
init();
function init() {
  console.log('Game initialized.');
  curGuess = [];
}

function generateCode() {
  const code = [];
  for (let i = 0; i < 6; i++) {
    const randInt = Math.floor(Math.random() * 6);
    code.push(randInt);
  }
  return code;
}
