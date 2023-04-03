/*----- constants -----*/

/*----- state variables -----*/

/*----- cached elements  -----*/

/*----- event listeners -----*/

/*----- functions -----*/
function generateCode() {
  const code = [];
  for (let i = 0; i < 6; i++) {
    const randInt = Math.floor(Math.random() * 6);
    code.push(randInt);
  }
  return code;
}
