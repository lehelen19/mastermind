/*----- constants -----*/
const choices = [0, 1, 2, 3, 4, 5];

/*----- state variables -----*/
let turn;
let winner;
let board;

/*----- cached elements  -----*/
const choiceContainerEl = document.getElementById('choice-container');

/*----- event listeners -----*/
choiceContainerEl.addEventListener('click', function (e) {
  if (e.target.id) {
    return;
  }
  console.log('clicked');
});

/*----- functions -----*/
init();
function init() {
  console.log('Game initialized.');
}

function generateCode() {
  const code = [];
  for (let i = 0; i < 6; i++) {
    const randInt = Math.floor(Math.random() * 6);
    code.push(randInt);
  }
  return code;
}
