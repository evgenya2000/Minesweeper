const Vision = {Close: '0', Open: '1', Flag: '2', Question: '3'}

const Creature= {
    Zero : 0,
    One : 1,
    Two: 2,
    Three: 3,
    Four: 4, 
    Five: 5, 
    Six: 6, 
    Seven: 7, 
    Eight: 8,
    Bomb: 9
}

const Process = {Start: 0, Game: 1, End: 2}

class Cell {
    constructor(){
        this.visuality = Vision.Close;
        this.entity =  Creature.Zero;
    }
}

class Board {
    constructor(){
        this.count = 16;
        this.proc = Process.Start;
        this.count_bomb = 40;
        this.count_close = 256 - this.count_bomb;
        this.cells = [];
        for (var i = 0; i < this.count; i++) {
            this.cells[i] = [];
            for (var j = 0; j < this.count; j++){
                this.cells[i][j] = new Cell();
            }
        }
    }     
}

function inArray(arr, num){
    for (var i = 0; i < arr.length; i++) {
        if (num == arr[i]) return true;
    };
    return false;
}

var board = new Board();

function createRand(randLength, min, max){
    var randArray = [];
    var i = 0;

    while (i < randLength) {
        var rand = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!(inArray(randArray,rand))){
            i++;
            randArray.unshift(rand);
        }
    };

    return randArray;
}

function isOnBoard(board, i, j) { 
    return !(i < 0 || j < 0 || i > board.count-1 || j > board.count-1);
}

function checkCellForBomb(board, i, j) {
    if (!isOnBoard(board, i, j)) {
        return false;
    }

    return board.cells[i][j].entity == Creature.Bomb;
}

function initGame(x, y){
    const min = 0;
    const max = 255;

    var rand_pos = createRand(board.count_bomb + 1, min, max);
    var x_t, y_t;
    for(var i = 0; i < board.count_bomb + 1; i++){
        x_t = Math.trunc(rand_pos[i] / board.count);
        y_t = rand_pos[i] % board.count;
        board.cells[x_t][y_t].entity = Creature.Bomb;
    }

    if (board.cells[x][y].entity == Creature.Bomb){
        board.cells[x][y].entity = Creature.Zero;
    } else{
        board.cells[x_t][y_t].entity = Creature.Zero;
    }

    for(var i = 0; i < board.count; i++){
        for(var j = 0; j < board.count; j++){
            bomb_around = 0;
            if(board.cells[i][j].entity != Creature.Bomb) {
                if (checkCellForBomb(board, i+1, j)) {bomb_around++};
                if (checkCellForBomb(board, i+1, j+1)) {bomb_around++};
                if (checkCellForBomb(board, i, j+1)) {bomb_around++};
                if (checkCellForBomb(board, i-1, j+1)) {bomb_around++};
                if (checkCellForBomb(board, i-1, j)) {bomb_around++};
                if (checkCellForBomb(board, i-1, j-1)) {bomb_around++};
                if (checkCellForBomb(board, i, j-1)) {bomb_around++};
                if (checkCellForBomb(board, i+1, j-1)) {bomb_around++};
                board.cells[i][j].entity = bomb_around;
            }
        }
    }
}

function openBoard(){
    for (var i = 0; i < board.count; i++){
        var child_list = document.querySelectorAll(`[x="${i}"]`);
        for(var j = 0; j < board.count; j++){
            if (board.cells[i][j].visuality != Vision.Open){
                if (board.cells[i][j].visuality == Vision.Flag){
                    if (board.cells[i][j].entity != Creature.Bomb){
                        child_list[j].setAttribute('src', 'resources/sprite-not-bomb.jpg');
                    }
                }else{
                    switch(board.cells[i][j].entity){
                        case Creature.Zero:
                            child_list[j].setAttribute('src', 'resources/sprite-opened.jpg');
                            break;
                        case Creature.One:
                            child_list[j].setAttribute('src', 'resources/sprite-b-one.jpg');
                            break;
                        case Creature.Two:
                            child_list[j].setAttribute('src', 'resources/sprite-b-two.jpg');
                            break;
                        case Creature.Three:
                            child_list[j].setAttribute('src', 'resources/sprite-b-three.jpg');
                            break;
                        case Creature.Four:
                            child_list[j].setAttribute('src', 'resources/sprite-b-four.jpg');
                            break;
                        case Creature.Five:
                            child_list[j].setAttribute('src', 'resources/sprite-b-five.jpg');
                            break;
                        case Creature.Six:
                            child_list[j].setAttribute('src', 'resources/sprite-b-six.jpg');
                            break;
                        case Creature.Seven:
                            child_list[j].setAttribute('src', 'resources/sprite-b-seven.jpg');
                            break;
                        case Creature.Eight:
                            child_list[j].setAttribute('src', 'resources/sprite-b-eight.jpg');
                            break;
                        case Creature.Bomb:
                            child_list[j].setAttribute('src', 'resources/sprite-bomb-op.jpg');
                            break;
                    }
                }
            }
        }
    }
}

function endGame(){
    openBoard();
    board.proc = Process.End;
    document.querySelector('.minesweeper-play-btn').setAttribute('src', 'resources/sprite-sadness.jpg');
}

function openNearZero(x, y) {
    if (!isOnBoard(board, x, y)) {
        return;
    }
    
    clickCellLeft(x, y);
}

function openZero(x, y) {
    openNearZero(x-1, y-1);
    openNearZero(x-1, y);
    openNearZero(x-1, y+1);
    openNearZero(x, y-1);
    openNearZero(x, y+1);
    openNearZero(x + 1, y - 1);
    openNearZero(x + 1, y);
    openNearZero(x + 1, y + 1);
}

function clickCellLeft(x, y){
    if (board.proc == Process.Start){
        initGame(x, y);
        board.proc = Process.Game;
    }

    if (board.cells[x][y].visuality != Vision.Open && board.proc != Process.End){
        if (board.cells[x][y].visuality == Vision.Flag){
            board.count_bomb++;
            drawCountBomb();
        }
        board.cells[x][y].visuality = Vision.Open;
        var child_list = document.querySelectorAll(`[x="${x}"]`);
        switch(board.cells[x][y].entity){
            case Creature.Zero:
                child_list[y].setAttribute('src', 'resources/sprite-opened.jpg');
                openZero(x, y);
                board.count_close--;
                break;
            case Creature.One:
                child_list[y].setAttribute('src', 'resources/sprite-b-one.jpg');
                board.count_close--;
                break;
            case Creature.Two:
                child_list[y].setAttribute('src', 'resources/sprite-b-two.jpg');
                board.count_close--;
                break;
            case Creature.Three:
                child_list[y].setAttribute('src', 'resources/sprite-b-three.jpg');
                board.count_close--;
                break;
            case Creature.Four:
                child_list[y].setAttribute('src', 'resources/sprite-b-four.jpg');
                board.count_close--;
                break;
            case Creature.Five:
                child_list[y].setAttribute('src', 'resources/sprite-b-five.jpg');
                board.count_close--;
                break;
            case Creature.Six:
                child_list[y].setAttribute('src', 'resources/sprite-b-six.jpg');
                board.count_close--;
                break;
            case Creature.Seven:
                child_list[y].setAttribute('src', 'resources/sprite-b-seven.jpg');
                board.count_close--;
                break;
            case Creature.Eight:
                child_list[y].setAttribute('src', 'resources/sprite-b-eight.jpg');
                board.count_close--;
                break;
            case Creature.Bomb:
                child_list[y].setAttribute('src', 'resources/sprite-bomb-explosion.jpg');
                endGame();
                break;
        }
        if (board.count_close == 0){
            board.proc = Process.End;
            document.querySelector('.minesweeper-play-btn').setAttribute('src', 'resources/sprite-cool.jpg');
        }
    }
    
}

function drawNumber(num, S){
    switch (num){
        case 0:
            document.getElementById(S).setAttribute('src', 'resources/sprite-zero.jpg');
            break;
        case 1:
            document.getElementById(S).setAttribute('src', 'resources/sprite-one.jpg');
            break;
        case 2:
            document.getElementById(S).setAttribute('src', 'resources/sprite-two.jpg');
            break;
        case 3:
            document.getElementById(S).setAttribute('src', 'resources/sprite-three.jpg');
            break;
        case 4:
            document.getElementById(S).setAttribute('src', 'resources/sprite-four.jpg');
            break;
        case 5:
            document.getElementById(S).setAttribute('src', 'resources/sprite-five.jpg');
            break;
        case 6:
            document.getElementById(S).setAttribute('src', 'resources/sprite-six.jpg');
            break;
        case 7:
            document.getElementById(S).setAttribute('src', 'resources/sprite-seven.jpg');
            break;
        case 8:
            document.getElementById(S).setAttribute('src', 'resources/sprite-eight.jpg');
            break;
        case 9:
            document.getElementById(S).setAttribute('src', 'resources/sprite-nine.jpg');
            break;
    }
}

function drawCountBomb(){
    var S0 = Math.trunc(board.count_bomb / 100);
    var S1 = Math.trunc(board.count_bomb / 10) % 10;
    var S2 = board.count_bomb % 10;
    drawNumber(S0, 'S0');
    drawNumber(S1, 'S1');
    drawNumber(S2, 'S2');
}

function clickCellRight(x,y){
    if (board.proc != Process.End){
        let child_list;
        switch (board.cells[x][y].visuality){
            case Vision.Close:
                board.cells[x][y].visuality = Vision.Flag;
                board.count_bomb--;
                drawCountBomb();
                child_list = document.querySelectorAll(`[x="${x}"]`);
                child_list[y].setAttribute('src', 'resources/sprite-flag.jpg');
                break;
            case Vision.Flag:
                board.cells[x][y].visuality = Vision.Question;
                board.count_bomb++;
                drawCountBomb();
                child_list = document.querySelectorAll(`[x="${x}"]`);
                child_list[y].setAttribute('src', 'resources/sprite-question.jpg');
                break;
            case Vision.Question:
                board.cells[x][y].visuality = Vision.Close;
                child_list = document.querySelectorAll(`[x="${x}"]`);
                child_list[y].setAttribute('src', 'resources/sprite-closed.jpg');
                break;
        }
    }
    
    return false;
}

function drawStartBoard(count){
    let boardImg;
    var i, j;
    let board = document.createElement('div');
    board.setAttribute('class', 'board');
    document.querySelector('.board-wrap').appendChild(board);

    for (i = 0; i < count; i++){    
        for (j = 0; j < count; j++){
            boardImg = document.createElement('img');
            boardImg.setAttribute('src', 'resources/sprite-closed.jpg');
            boardImg.setAttribute('id', 'cell');
            boardImg.setAttribute('x', i);
            boardImg.setAttribute('y', j);
            boardImg.setAttribute('onclick', `clickCellLeft(${i}, ${j})`);
            boardImg.setAttribute('oncontextmenu', `return clickCellRight(${i}, ${j})`);
            document.querySelector('.board').appendChild(boardImg);
        }
    }
}

function delOldBoard(count){
    let parent = document.querySelector('.board');
    let child_list;

    for (var i = 0; i < count; i++){    
        child_list = document.querySelectorAll(`[x="${i}"]`);
        child_list.forEach(e=> parent.removeChild(e));
    }
}

function newGame(){
    board = new Board();
    delOldBoard(board.count);
    drawStartBoard(board.count);
    drawCountBomb();
    document.querySelector('.minesweeper-play-btn').setAttribute('src', 'resources/sprite-smile.jpg');
} 

drawStartBoard(board.count);
drawCountBomb();
