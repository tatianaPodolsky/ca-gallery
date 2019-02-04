console.log('Starting up');
var gProjs = [];
// debugger;
$(document).ready(initPage);

function initPage() {
    gProjs = createProjs();
    renderProjs();
}

function createProj(id, name, title, desc, url, timeStamp, labels, link) {
    return {
        id: id,
        name: name,
        title: title,
        desc: desc,
        url: url,
        publishedAt: timeStamp,
        labels: labels,
        link: link
    }
}

function createProjs() {
    let projs = [];
    projs.push(createProj('pacman', 'Pacman', 'Eat them all',
        'Try to avoid ghosts, eat all the stuff and find your super power!!', "img/portfolio/pacman.png", new Date().toLocaleDateString(), 
        ['keyboard game', 'oldschool'], 'projs/pacman/index.html'));
    projs.push(createProj('minesweeper', 'Minesweeper', 'Find them all or die!!',
        'Try to find all the mines before you blow yourself', "img/portfolio/minesweeper.png", new Date().toLocaleDateString(), 
        ['timekiller', 'procrastinate'],'projs/minesweeper/index.html'));
    projs.push(createProj('guess-me', 'Guess Me!', 'Literally magic!',
        'Computer reads your thoughts! Do your best, teach him to do it.', "img/portfolio/guess-me.png", new Date().toLocaleDateString(), 
        ['procrastinate', 'fun'], 'projs/guess-me/index.html'));
    return projs;
}

function renderProjs() {
    // debugger;
    let strHtmlItem = '';
    for (let i = 0; i < gProjs.length; i++) {
        let proj = gProjs[i];
        strHtmlItem += `
        <div class="col-md-4 col-sm-6 portfolio-item">
            <a class="portfolio-link" data-toggle="modal" href="#portfolioModal">
                <div class="portfolio-hover" onclick=updateModal('${proj.id}')>
                    <div class="portfolio-hover-content">
                        <i class="fa fa-plus fa-3x"></i>
                    </div>
                </div>
                <img class="img-fluid" src=${proj.url} alt="">
            </a>
            <div class="portfolio-caption">
                <h4>${proj.name}</h4>
                <p class="text-muted">${proj.title}</p>
            </div>
        </div>`;
    }
    $('.projs-container').html(strHtmlItem);
}
function updateModal(id) {
    // debugger;
    let proj = gProjs.find(function(item){
        return item.id === id;
    });
    let strHtmlModal =
        `<h2>${proj.name}</h2>
        <p class="item-intro text-muted">${proj.title}</p>
        <img class="img-fluid d-block mx-auto" src=${proj.url} alt="">
        <p>${proj.desc}</p>
        <ul class="list-inline">
        <li>Date: ${proj.publishedAt}</li>
        <li>Category: ${proj.labels.join(", ")}</li>
        <li>Try it out: <li><a href="${proj.link}" target="_blank">To play!</a></li></li>
        </ul>`;
    $('.modal-body').html(strHtmlModal);
}
