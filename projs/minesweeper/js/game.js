const COVER = "***";
const MINE = '<img src="img/mine.png"/>';
const FLAG = '<img src="img/flag.png"/>';
const EMPTY = ' ';
const HINT = "&#9742;"
var gLevels = [{ SIZE: 4, MINES: 2, BESTTIME: 0}, { SIZE: 6, MINES: 5, BESTTIME: 0 }, { SIZE: 8, MINES: 15, BESTTIME: 0}];
var gLevel = gLevels[1];
var gBoard;
var gGame;
var gTimer;

function startState() {
    // debugger;
    gBoard = buildBoard();
    gGame = { isOn: false, shownCount: 0, markedCount: 0, startCell: {i: null, j: null}, time: 0, hints: 3};
    renderBoard(gBoard);
    gLevel.BESTTIME = localStorage.getItem(`${gLevel.SIZE}`);
}
function initGame() {
    // debugger;
    setMines();
    setNegs(gBoard);
    renderBoard(gBoard);
    gGame.isOn = true;
    let iStart = gGame.startCell.i;
    let jStart = gGame.startCell.j;
    checkClickedCell(gBoard[iStart][jStart], iStart, jStart, 0);
    startTimer();
}

function buildBoard() {
    let board = [];
    for (let i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = { minesAroundCount: 0, isEmpty: false, isShown: false, isMine: false, isMarked: false };
        }
    }
    return board;
}

function renderBoard(board) {
    var elContainer = document.querySelector('.container');
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = `cell cell${i}-${j}`;
            var data = `data-i=${i} data-j=${j}`;
            strHTML += `<td ${data} onmouseup="cellClicked(event, this)" class="${className}`
            if (cell.isMine) strHTML += ` mine`
            else if (!cell.isEmpty) strHTML += ` negs`;
            strHTML += `">${COVER}</td>`
        }
        strHTML += `</tr>`;
    }
    strHTML += '</tbody></table>';
    elContainer.innerHTML = strHTML;
    var elHints = document.querySelector('.hints');
    elHints.innerHTML = `<div class="hint" onclick="getHint()">${HINT}</div><div class="hint" onclick="getHint()">${HINT}</div><div class="hint" onclick="getHint()">${HINT}</div>`
    var elSmile = document.querySelector('.replaySmile');
    elSmile.innerHTML = `<img src="img/game.png"/>`
    var elScore = document.querySelector('.score');
    elScore.innerHTML = gGame.markedCount;
}

function cellClicked(ev, elCell) {
    let iIdx = +elCell.dataset.i;
    let jIdx = +elCell.dataset.j;
    let cell = gBoard[iIdx][jIdx];
    if (cell.isShown) return;
    if (!gGame.isOn && ev.button === 0 && !gGame.startCell.i) {
        gGame.startCell = { i: iIdx, j: jIdx };
        initGame();
        return;
    }
    else if (gGame.isOn) checkClickedCell(cell, iIdx, jIdx, ev.button);
    isWin();    
}

function checkClickedCell(cell, i, j, button) {
    if (cell.isShown || !gGame.isOn) return;
    if (button === 0) {
        if (cell.isMarked) return;
        if (cell.isMine) gameOver();
        else {
            if (cell.minesAroundCount > 0) {
                renderCell(i, j, cell.minesAroundCount);
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
            }
            else openNegs(i, j);
        }
    }
    if (button === 2) {
        if (cell.isMarked) {
            cell.isMarked = false;
            renderCell(i, j, COVER);
            gGame.markedCount--;
        } else {
            if (cell.isShown) return;
            cell.isMarked = true;
            renderCell(i, j, FLAG);
            gGame.markedCount++;
        };
        document.querySelector(".score").innerHTML = gGame.markedCount;
    }
}
function setMines() {
    // debugger;
    let idxsI = [];
    let idxsJ = [];
    for (let i = 0; i < gLevel.SIZE; i++) {
        idxsI.push(i);
        idxsJ.push(i);
    }
    let x = gLevel.MINES;
    while (x > 0) {
        let i = idxsI[getRandomIntInclusive(0, (idxsI.length - 1))];
        let j = idxsJ[getRandomIntInclusive(0, (idxsI.length - 1))];
        if (!(i === gGame.startCell.i && j === gGame.startCell.j)) {
            if (gBoard[i][j].isMine) continue;
            else gBoard[i][j].isMine = true; 
        } else continue;
        x--;
    }
}

function setNegs(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            let cell = board[i][j];
            cell.minesAroundCount = countNegs(gBoard, i, j, 'isMine');
            if (cell.minesAroundCount === 0 && !(cell.isMine)) cell.isEmpty = true;
        }
    }
}

function gameOver() {
    gGame.isOn = false;
    clearInterval(gTimer);
    let elAllMines = document.querySelectorAll('.mine');
    for (let i = 0; i < elAllMines.length; i++) {
        let elCell = elAllMines[i];
        elCell.classList.add('shown');
        elCell.innerHTML = MINE;
    }
    var elSmile = document.querySelector('.replaySmile');
    elSmile.innerHTML = `<img src="img/lost.png"/>`;
    setTimeout(() => {
        document.querySelector('.container').innerHTML = `<div class="lost-modal"><span>Game Over... <br/>Wanna try again?</span></div>`;
    }, 500);
}

function isWin() {
    if ((gGame.shownCount + gGame.markedCount) >= gLevel.SIZE**2) {
        clearInterval(gTimer);
        console.log(gTimer);
        gGame.isOn = false;
        var elSmile = document.querySelector('.replaySmile');
        elSmile.innerHTML = `<img src="img/win.png"/>`;
        checkBestTime();
        setTimeout(() => {
            document.querySelector('.container').innerHTML = `<div class="win-modal"><span>Congrats!!! You won!<br/> Your time is ${gGame.time} sec. <br/>Best time for this level is ${gLevel.BESTTIME} sec... <br/>Wanna try again?</span></div>`;
        }, 500);
    } else return;
}

function openNegs(idxI, idxJ) {
    // debugger;
    renderCell(idxI, idxJ, EMPTY);
    let cell = gBoard[idxI][idxJ];
    cell.isShown = true;
    gGame.shownCount++;
    
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var nextCell = gBoard[i][j];
            if (nextCell.isShown) continue;
            if (!nextCell.isEmpty) {
                renderCell(i, j, nextCell.minesAroundCount);
                nextCell.isShown = true;
                gGame.shownCount++;
                continue;
            } else openNegs(i, j);
        }
    }
    
    
}

function getHint() {
    // debugger;
    if (gGame.hints < 1 || !gGame.isOn) return;
    gGame.hints--;
    let elHints = document.querySelectorAll(`.hint`);
    elHints[gGame.hints].style.display = 'none';
    for (let i = 0; i < gLevel.SIZE - 1; i++) {
        for (let j = 0; j < gLevel.SIZE - 1; j++) {
            let hintCell = gBoard[i][j];
            if ((hintCell.isShown) || (hintCell.isMine)) continue;
            else {
                var elHintCell = document.querySelector(`.cell${i}-${j}`);
                elHintCell.classList.add('hintCell');
                elHintCell.style.border = '3px solid green';
                openHintCells(i, j); 
                setTimeout(hideHint, 3000, i, j);
                return;
            };
        }
    }

}
