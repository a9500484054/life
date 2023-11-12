import Cell from './Cell.js';

export default class Game {

    constructor(rows, cols) {
        this.gridElement = document.createElement('div');
        this.rows = cols    
        this.cols = rows
        this.grid = []
        this.generation = 0
        this.timerId = null
        this.startTime = 0
        this.endTime = 0
        this.liveСell = 0
        
        this.generationDataField()

    }

    generationDataField() {
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = new Cell(i, j)
            }
        }
    }

    getNeighbors(row, col) {
        const neighbors = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    const neighborRow = (row + i + this.rows) % this.rows;
                    const neighborCol = (col + j + this.cols) % this.cols;
                    neighbors.push(this.grid[neighborRow][neighborCol])
                }
            }
        }
        return neighbors;
    }

    countLivingNeighbors(row, col) {
        return this.getNeighbors(row, col).filter(cell => cell.isAlive).length;
    }

    toggleCellState(row, col) {
        this.grid[row][col].isAlive = !this.grid[row][col].isAlive;
        this.updateCellColor(row, col);
        this.liveСell = this.checkLiveСell();
    }

    checkLiveСell() {
        return this.gridElement.querySelectorAll('.black').length;
    }

    updateCellColor(row, col) {
        const cell = this.grid[row][col];
        const cellElement = document.getElementById(`cell-${row}-${col}`)
        if(cell.isAlive) {
            cellElement.style.backgroundColor = 'black';
            cellElement.classList.remove('white')
            cellElement.classList.add('black')
        } else {
            cellElement.style.backgroundColor = 'white';
            cellElement.classList.add('white')
            cellElement.classList.remove('black')
        }
    }

    randomizeGrid() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].isAlive = Math.random() > 0.5
                this.updateCellColor(i, j)
            }
        }
        this.liveСell = this.checkLiveСell();
    }

    step() {
        const newGrid = [];
        this.liveСell = 0;
        for (let i = 0; i < this.rows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                const cell = this.grid[i][j];
                const livingNeighbors = this.countLivingNeighbors(i, j)
                newGrid[i][j] = new Cell(i, j)

                if (cell.isAlive) {
                    if (livingNeighbors === 2 || livingNeighbors === 3) {
                        newGrid[i][j].isAlive = true
                        this.liveСell++
                    }
                } else {
                    if (livingNeighbors === 3) {
                        newGrid[i][j].isAlive = true
                        this.liveСell++
                    }
                }

                this.updateCellColor(i, j)
            }
        }

        this.grid = newGrid
        this.generation++
        this.endTime = performance.now()
        this.updateCountСells()
        this.checkCancelGame()



    }

    checkCancelGame() {
        if(!this.liveСell) {
            this.clearField()
            this.stop()
        }
    }

    updateCountСells() {
        const liveCountСellElement = document.getElementById('liveCell')
        const deadCountСellElement = document.getElementById('deadCell')
        const generation = document.getElementById('generationStep')
        liveCountСellElement.textContent = `${this.liveСell} шт`
        deadCountСellElement.textContent = `${this.rows * this.cols - this.liveСell} шт`
        generation.textContent = this.generation;

    }

    start() {
        this.timerId = setInterval(() => {
            this.startTime = performance.now();
            this.step();
        }, 100);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }

    createGrid() {
        this.gridElement.style.margin = '0 auto';
        this.gridElement.classList.add('new-grid');
        this.gridElement.style.width = `${this.cols * 20}px`;
        this.gridElement.innerHTML = '';

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                cellElement.id = `cell-${i}-${j}`;
                cellElement.addEventListener('click', () => this.toggleCellState(i, j));
                this.gridElement.appendChild(cellElement);
            }
        }
        return this.gridElement;
    }

    clearField() {
        this.gridElement.querySelectorAll('.cell').forEach(el => {
            el.style.backgroundColor = "white";
            el.classList.remove('black');
            el.classList.add('white');
        });
        this.liveСell = 0;
        this.grid = [];
        this.generationDataField();
    }
    

}