
function replay() {
    // debugger;
    clearInterval(gTimer);
    gTimer = 0;
    gGame.isOn = false;
    gGame.startCell.i = null;
    gGame.startCell.j = null;
    startState();
}
function levelChoice(cell) {
    // debugger;
    if (cell.classList.contains('level1')) gLevel = gLevels[0];
    if (cell.classList.contains('level2')) gLevel = gLevels[1];
    if (cell.classList.contains('level3')) gLevel = gLevels[2];
    replay();
}

function startTimer() {
    let timer = document.querySelector('.timer');
    start = new Date();
    gTimer = setInterval(function() {
        curr = new Date();
        gGame.time = ((curr - start) / 1000).toFixed(1);
        timer.innerHTML = gGame.time + ' sec';
    }, 100);
}

function openHintCells(idxI, idxJ) {
    // debugger;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var nextCell = gBoard[i][j];
            var elHintCell = document.querySelector(`.cell${i}-${j}`);
            elHintCell.classList.add('hintCell');
            if (nextCell.isShown) continue;
            if (nextCell.isMine) renderCell(i, j, MINE);
            else if (nextCell.isEmpty) renderCell(i, j, EMPTY);
            else renderCell(i, j, nextCell.minesAroundCount);
            setTimeout(hideHint, 3000, i, j);
        }
    }
}
function hideHint(i,j) {
    if (gBoard[i][j].isMarked) renderCell(i, j, FLAG);
    else renderCell(i, j, COVER); 
    var elHintCell = document.querySelector(`.cell${i}-${j}`);
    if (elHintCell.classList.contains('hintCell')) elHintCell.classList.remove('hintCell');
    if (elHintCell.style.border === '3px solid green'); elHintCell.style.border = '';
}

function renderCell(cellI, cellJ, value) {
    var elCell = document.querySelector(`.cell${cellI}-${cellJ}`);
    if (value === FLAG) elCell.classList.add('flag');
    else if (value === COVER) elCell.classList.remove('flag'); 
    else if (value !== MINE && !elCell.classList.contains('hintCell')){
        elCell.classList.add('shown');
        switch (value) {
            case 1: elCell.style.color = 'blue'; break;
            case 2: elCell.style.color = 'green'; break;
            case 3: elCell.style.color = 'red'; break;
            case 4: elCell.style.color = 'brown'; break;
            default: elCell.style.color = 'black';
        }

    }
    elCell.innerHTML = value;
}
function checkBestTime() {
    if (+gGame.time < gLevel.BESTTIME || gLevel.BESTTIME === 0) {
        gLevel.BESTTIME = +gGame.time;
        localStorage.setItem(`${gLevel.SIZE}`, gLevel.BESTTIME);
    }
}