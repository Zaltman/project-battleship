import _ from 'lodash';
import './styles.css';

const shipFactory = (length) => {
  let shipSquares = [];
  for (let i = 0; i < length; i++) {
    shipSquares[i] = false;
  }
  const hitProto = {
    hit: function hit(hitSquareIndex) {
      let targetSquare = hitSquareIndex;
      this.shipSquares[targetSquare] = true;
    },
  };
  const isSunkProto = {
    isSunk: function isSunk() {
      for (let i = 0; i < this.shipSquares.length; i++) {
        if (this.shipSquares[i] == false) return false;
      }
      return true;
    },
  };
  return Object.assign({}, isSunkProto, hitProto, { shipSquares });
};
const squaresObj = {
  p1SquaresArray: Array(100),
  p2SquaresArray: Array(100),
};

function gameBoardFactory() {
  let boardContainer = document.createElement('div');
  boardContainer.setAttribute('id', 'boardContainer');
  document.querySelector('body').appendChild(boardContainer);
  let createBoard = function () {
    for (let i = 0; i < 2; i++) {
      let whichPlayer;
      let playerContainer = document.createElement('div');
      if (!document.querySelector('#p1Container')) {
        playerContainer.setAttribute('id', 'p1Container');
        whichPlayer = 'player1';
      } else {
        playerContainer.setAttribute('id', 'p2Container');
        whichPlayer = 'player2';
      }
      boardContainer.appendChild(playerContainer);
      (function cordinateColumnF() {
        let coordinateColumn = document.createElement('div');
        coordinateColumn.classList.add('coordinateColumn');
        playerContainer.appendChild(coordinateColumn);

        for (let i = 0; i < 10; i++) {
          let coordinateSquare = document.createElement('div');
          coordinateSquare.classList.add('coordinateSquareColumn');
          coordinateSquare.textContent = String.fromCharCode(i + 65);
          coordinateColumn.appendChild(coordinateSquare);
        }
      })();
      (function cordinateRowF() {
        let coordinateRow = document.createElement('div');
        coordinateRow.classList.add('coordinateRow');
        playerContainer.appendChild(coordinateRow);
        for (let i = 0; i < 10; i++) {
          let coordinateSquare = document.createElement('div');
          coordinateSquare.classList.add('coordinateSquareRow');
          coordinateSquare.textContent = i + 1;
          coordinateRow.appendChild(coordinateSquare);
        }
      })();
      let shipSquaresContainer = document.createElement('div');
      shipSquaresContainer.classList.add('squaresContainer');
      playerContainer.appendChild(shipSquaresContainer);

      (function fillWithSquares() {
        for (let i = 0; i < 100; i++) {
          let boardSquare = document.createElement('div');
          boardSquare.classList.add('boardSquare');
          boardSquare.classList.add(whichPlayer);
          boardSquare.setAttribute('squareId', i);
          shipSquaresContainer.appendChild(boardSquare);
        }
      })();
    }
  };
  let ablePlaceShipCheck = function (
    shipSize,
    placeWhichSquareIndex,
    placingDirection,
    playerArray
  ) {
    let isSquareTaken = false;
    if (placingDirection == 'h') {
      for (let i = 0; i < shipSize; i++) {
        if (playerArray[placeWhichSquareIndex + i]) {
          isSquareTaken = true;
        }
      }
      if (
        String(10 + placeWhichSquareIndex).charAt(0) !==
          String(10 + placeWhichSquareIndex + shipSize - 1).charAt(0) ||
        placeWhichSquareIndex + shipSize > 100
      ) {
        isSquareTaken = true;
      }
    } else if (placingDirection == 'v') {
      for (let i = 0; i < shipSize * 10; i += 10) {
        if (playerArray[placeWhichSquareIndex + i]) {
          isSquareTaken = true;
        }
      }
      if (placeWhichSquareIndex + shipSize * 10 - 9 > 100) {
        isSquareTaken = true;
      }
    }
    if (isSquareTaken == false) return true;
    else {
      // alert('ablePlaceShipCheck false');
      // console.log('unable to place');
      return false;
    }
  };
  // placingDirrection 'h' for horizontal, 'v' for vertical
  let placeShip = function (
    shipSize,
    placeWhichSquareIndex,
    placingDirection,
    playerArray
  ) {
    let ship = shipFactory(shipSize);
    function shipPlacing(i, playerArray) {
      playerArray[placeWhichSquareIndex + i] = {};
      playerArray[placeWhichSquareIndex + i].ship = ship;
      let x = i;
      if (x >= 10) {
        x /= 10;
      }
      playerArray[placeWhichSquareIndex + i].shipSquareHitIndex = x;
    }
    function placingHorizontaly() {
      for (let i = 0; i < shipSize; i++) {
        shipPlacing(i, playerArray);
      }
    }
    function placingVerticaly() {
      for (let i = 0; i < shipSize * 10; i += 10) {
        shipPlacing(i, playerArray);
      }
    }
    if (placingDirection == 'h') {
      placingHorizontaly();
    } else if (placingDirection == 'v') {
      placingVerticaly();
    } else alert('something wrong with placeShip function');
  };
  let receiveAttack = function (coord, playerArray) {
    // console.log(playerArray);
    if (
      playerArray[coord] &&
      playerArray[coord] !== 'missed shot' &&
      playerArray[coord].ship &&
      playerArray[coord].ship.shipSquares[
        playerArray[coord].shipSquareHitIndex
      ] == false
    ) {
      let hitIndex = playerArray[coord].shipSquareHitIndex;
      playerArray[coord].ship.hit(hitIndex);
    } else if (!playerArray[coord]) {
      playerArray[coord] = 'missed shot';
      //if unable to shoot, return false
    } else return false;
  };
  let checkIfAllSunk = function (playerArray) {
    for (let i = 0; i < playerArray.length; i++) {
      if (
        playerArray[i] &&
        playerArray[i] !== 'missed shot' &&
        playerArray[i].ship.isSunk() == false
      ) {
        return false;
      }
    }
    return true;
  };
  return {
    createBoard,
    placeShip,
    receiveAttack,
    checkIfAllSunk,
    ablePlaceShipCheck,
  };
}
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
    let coord = randomIntFromInterval(0, 100);
    if (gameBoard.receiveAttack(coord, targetPlayerArray) == false) {
      return randomShot(targetPlayerArray);
    }
    // if (targetPlayerArray[coord]) {
    //   let targetSquareIndex = targetPlayerArray[coord].shipSquareHitIndex;
    //   targetPlayerArray[coord].ship.hit(targetSquareIndex);
    //   console.log('shot!');
    // }
  }

  return { populateShips, randomShot };
}

function dom() {
  let body = document.querySelector('body');
  function addGameStateContainer() {
    let gameStateContainer = document.createElement('div');
    gameStateContainer.textContent = 'Game state placeholder';
    gameStateContainer.setAttribute('id', 'gameState');
    body.appendChild(gameStateContainer);
  }
  function renderShips(playerArray, whichBoard) {
    if (whichBoard == 1) {
      let squareContainer = document.querySelector('#p1Container');
      colorizeShips(squareContainer);
    } else if (whichBoard == 2) {
      let squareContainer = document.querySelector('#p2Container');
      colorizeShips(squareContainer);
    } else alert('provide whichBoard to domController.renderShips function');

    function colorizeShips(squareContainer) {
      for (let i = 0; i < playerArray.length; i++) {
        let domSquare = squareContainer.querySelector(`[squareid="${i}"]`);
        if (playerArray[i]) {
          domSquare.classList.add('shipSquare');
          console.log(playerArray[i]);
          if (
            playerArray[i].ship &&
            playerArray[i].ship.shipSquares[
              playerArray[i].shipSquareHitIndex
            ] == true
          ) {
            console.log('ain');
            domSquare.classList.add('shotSquare');
          } else if (playerArray[i] == 'missed shot') {
            domSquare.classList.add('missedShot');
          }
        }
      }
    }
  }
  return { addGameStateContainer, renderShips };
}

// const playerFactory = (playerArray) => {};
let gameBoard = gameBoardFactory();
let AiController = computerActionsFactory();
let domController = dom();
gameBoard.createBoard();
domController.addGameStateContainer();
AiController.populateShips(squaresObj.p1SquaresArray);
AiController.randomShot(squaresObj.p1SquaresArray);
AiController.randomShot(squaresObj.p1SquaresArray);
AiController.randomShot(squaresObj.p1SquaresArray);
AiController.randomShot(squaresObj.p1SquaresArray);
AiController.randomShot(squaresObj.p1SquaresArray);
AiController.randomShot(squaresObj.p1SquaresArray);

AiController.populateShips(squaresObj.p2SquaresArray);
AiController.randomShot(squaresObj.p2SquaresArray);
AiController.randomShot(squaresObj.p2SquaresArray);
AiController.randomShot(squaresObj.p2SquaresArray);
AiController.randomShot(squaresObj.p2SquaresArray);
AiController.randomShot(squaresObj.p2SquaresArray);
AiController.randomShot(squaresObj.p2SquaresArray);

domController.renderShips(squaresObj.p1SquaresArray, 1);
domController.renderShips(squaresObj.p2SquaresArray, 2);

// AiController.populateShips(squaresObj.p2SquaresArray);
// domController.renderShips(squaresObj.p2SquaresArray, 2);

// shoots own ships for testing
console.log(squaresObj.p1SquaresArray);
