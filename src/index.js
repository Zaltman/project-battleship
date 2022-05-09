import _ from 'lodash';
import './styles.css';

const shipFactory = (length) => {
  let shipSquares = [];
  for (let i = 0; i < length; i++) {
    shipSquares[i] = false;
  }
  const hitProto = {
    hit: function hit(hitSquareIndex) {
      this.shipSquares[hitSquareIndex] = true;
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
let shipTest = shipFactory(3);
const squaresObj = {
  squaresArray: Array(100),
};

function gameBoardFactory() {
  let mainContainer = document.createElement('div');
  mainContainer.setAttribute('id', 'mainContainer');
  document.querySelector('body').appendChild(mainContainer);
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
      mainContainer.appendChild(playerContainer);
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
  let placeShip = function (shipSize, squareIndex, isPlacingHorizontal) {
    let ship = shipFactory(shipSize);
    if (!isPlacingHorizontal) {
      for (let i = 0; i < shipSize; i++) {
        squaresObj.squaresArray[squareIndex + i] = {};
        squaresObj.squaresArray[squareIndex + i].ship = ship;
        squaresObj.squaresArray[squareIndex + i].shipSquareHitIndex = i;
      }
    }
  };
  let receiveAttack = function (coord) {
    if (squaresObj.squaresArray[coord]) {
      let hitIndex = squaresObj.squaresArray[coord].shipSquareHitIndex;
      squaresObj.squaresArray[coord].ship.hit(hitIndex);
    } else {
      squaresObj.squaresArray[coord] = 'missed shot';
    }
  };
  let checkIfAllSunk = function () {
    for (let i = 0; i < squaresObj.squaresArray.length; i++) {
      if (
        squaresObj.squaresArray[i] &&
        squaresObj.squaresArray[i] !== 'missed shot' &&
        squaresObj.squaresArray[i].ship.isSunk() == false
      ) {
        return false;
      }
    }
    return true;
  };
  return { createBoard, placeShip, receiveAttack, checkIfAllSunk };
}
let gameBoard = gameBoardFactory();
gameBoard.createBoard();
gameBoard.placeShip(3, 0);
gameBoard.placeShip(1, 5);
gameBoard.receiveAttack(0);
gameBoard.receiveAttack(1);
gameBoard.receiveAttack(2);
gameBoard.receiveAttack(5);
gameBoard.receiveAttack(19);
gameBoard.receiveAttack(10);

console.log(squaresObj.squaresArray);
console.log(gameBoard.checkIfAllSunk());

// gameBoard.checkIfAllSunk();
