import {getRandomInt} from './helper_functions.js'
class MinesweeperBoard{

    constructor(height, width, mine_count,MINE){
        this.height = height;
        this.width = width;
        this.grid = this.create2DArray(height,width,' ')
        this.mines = new Set()
        
        while(mine_count > this.mines.size){
            let i = getRandomInt(0,height-1)
            let j = getRandomInt(0,width-1)
            if(this.grid[i][j] != MINE){
                this.mines.add(JSON.stringify([i,j]))
                this.grid[i][j] = MINE
            }
        }
        
        for(let row = 0; row < this.height; row++){
            for(let col = 0; col < this.width; col++){
                if(this.grid[row][col] == MINE) continue;
                let count = 0
                for(let i = row-1; i < row+2; i++){
                    for(let j = col-1; j < col+2; j++){
                        if(i < this.height && j < this.width && i > -1 && j > -1){
                            if(this.grid[i][j] == MINE){
                                count += 1
                            }
                        }
                    }
                }
                this.grid[row][col] = new String(count)
            }
        }
    }

    print(){
        let x = []
        for(let i = 0; i < this.height; i++){
            console.log(i + JSON.stringify(this.grid[i]))
            x.push(new String(i))
        }
        console.log(" " + JSON.stringify(x))
    }
    
    create2DArray(rows, cols, initialValue = 0) {
        return Array.from({ length: rows }, () => Array.from({ length: cols }, () => initialValue));
    }
    
    render(game_matrix){
        game_matrix.innerHTML = ""

        for(let i =0; i < this.height; i++){
            let row = document.createElement("tr")
            for(let j = 0; j < this.width; j++){
                let cell = document.createElement("td")
                let btn = document.createElement("input")
                btn.type = "button"
                btn.id = `${i}-${j}`
                btn.classList.add("btns")
                btn.classList.add("hidden")
                btn.value = this.grid[i][j]
                cell.appendChild(btn)
                row.appendChild(cell)
            }
            game_matrix.appendChild(row)
        }

        let mine_counter = document.getElementById('mine_count')
        mine_counter.value = this.mines.size

    }
}

export {MinesweeperBoard}