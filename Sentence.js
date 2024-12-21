import { subtractSetsArray, compareSets } from "./set_functions.js";
class Sentence{
    constructor(cells,count){
        this.cells = new Set(cells);
        this.count = count;
    }
    
    confirmed_mines(){
        if(this.cells.size == this.count && this.cells.size != 0){
            return new Set(this.cells)
        }
        return new Set()
    }

    confirmed_safes(){
        if(this.count == this.confirmed_mines().size){
            return subtractSetsArray(this.cells,this.confirmed_mines());
        }
        return new Set()
    }

    toString(){
        let oneDArray = []
        for(let cell of this.cells){
            oneDArray.push(cell)
        }
        return `Sentence:- cells: ${JSON.stringify(oneDArray)}, count: ${this.count}`
    }

    equals(other){
        return this.count == other.count && compareSets(this.cells, other.cells);
    }

}

export {Sentence}