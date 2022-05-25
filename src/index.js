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

// const playerFactory = (playerArray) => {};
let gameBoard = gameBoardFactory();
let AiController = computerActionsFactory();
let domController = domFactory();
gameBoard.createBoard();
domController.addGameStateContainer();
AiController.populateShips(squaresObj.p1SquaresArray);
AiController.randomShotAt(squaresObj.p1SquaresArray);
AiController.randomShotAt(squaresObj.p1SquaresArray);
AiController.randomShotAt(squaresObj.p1SquaresArray);
AiController.randomShotAt(squaresObj.p1SquaresArray);
AiController.randomShotAt(squaresObj.p1SquaresArray);
AiController.randomShotAt(squaresObj.p1SquaresArray);

AiController.populateShips(squaresObj.p2SquaresArray);
AiController.randomShotAt(squaresObj.p2SquaresArray);
AiController.randomShotAt(squaresObj.p2SquaresArray);
AiController.randomShotAt(squaresObj.p2SquaresArray);
AiController.randomShotAt(squaresObj.p2SquaresArray);
AiController.randomShotAt(squaresObj.p2SquaresArray);
AiController.randomShotAt(squaresObj.p2SquaresArray);

domController.renderShips(squaresObj.p1SquaresArray, 1);
domController.renderShips(squaresObj.p2SquaresArray, 2);

// AiController.populateShips(squaresObj.p2SquaresArray);
// domController.renderShips(squaresObj.p2SquaresArray, 2);

// shoots own ships for testing
console.log(squaresObj.p1SquaresArray);

export { gameBoard };
