import _ from 'lodash';
import './styles.css';
import { domFactory } from './dom';
import { gameBoardFactory } from './gameboard';
import { shipFactory } from './shipfactory';
import { computerActionsFactory } from './computeractions';

const squaresObj = {
  p1SquaresArray: Array(100),
  p2SquaresArray: Array(100),
};

let gameBoard = gameBoardFactory();
let AiController = computerActionsFactory();
let domController = domFactory();
gameBoard.createBoard();
domController.dragableShipsStack();
domController.addGameStateContainer();
function gameLoop() {
  AiController.populateShips(squaresObj.p1SquaresArray);
  AiController.populateShips(squaresObj.p2SquaresArray);
  domController.renderShips(squaresObj.p1SquaresArray, 1);
  domController.changeGameStateStr('Player1, take a shot on second board');
  domController.renderShips(squaresObj.p2SquaresArray, 2);
}
gameLoop();
// AiController.populateShips(squaresObj.p2SquaresArray);
// domController.renderShips(squaresObj.p2SquaresArray, 2);

// shoots own ships for testing
console.log(squaresObj.p1SquaresArray);

export { gameBoard, squaresObj, AiController, domController };
