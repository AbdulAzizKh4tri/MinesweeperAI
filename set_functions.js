function compareSets(set1, set2) {
    if (set1.size !== set2.size) return false;

    for (let cell1 of set1) {
        let found = false;

        for (let cell2 of set2) {
            if (JSON.stringify(cell1) === JSON.stringify(cell2)) {
                found = true;
                break;
            }
        }

        if (!found) return false;
    }

    return true;
}

function deleteFromSet(set,target){
    for (let item of set) {
        if (Array.isArray(item) && item.length === target.length && item.every((val, index) => val === target[index])) {
            set.delete(item);
            break;
        }
    }
}

function subtractSets(setA, setB) {
    return new Set(
        [...setA].filter(elemA => 
            ![...setB].some(elemB => elemA === elemB)
        )
    );
}

function subtractSetsArray(setA, setB) {
    const setBStringified = new Set([...setB].map(elemB => JSON.stringify(elemB)));

    return new Set(
        [...setA].filter(elemA => 
            !setBStringified.has(JSON.stringify(elemA))
        )
    );
}

function setContainsCell(set,target){
    for(let cell of set){
        if(typeof cell != 'string'){
            if(JSON.stringify(cell)===target) return true
        }
        if(cell===target) return true
        
    }
    return false
}

function setIsSubset(set1, set2) {
    for (let cell1 of set1) {
        let found = false;

        // Compare cell1 (stringified if necessary) with all elements in set2
        for (let cell2 of set2) {
            if (JSON.stringify(cell1) === JSON.stringify(cell2)) {
                found = true;
                break;
            }
        }

        // If a cell from set1 is not found in set2, return false
        if (!found) {
            return false;
        }
    }
    return true;
}

export {compareSets, deleteFromSet, subtractSets, subtractSetsArray, setContainsCell, setIsSubset}
