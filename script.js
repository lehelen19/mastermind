/*----- constants -----*/

/*----- state variables -----*/
let turn;
let winner;
let board;

/*----- cached elements  -----*/

/*----- event listeners -----*/

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
