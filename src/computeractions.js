import { gameBoard } from '.';

function computerActionsFactory(playerArray) {
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function chooseDirection() {
    let decidingInt = randomIntFromInterval(0, 1);
    if (decidingInt == 0) {
      return 'v';
    } else if (decidingInt == 1) return 'h';
    else return alert('somethings wrong with chooseDirection function');
  }
  function populateShips(playerArray) {
    function placingAttempt(size, playerArray) {
      let coord = randomIntFromInterval(0, 100);
      let direction = chooseDirection();
      if (gameBoard.ablePlaceShipCheck(size, coord, direction, playerArray)) {
        gameBoard.placeShip(size, coord, direction, playerArray);
      } else placingAttempt(size, playerArray);
    }

    //populating every ship on board
    placingAttempt(1, playerArray);
    placingAttempt(1, playerArray);
    placingAttempt(2, playerArray);
    placingAttempt(2, playerArray);
    placingAttempt(3, playerArray);
    placingAttempt(3, playerArray);
    placingAttempt(4, playerArray);
    placingAttempt(5, playerArray);
  }

  function randomShot(targetPlayerArray) {
    let coord = randomIntFromInterval(0, 99);
    if (gameBoard.receiveAttack(coord, targetPlayerArray) == false) {
      return randomShot(targetPlayerArray);
    }
  }

  return { populateShips, randomShotAt: randomShot };
}

export { computerActionsFactory };
