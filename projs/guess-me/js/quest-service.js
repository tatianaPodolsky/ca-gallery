var gQuestsTree;
var gCurrQuest;
var gPrevQuest = null;

function createQuestsTree() {
    // debugger;
    if (gQuestsTree) gCurrQuest = gQuestsTree;
    else if (isInLclStorage()) {
        gQuestsTree = JSON.parse(window.localStorage.getItem('gQuestsTree'));
    } else {
    gQuestsTree = createQuest('Male?');
    gQuestsTree.yes = createQuest('Gandhi');
    gQuestsTree.no = createQuest('Rita');
    } 
    // debugger;
    gCurrQuest = gQuestsTree;
}

function isInLclStorage() {
    return (JSON.parse(window.localStorage.getItem('gQuestsTree')))
}

function createQuest(txt) {
    return {
        txt: txt,
        yes: null,
        no: null
    }
}

function isChildless(node) {
    return (node.yes === null && node.no === null)
}

function moveToNextQuest(res) {
    // debugger;
    gPrevQuest = gCurrQuest;
    gCurrQuest = gPrevQuest[res];
}

// function addGuess(newQuestTxt, newGuessTxt) {
//     // debugger;
//     if (gCurrQuest.txt === gPrevQuest.yes.txt) {
//         gPrevQuest.yes = createQuest(newQuestTxt);
//         gPrevQuest.yes.no = gCurrQuest;
//         gCurrQuest = gPrevQuest.yes;
//         gCurrQuest.yes = createQuest(newGuessTxt);
//       } else {
//         gPrevQuest.no = createQuest(newQuestTxt); 
//         gPrevQuest.no.no = gCurrQuest; 
//         gCurrQuest = gPrevQuest.no; 
//         gCurrQuest.yes = createQuest(newGuessTxt);
//     }
//     gPrevQuest = null;
//     gCurrQuest = gQuestsTree;
//     // debugger;
//     window.localStorage.setItem('gQuestsTree', JSON.stringify(gQuestsTree));
// }

function addGuess(newQuestTxt, newGuessTxt) {
    // debugger;
    var newQuestion = createQuest(newQuestTxt);
    newQuestion.yes = createQuest(newGuessTxt);
    newQuestion.no = gCurrQuest;

    if (gLastRes === 'yes') gPrevQuest.yes = newQuestion;
    else gPrevQuest.no = newQuestion;

}

function restart() {
    gPrevQuest = null;
    gCurrQuest = gQuestsTree;
    window.localStorage.setItem('gQuestsTree', JSON.stringify(gQuestsTree));
}

