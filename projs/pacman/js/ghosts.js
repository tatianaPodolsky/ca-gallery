var GHOST = '&#9762;';

var gIntervalGhosts;
var gGhosts;

function createGhost(board) {
    var ghost = {
        color: getRandomColor(),
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}


function createGhosts(board) {
    // Empty the gGhosts array, create some ghosts
    gGhosts = [];
    
    createGhost(board)
    createGhost(board)
    
    // Run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        // Create the moveDiff
        var moveDiff = getMoveDiff();
        // console.log('moveDiff', moveDiff);
        var nextLocation = {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j,
        }
        // console.log('nextLocation', nextLocation);

        var nextCell = gBoard[nextLocation.i][nextLocation.j]
        // If WALL return
        if (nextCell === GHOST) {
            console.log('Ghost Hitting a GHOST');
            return;
        }
        if (nextCell === WALL) {
            console.log('Ghost Hitting a Wall');
            return;
        }
        // DETECT gameOver
        if (nextCell === PACMAN) {
            if(gIsSuper) {
                gGhosts.splice(i, 1);
                renderCell(ghost.location, PACMAN);
                return;
            };
            gameOver();
        }

        // Set back what we stepped on
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
        renderCell(ghost.location, ghost.currCellContent);

        // Move the ghost MODEL
        ghost.currCellContent = nextCell;
        ghost.location = nextLocation;
        gBoard[ghost.location.i][ghost.location.j] = GHOST;

        // Updade the DOM 
        renderCell(ghost.location, getGhostHTML(ghost));
    }
}

// There are 4 options where to go
function getMoveDiff() {
    // return { i: getRandomIntInclusive(-1, 1), j: getRandomIntInclusive(-1, 1) }
    var opts = [{ i: 0, j: 1 }, { i: 1, j: 0 }, { i: -1, j: 0 }, { i: 0, j: -1 }];
    return opts[getRandomIntInclusive(0, opts.length - 1)];
}

function getGhostHTML(ghost) {
    return `<span style="color: ${ghost.color}">${GHOST}</span>`
}






