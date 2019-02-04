var gPacman; 
var PACMAN  = '<img src="image/1.png"></img>';
const PACMAN_R = '<img src="image/R.png"></img>';
const PACMAN_L = '<img src="image/L.png"></img>';
const PACMAN_U = '<img src="image/U.png"></img>';
const PACMAN_D = '<img src="image/D.png"></img>';

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false
  }; 
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);
  
  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;
  
  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  
  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;
  
  // Hitting FOOD? update score
  if (nextCell === FOOD) updateScore(1);
  if (nextCell === CHERRY) updateScore(10);

  if (nextCell === SUPERFOOD) {
      if (gIsSuper) return;
      updateScore(1);
      superPower();
  }
   
  else if (nextCell === GHOST) {
    if (!gIsSuper) {
      gameOver()
      renderCell(gPacman.location, EMPTY);
      return;
    } else {
      for (let i = 0; i < gGhosts.length; i++) {
        let ghost = gGhosts[i];
        if (ghost.location.i === nextLocation.i && ghost.location.j === nextLocation.j) {
          gGhosts.splice(i, 1)
        }
      }
    }
  }
  
  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);
  
  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;
  
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);
  // Check if there is more food 
  if (isWin()) {
    gameOver();
    return;
  }
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i, 
    j: gPacman.location.j
  };
  
  switch (keyboardEvent.code) {
    case 'ArrowUp': 
      nextLocation.i--;
      PACMAN = PACMAN_U;
      break;
    case 'ArrowDown': 
      nextLocation.i++;
      PACMAN = PACMAN_D;
      break;
    case 'ArrowLeft': 
      nextLocation.j--;
      PACMAN = PACMAN_L;
      break; 
    case 'ArrowRight': 
      nextLocation.j++;
      PACMAN = PACMAN_R;
      break; 
      default: return null;          
  }

  return nextLocation;
}

function isWin() {
  for (i = 0; i < gBoard.length; i++) {
    for (j = 0; j < gBoard[0].length; j++) {
    let cell = gBoard[i][j];
    if (cell === FOOD) return;
    }
  }
  return true;
}

function superPower() {
  gIsSuper = true;
  setTimeout(function(){
    gIsSuper = false;
    if (gGhosts.length === 0) {
      createGhosts(gBoard);
    } else if (gGhosts.length === 1) createGhost();
  }, 5000);
  for (let i = 0; i < gGhosts.length; i++) {
    let ghost = gGhosts[i];
    ghost.color = getRandomColor();
    renderCell(ghost.location, getGhostHTML(ghost));
  }
}