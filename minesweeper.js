import {MinesweeperBoard} from'./MinesweeperBoard.js'
import {AiSolver} from './AiSolver.js'

function reveal_all() {
    let all_buttons = document.getElementsByClassName('btns')
    for(let button of all_buttons) {
        if(button.value == '0'){
            button.value = ''
        }
        button.classList.remove('hidden')
    }
}

function game_won(mines){
    finished=true
    let solve_button = document.getElementById('solve')
    let speed_button = document.getElementById('speed')
    speed_button.disabled= true
    solve_button.value = 'Reload'
    for(let mine of mines){
        let id = JSON.parse(mine)[0]+'-'+JSON.parse(mine)[1]
        let btn = document.getElementById(id)
        btn.disabled = true
        btn.value = FLAG
        btn.style['background-color'] = 'green'
    }
    let input = document.getElementById('mine_count')
    input.value = WINNER_STRING
    input.style['color'] = 'green'
}

function game_over(move){
    finished=true
    let solve_button = document.getElementById('solve')
    let speed_button = document.getElementById('speed')
    speed_button.disabled= true
    solve_button.value = 'Reload'
    let id = move[0]+'-'+move[1]
    let btn = document.getElementById(id)
        btn.disabled = true
        btn.style['background-color'] = 'red'
        let input = document.getElementById('mine_count')
        input.value = LOSER_STRING
        input.style['color'] = 'red'
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solve(delay_time,flag){
    let delay = delay_time
    while(flag[0] == true){
        await sleep(delay);
        let safe = true
        let next_move = JSON.parse(solver.make_safe_move())
        
        if(next_move == null){
            console.log("safe move not found, making random move")
            next_move = JSON.parse(solver.make_random_move())
            safe = false
        }
        if(next_move == null){
            game_won(solver.mines)
            reveal_all()
            return
        }
        let button = document.getElementById(`${next_move[0]}-${next_move[1]}`)
        let selected_cell_content = board.grid[next_move[0]][next_move[1]]
        button.classList.remove('hidden')
        button.disabled=true
        if(selected_cell_content != MINE){
            solver.learn(next_move,parseInt(selected_cell_content))
            button.style['background-color'] = safe?'lightblue':'rgb(255, 100, 0)'
            if(selected_cell_content == '0') {
                button.value=""   
            }
            await sleep(HIGHLIGHT_TIME)
            button.style['background-color'] = 'azure'
        }else{
            game_over(next_move)
            reveal_all()
            return
        }

    }
    
}

document.addEventListener('DOMContentLoaded',() => {

board.render(GAME_MATRIX)
const solve_button = document.getElementById('solve')
const speed_button = document.getElementById('speed')
const mine_counter = document.getElementById('mine_count')
mine_counter.focus();
const size_button = document.getElementById('size')
speed_button.disabled = true
let solving = false
const flag = [false]
const delay = [500]
solve_button.addEventListener('click',() => {
    if(!started) board.render(GAME_MATRIX)
    started = true
    mine_counter.disabled = true
    size_button.disabled = true
    if(finished){
        window.location.reload(true)
    }
    if(!solving){
        flag[0] = true
        speed_button.disabled = false
        solve(delay,flag)
        solving = true
        solve_button.value = 'Pause'
    }else{
        solving = false
        flag[0] = false
        solve_button.value = 'Solve'
    }
})
speed_button.addEventListener('click',() => {
    switch (delay[0]) {
        case SLOW_SPEED:
            delay[0] = MEDIUM_SPEED
            speed_button.value = 'Medium'
            break;
        case MEDIUM_SPEED:
            delay[0] = FAST_SPEED
            speed_button.value = 'Fast'
            break;
        case FAST_SPEED:
            delay[0] = SLOW_SPEED
            speed_button.value = 'Slow'
        break;
    }
})

size_button.addEventListener('click',() => {
    switch (dimension) {
        case SMALL:
            dimension = MEDIUM
            mine_count = 35
            size_button.value = `Medium`
            break;
        case MEDIUM:
            dimension = LARGE
            mine_count = 150
            size_button.value = `$Large`
            break;
        case LARGE:
            dimension = ABSURD
            mine_count = 300
            size_button.value = `ABSURD`
            break;
        case ABSURD:
            dimension = SMALL
            mine_count = 15
            size_button.value = `Small`
            break;
    }
    board = new MinesweeperBoard(dimension,dimension,mine_count,MINE)
    solver = new AiSolver(dimension,dimension)
    board.render(GAME_MATRIX)
})

mine_counter.addEventListener('change',() =>{
    mine_count = mine_counter.value
    board = new MinesweeperBoard(dimension,dimension,mine_count,MINE)
    solver = new AiSolver(dimension,dimension)
})



})


const SLOW_SPEED = 500
const MEDIUM_SPEED = 200
const FAST_SPEED = 0
const HIGHLIGHT_TIME =75

const SMALL = 10
const MEDIUM = 16
const LARGE = 32
const ABSURD = 45

let finished = false
let started = false
let dimension = SMALL
let mine_count = 15
const MINE = '💣'
const FLAG = '🚩'
const WINNER_STRING = "WIN!"
const LOSER_STRING = "BOOM!"
const GAME_MATRIX = document.getElementById("game_matrix")
let board = new MinesweeperBoard(dimension,dimension,mine_count,MINE)
let solver = new AiSolver(dimension,dimension)