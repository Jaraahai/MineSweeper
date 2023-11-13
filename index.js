const board = [];
const rows = 10;
const columns = 10;
const minesCount = 10;
const minesLocation = [];
let tilesClicked = 0;
let gameOver = false;

window.onload = function() {
    startGame()
    resetGame()
}

const resetGame = () => {
    document.getElementById("reset-game").addEventListener("click", function(){
        location.reload()
    })
}

const startGame = () => {
    document.getElementById("mines-count").innerText = minesCount;

    for(let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", placeFlag)
            tile.classList.add("tile")
            document.getElementById("grid").append(tile);
            row.push(tile)
        }
        board.push(row)

    }
    generateMines()
}


const generateMines = () => {
    let minesLeft = minesCount;
    while(minesLeft > 0) {
        let r = Math.floor(Math.random() * rows)
        let c = Math.floor(Math.random() * columns)
        let id = `${r}-${c}`;
        
        if(!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
        
    }
}

const placeFlag = (event) => {
    event.preventDefault();
    const tileID = event.target.id;
    const tile = document.getElementById(tileID)

    if (tile.classList.contains("flag")) {
        tile.classList.remove("flag");
    } else {
        tile.classList.add("flag")
    }
}

const clickTile = (event) => {
    const tile = event.target
    if(gameOver || tile.classList.contains("tile-clicked")) {
        return
    }

    if(minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        alert("You lost!")
        return
    }

    let coords = tile.id.split("-"); 
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}


const revealMines = () => {
    for(let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if(minesLocation.includes(tile.id)) {
                tile.classList.add("bomb")
            }
        }
    }
}

const checkMine = (r, c) => {
    if(r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")) {
        return
    }

    board[r][c].classList.add("tile-clicked")
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r-1, c-1); // top left
    minesFound += checkTile(r-1, c); // left 
    minesFound += checkTile(r-1, c+1); // bottom left
    
    minesFound += checkTile(r, c-1); // top
    minesFound += checkTile(r, c+1); // bottom

    minesFound += checkTile(r+1, c-1); // top right
    minesFound += checkTile(r+1, c); // right
    minesFound += checkTile(r+1, c+1); // bottom right

    if(minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add(`c${minesFound}`);
    } else {
        board[r][c].innerText = "";

        checkMine(r-1, c-1);    
        checkMine(r-1, c);      
        checkMine(r-1, c+1);    

        
        checkMine(r, c-1);     
        checkMine(r, c+1);      

        
        checkMine(r+1, c-1);    
        checkMine(r+1, c);   
        checkMine(r+1, c+1);    
    }

    if(tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        alert("You Won!")
        gameOver = true;;
    }
}


const checkTile = (r ,c) => {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(`${r}-${c}`)) {
        return 1;
    }
    return 0;
}