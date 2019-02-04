'use strict';

var gLastRes;

$(document).ready(init);

function init() {
    createQuestsTree();
}

function onStartGuessing() {
    $('.game-start').hide();
    renderQuest();
    $('.quest').show();
}

function renderQuest() {
    $('.quest h2').html(gCurrQuest.txt);
}

function onUserResponse(res) {
    if (isChildless(gCurrQuest)) {
        if (res === 'yes') {
            alert('Yes, I knew it!');
        } else {
            $('.quest').hide();
            $('.teach-me').show();
        }
    } else {
        gLastRes = res;
        moveToNextQuest(res);
        renderQuest();
    }
}
function onTeachMe() {
    $('.teach-me').hide();
    $('.new-quest').show();
}
function onAddGuess() {
    var newGuess = $('input.new-guess').val();
    var newQuest = $('input.new-quest').val();
    addGuess(newQuest, newGuess);
    onRestartGame();
}
function onRestartGame() {
    restart();
    $('.new-quest').hide();
    $('.game-start').show();
}