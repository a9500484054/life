import CreateElement from './CreateElement.js';
import Game from './Game.js';

export default class GameOfLife {
    
    createElement = new CreateElement();

    constructor(id) {   
        this.gameBox = document.getElementById(id);
        this.rows = 30;
        this.cols = 30;
        this.game = null;
        
        this.createGameOfLife();
    }

    createGameOfLife() {
        this.gameBox.append(this.renderСontrolPanel());
        this.gameBox.append(this.renderInfoPanel());
    }
    
    initListener() {
        document.addEventListener('click', (event) => {
            if(event.target.closest('.cell')) {
                this.checkLiveСell();
            }
        })
    }

    checkLiveСell() {
        if(this.game.liveСell) {
            this.btnStart.disabled = false;
            this.btnStep.disabled = false;
            this.btnClear.disabled = false;
        } else {
            this.btnStart.disabled = true;
            this.btnStep.disabled = true;
            this.btnClear.disabled = true;
        }
    }

    renderСontrolPanel () {
        const wrapperInput = document.createElement('div');
        wrapperInput.className = 'd-flex-center mb-1'

        this.inputRows = this.createElement.input('game-params__input', this.rows, 'rows', (event) => this.validateInput(event.target));
        this.labelRows = this.createElement.label('game-params__label', 'Количество строк', 'rows');

        wrapperInput.append(this.labelRows);
        wrapperInput.append(this.inputRows);

        this.inputCols = this.createElement.input('game-params__input', this.cols, 'cols', (event) => this.validateInput(event.target));
        this.labelCols = this.createElement.label('game-params__label', 'Количество строк', 'cols');

        wrapperInput.append(this.labelCols);
        wrapperInput.append(this.inputCols);


        const wrapperBtn = document.createElement('div');
        wrapperBtn.className = 'd-flex-center'

        this.btnCreate = this.createElement.button('btn btn-success', 'Создать игру', false, () => this.createGame());
        wrapperBtn.append(this.btnCreate);

        this.btnRandom = this.createElement.button('btn btn-success', 'Заполнить поля', true, () => this.fillRandomTable());
        wrapperBtn.append(this.btnRandom);

        this.btnStart = this.createElement.button('btn btn-success', 'Cтарт', true, () => this.startGame());
        wrapperBtn.append(this.btnStart);

        this.btnPause = this.createElement.button('btn btn-success', 'Пауза', true, () => this.pauseGame());
        wrapperBtn.append(this.btnPause);

        this.btnStep = this.createElement.button('btn btn-success', '1 шаг', true, () => this.nextGeneration());
        wrapperBtn.append(this.btnStep);

        this.btnReset = this.createElement.button('btn btn-success', 'Перезапустить', true, () => this.resetGame());
        wrapperBtn.append(this.btnReset);

        this.btnClear = this.createElement.button('btn btn-success', 'Очистить поля', true, () => this.clearField());
        wrapperBtn.append(this.btnClear);


        const wrapper = document.createElement('div');
        wrapper.className = 'mb-1'
        wrapper.append(wrapperInput);
        wrapper.append(wrapperBtn);

        return wrapper;
    }

    validateInput(input) {
        let number = input.value.replace(/[^0-9]/g, '');
        input.value = number < 2 ? 2 : number > 200 ? 200 : number;
    }

    renderInfoPanel() {
        
        const countStep = document.createElement('div')
        const countStepTittle = document.createElement('span')
        countStepTittle.textContent = "Шаг игры:"
        this.countStepValue = document.createElement('span')
        this.countStepValue.id = 'generationStep'
        countStep.append(countStepTittle);
        countStep.append(this.countStepValue);

        const liveCell = document.createElement('div')
        const liveCellTittle = document.createElement('span')
        liveCellTittle.textContent = "Живые клетки:"
        this.liveCellValue = document.createElement('span')
        this.liveCellValue.id = 'liveCell'
        liveCell.append(liveCellTittle);
        liveCell.append(this.liveCellValue);

        const deadCell = document.createElement('div')
        const deadCellTittle = document.createElement('span')
        deadCellTittle.textContent = "Мертыве Клети:"
        this.deadCellValue = document.createElement('span')
        this.deadCellValue.id = 'deadCell'
        deadCell.append(deadCellTittle);
        deadCell.append(this.deadCellValue);


        const wrapper = document.createElement('div');
        wrapper.className = 'info-block'
        wrapper.append(liveCell)
        wrapper.append(countStep)
        wrapper.append(deadCell)

        return wrapper;
    }

    createGame() {
        this.gameBox.append(this.createGrid());
        this.initListener();
        this.inputRows.disabled = true;
        this.inputCols.disabled = true;
        this.btnCreate.disabled = true;
        this.btnRandom.disabled = false;
        this.btnCreate.disabled = true;
        this.btnCreate.disabled = true;
        this.btnReset.disabled = false;
    }

    createGrid() {
        this.removeGrid();
        this.rows = parseInt(this.inputRows.value);
        this.cols = parseInt(this.inputCols.value);
        
        if(this.game) 
            this.game.stop();
        
        this.game = new Game(this.rows, this.cols);
        return this.game.createGrid();
    }

    removeGrid() {
        document.querySelector('.new-grid')?.remove();
    }

    fillRandomTable() {
        if(this.game) {
            this.game.randomizeGrid();
            this.checkLiveСell();
        }
    }    

    startGame() {
        if(this.game) {
            this.game.start();
            this.btnPause.disabled = false;
            this.btnStart.disabled = true;
            this.btnRandom.disabled = true;
            this.btnStep.disabled = true;
            this.btnClear.disabled = true;
            this.btnReset.disabled = true;
        }
    }

    pauseGame() {
        if (this.game) {
            this.game.stop();
            this.btnStart.disabled = false;
            this.btnPause.disabled = true;
            this.btnStep.disabled = false;
            this.btnReset.disabled = false;
        }
    }

    nextGeneration() {
        if(this.game) {
            this.game.step();
        }
    }

    clearField() {
        if (this.game) {
            this.game.clearField();
            this.checkLiveСell(this.game.liveСell);
        }
    }

    resetGame() {
        if (this.game) {
            this.game.stop();
            this.game.clearField();
            this.removeGrid();
            this.btnCreate.disabled = false;
            this.btnStart.disabled = true;
            this.btnPause.disabled = true;
            this.btnStep.disabled = true;
            this.btnReset.disabled = true;
            this.inputRows.disabled = false;
            this.inputCols.disabled = false;
            this.btnRandom.disabled = true;
            this.countStepValue.textContent = "0";
            this.liveCellValue.textContent = "0";
            this.deadCellValue.textContent = "0";
        }
    }

}

