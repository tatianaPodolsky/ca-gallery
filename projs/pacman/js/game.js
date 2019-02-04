'use strict';
var WALL = '<img src="image/wall.png"></img>';
var FOOD = '&#8226;';
var EMPTY = ' ';
var SUPERFOOD = '&#10026;'
var CHERRY = '&#127826;'
var gIsSuper = false;
var gBoard;
var gGame = {
  score: 0,
  isOn: false
};
var gIntervalCherry;

function init() {
  gBoard = buildBoard();
  createPacman(gBoard);
  createGhosts(gBoard);
  printMat(gBoard, '.board-container');
  // console.table(gBoard);
  gGame.isOn = true;
  gIntervalCherry = setInterval(addCherry, 5000);
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;

      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {

        board[i][j] = WALL;
      }
      if ((i === 1 && j === 1) ||
        (i === 1 && j === SIZE - 2) ||
        (i === SIZE - 2 && j === 1) ||
        (i === SIZE - 2 && j === SIZE - 2)) {
        board[i][j] = SUPERFOOD;
      }
    }
  }
  return board;
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}


function gameOver() {
  // debugger;
  document.querySelector('.board-container').style.display = 'none';
  let modal = document.querySelector('.modal');
  if (isWin()) modal.innerHTML = '<h2 style="color: green">You won! Congrats!<br>Wanna play again?</h2><button class="replay" onclick="replay()">Play Again</button>';
  else modal.innerHTML = '<h2 style="color:red">Game Over, you lost...:(<br>Wanna try again?</h2><button class="replay" onclick="replay()">Play Again</button>';
  modal.style.display = 'block';
  console.log('Game Over');
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  gIntervalGhosts = 0;
  clearInterval(gIntervalCherry);
  gIntervalCherry = 0;
}

function addCherry() {
  let emptyCells = [];
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      let cell = gBoard[i][j];
      if(cell === EMPTY) {
        let locEmpty = {i: i, j: j};
        emptyCells.push(locEmpty);
      }
    }
  }
  // debugger;
  let randIdx = getRandomIntInclusive(0, emptyCells.length - 1);
  let cherryLocation = emptyCells.splice(randIdx, 1)[0];
  gBoard[cherryLocation.i][cherryLocation.j] = CHERRY;
  renderCell(cherryLocation, CHERRY);
}

function replay() {
  document.querySelector('.board-container').style.display = 'block';
  document.querySelector('.modal').style.display = 'none';
  gIsSuper = false;
  gGame.score = 0;
  init();
}
