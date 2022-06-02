import { remove } from 'lodash';
import { domController, gameBoard, squaresObj } from '.';

function domFactory() {
  let body = document.querySelector('body');
  let gameStateContainer = document.createElement('div');
  function addGameStateContainer() {
    gameStateContainer.textContent = 'Game state placeholder';
    gameStateContainer.setAttribute('id', 'gameState');
    body.appendChild(gameStateContainer);
  }
  function changeGameStateStr(str) {
    gameStateContainer.textContent = str;
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
        let domSquare = squareContainer.querySelector(`[squareIndex="${i}"]`);
        if (playerArray[i] && playerArray[i] !== 'missed shot') {
          domSquare.classList.add('shipSquare');
        }
        if (
          playerArray[i] &&
          playerArray[i].ship &&
          playerArray[i].ship.shipSquares[playerArray[i].shipSquareHitIndex] ==
            true
        ) {
          domSquare.classList.add('shotSquare');
        } else if (playerArray[i] == 'missed shot') {
          domSquare.classList.add('missedShot');
        }
      }
    }
  }
  function isAllShipsPlaced() {
    let shipsContainer = document.querySelector('.shipsContainer');
    if (shipsContainer.hasChildNodes() == false) {
      return true;
    } else return false;
  }

  function dragableShipsStack() {
    let squares = document.querySelectorAll('.boardSquare.player1');
    let shipsContainer = document.createElement('div');
    let body = document.querySelector('body');
    shipsContainer.classList.add('shipsContainer');

    function addDragableShip(id, size) {
      let ship = document.createElement('div');
      ship.classList.add('draggableShip');
      ship.setAttribute('draggable', 'true');
      ship.addEventListener('dragstart', handleDragStart);
      ship.addEventListener('dragend', handleDragEnd);
      ship.classList.add('horizontal');
      ship.dataset.dragableShip = id;
      ship.dataset.size = size;
      let widthOrHeight = size * 29;
      ship.style.width = String(widthOrHeight) + 'px';
      ship.style.height = '29px';

      // ship.style.width = String(widthOrHeight) + 'px';
      shipsContainer.appendChild(ship);
    }
    function handleDragStart(e) {
      let draggedShip = this.dataset.dragableShip;
      e.dataTransfer.setData('draggedShipId', draggedShip);
      let shipSize = e.target.dataset.size;
      e.dataTransfer.setData('size', shipSize);

      if (this.classList.value.includes('horizontal')) {
        e.dataTransfer.setData('direction', 'h');
      } else if (this.classList.value.includes('vertical')) {
        e.dataTransfer.setData('direction', 'v');
      } else {
        e.preventDefault();
        return;
      }
      let dragShipId = e.target.dataset.dragableShip;
      this.style.opacity = '0.4';
      e.dataTransfer.setData('text/html', dragShipId);
    }
    function handleDragEnd(e) {
      this.style.opacity = '1';
      if (this.draggable !== false) {
      }
      squares.forEach(function (item) {
        item.classList.remove('over');
      });
    }
    function handleDragOver(e) {
      e.preventDefault();

      return false;
    }

    function handleDragEnter(e) {
      this.classList.add('over');
    }

    function handleDragLeave(e) {
      this.classList.remove('over');
    }

    function handleDrop(e) {
      e.stopPropagation(); // stops the browser from redirecting.
      let squareCoords = parseInt(e.target.getAttribute('squareindex'));
      let dragableShipId = e.dataTransfer.getData('text/html');
      let placingDirection = e.dataTransfer.getData('direction');
      let shipSize = parseInt(e.dataTransfer.getData('size'));
      if (
        gameBoard.ablePlaceShipCheck(
          shipSize,
          squareCoords,
          placingDirection,
          squaresObj.p1SquaresArray
        ) === true &&
        dragableShipId !== 'undefined'
      ) {
        gameBoard.placeShip(
          shipSize,
          squareCoords,
          placingDirection,
          squaresObj.p1SquaresArray
        );
        domController.renderShips(squaresObj.p1SquaresArray, 1);
        let draggedShip = document.querySelector(
          `[data-dragable-ship="${dragableShipId}"]`
        );
        let shipToRemove = e.dataTransfer.getData('draggedShipId');
        shipToRemove = document.querySelector(
          `[data-dragable-ship="${shipToRemove}"]`
        );
        shipToRemove.remove();
        e.preventDefault();
        if (isAllShipsPlaced()) {
          changeGameStateStr('Placing is finished, player1, take a shot');
        }
        draggedShip.style.opacity = '0.1';
      }
      return false;
    }
    function changeDirection() {
      let ships = document.querySelectorAll('.draggableShip');
      changeDirectionChar();
      function changeDirectionChar() {
        let currentDirectionEl = document.querySelector('#directionBtn');

        if (currentDirectionEl.textContent == '→') {
          currentDirectionEl.textContent = '↓';
        } else currentDirectionEl.textContent = '→';
      }
      let direction = String(
        document.querySelector('#directionBtn').textContent
      );

      ships.forEach(function (ship) {
        let shipSize = ship.dataset.size;
        if (direction == '→') {
          ship.classList.remove('vertical');
          ship.classList.add('horizontal');
          ship.style.width = String(shipSize * 29) + 'px';
          ship.style.height = '29px';
        } else if (direction == '↓') {
          ship.classList.remove('horizontal');
          ship.classList.add('vertical');

          ship.style.width = '29px';
          ship.style.height = String(shipSize * 29) + 'px';
        }
      });
    }
    squares.forEach(function (item) {
      if (item.classList[0] !== 'boardSquare') {
      }
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('dragenter', handleDragEnter);
    });
    let directionBtn = document.createElement('button');
    directionBtn.textContent = '→';
    // ↓	→
    directionBtn.setAttribute('id', 'directionBtn');
    directionBtn.addEventListener('click', changeDirection);

    body.prepend(directionBtn);
    body.prepend(shipsContainer);
    addDragableShip(1, 1);
    addDragableShip(2, 1);
    addDragableShip(3, 2);
    addDragableShip(4, 2);
    addDragableShip(5, 3);
    addDragableShip(6, 3);
    addDragableShip(7, 4);
    addDragableShip(8, 5);
  }
  return {
    addGameStateContainer,
    renderShips,
    changeGameStateStr,
    dragableShipsStack,
    isAllShipsPlaced,
  };
}

export { domFactory };
