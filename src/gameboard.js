import { shipFactory } from './shipfactory';
import { squaresObj } from '.';
import { AiController } from '.';
import { domController } from '.';

function gameBoardFactory() {
  let boardContainer = document.createElement('div');
  let body = document.querySelector('body');

  boardContainer.setAttribute('id', 'boardContainer');
  body.appendChild(boardContainer);
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
          boardSquare.setAttribute('draggable', 'false');
          boardSquare.setAttribute('squareIndex', i);
          // boardSquare.setAttribute('draggable', 'true');
          if (whichPlayer == 'player2') {
            boardSquare.addEventListener('click', eListenerTakeShotInteraction);
            boardSquare.classList.add('invisible');
          }
          shipSquaresContainer.appendChild(boardSquare);
        }
      })();
    }
  };
  //includes gamestate text changing
  function eListenerTakeShotInteraction(e) {
    if (isGameOver()) {
      return alert('game over');
    }
    if (
      e.target.classList.value.includes('missedShot') ||
      e.target.classList.value.includes('shotSquare')
    ) {
      return domController.changeGameStateStr('Already shot there');
      // alert('already shot there');
    }
    let squareIndex = e.target.getAttribute('squareindex');
    let playerIndex = e.target.classList[1];
    if (playerIndex == 'player1') {
      receiveAttack(squareIndex, squaresObj.p1SquaresArray);
      AiController.randomShotAt(squaresObj.p2SquaresArray);
    } else if (playerIndex == 'player2') {
      receiveAttack(squareIndex, squaresObj.p2SquaresArray);
      AiController.randomShotAt(squaresObj.p1SquaresArray);
    }
    domController.renderShips(squaresObj.p1SquaresArray, 1);
    domController.renderShips(squaresObj.p2SquaresArray, 2);
    domController.changeGameStateStr('Missed shot');
    if (e.target.classList.value.includes('shipSquare')) {
      domController.changeGameStateStr('Hit!');
    }
    isGameOver();
    function isGameOver() {
      if (checkIfAllSunk(squaresObj.p2SquaresArray) == true) {
        alert('player1 has won!!!');
        domController.changeGameStateStr('player1 has won!!!');
        return true;
      }
      if (checkIfAllSunk(squaresObj.p1SquaresArray) == true) {
        alert('computer has won! :(');
        domController.changeGameStateStr('computer has won! :(');
        return true;
      }
    }
  }

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
      // console.log(playerIndex);
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

export { gameBoardFactory };
