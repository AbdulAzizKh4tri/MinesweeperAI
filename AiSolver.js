import { setContainsCell, subtractSetsArray, deleteFromSet, setIsSubset, subtractSets } from "./set_functions.js";
import {Sentence} from "./Sentence.js"
import {getRandomInt} from "./helper_functions.js"
class AiSolver{

    constructor(height,width){
        this.height = height
        this.width = width

        this.moves_made = new Set()
        this.mines = new Set()
        this.safes = new Set()

        this.knowledge = []
    }

    learn(cell,count){
        this.moves_made.add(JSON.stringify(cell))
        this.safes.add(JSON.stringify(cell))
        
        let neighbors = []
        for(let i = cell[0]-1; i <= cell[0]+1; i++){
            for(let j = cell[1]-1; j <= cell[1]+1; j++){
                if(i < this.height && j < this.width && i > -1 && j > -1){
                    if(!setContainsCell(this.moves_made,JSON.stringify([i,j]))){
                        neighbors.push([i,j])
                    }
                }
            }
        }

        if(count == 0){
            neighbors.forEach((neighbor)=>{
                this.safes.add(JSON.stringify(neighbor));
            })
        }


        let newSentence = new Sentence(neighbors,count)
        this.knowledge.push(newSentence);        
        
        let changesMade;
        do {
            changesMade = false;
            // Check for subset relationships again after updates
            [...this.knowledge].forEach((sen1, i) => {
                [...this.knowledge].forEach((sen2, j) => {
                    if (i!=j && setIsSubset(sen1.cells, sen2.cells)) {
                        let inferredSentence = new Sentence(subtractSetsArray(sen2.cells, sen1.cells),sen2.count - sen1.count);
                        if (inferredSentence.cells.size > 0 && !this.knows(inferredSentence)) {
                            this.knowledge.push(inferredSentence);
                            changesMade = true;
                        }
                    }
                });
            });
    
            
            [...this.knowledge].forEach((sentence) => {
            sentence.confirmed_mines().forEach((mine)=>{
                this.mines.add(JSON.stringify(mine))
                changesMade = true
            })
            sentence.confirmed_safes().forEach((safe)=>{
                this.safes.add(JSON.stringify(safe))
                changesMade = true
            })
            });

            
            [...this.knowledge].forEach((sentence) => {
                [...sentence.cells].forEach((cell) => {
                    if(setContainsCell(this.mines,JSON.stringify(cell))){
                        document.getElementById(cell[0]+'-'+cell[1]).style['background-color'] = 'red'
                        document.getElementById('legend-3').innerHTML = this.mines.size
                        deleteFromSet(sentence.cells,cell)
                        sentence.count -= 1
                        changesMade = true
                    }
                    if(setContainsCell(this.safes,JSON.stringify(cell))){
                        document.getElementById(cell[0]+'-'+cell[1]).style['background-color'] = 'lightgreen'
                        deleteFromSet(sentence.cells,cell)
                        changesMade = true
                    }
                })
            })
        } while (changesMade);
        
        this.knowledge = this.knowledge.filter(sentence => sentence.cells.size > 0);
        
    }

    make_safe_move(){
        let x = subtractSets(this.safes,this.moves_made)
        if (x.size === 0) return null;
        for(let cell of x){
            this.moves_made.add(cell)
            return cell
        }
    }

    make_random_move(){
        let excludedCells = new Set(this.moves_made)
        this.mines.forEach(cell => {
            excludedCells.add(cell)
        });
        if (excludedCells.size >= this.height * this.width){ 
            return null
        }

        while(true){
            let i = getRandomInt(0,this.height-1)
            let j = getRandomInt(0,this.width-1)
            if(!setContainsCell(excludedCells,JSON.stringify([i,j]))){
                this.moves_made.add(JSON.stringify([i,j]))
                random_moves_made += 1
                document.getElementById("legend-5").innerHTML = random_moves_made
                return JSON.stringify([i,j])
            }
        }
    }

    knows(sentence){
        for(let knownSentence of this.knowledge){
            if(sentence.equals(knownSentence)){
                return true
            }
        }
        return false
    }

    print(){
        for(let sentence of this.knowledge){
            console.log(sentence.toString())
        }
    }

}

export {AiSolver}