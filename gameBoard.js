class GameBoard {
    constructor() {
        this.blocksInNewLine = [];
        this.penDown = false;

        this.gameBoard = [];
        this.rows = 11, this.cols = 15;

        for (let i = 0; i < this.rows; i++) {
            this.gameBoard[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.gameBoard[i][j] = new Block();
            }
        }

        this.gameBoard[3][5].setTerminal(true);
        this.gameBoard[2][9].setTerminal(true);
        this.gameBoard[7][7].setTerminal(true);


        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.gameBoard[i][j].northNeighbor = (i - 1) >= 0 ? this.gameBoard[i - 1][j] : null;
                this.gameBoard[i][j].eastNeighbor = (j + 1) < this.cols ? this.gameBoard[i][j + 1] : null;
                this.gameBoard[i][j].southNeighbor = (i + 1) < this.rows ? this.gameBoard[i + 1][j] : null;
                this.gameBoard[i][j].westNeighbor = (j - 1) >= 0 ? this.gameBoard[i][j - 1] : null;
            }
        }

        document.addEventListener('keydown', (e) => {
            if (this.selectedBlock)
                if (e.key == 'ArrowUp' && this.selectedBlock.canBeTraversed() &&
                    this.selectedBlock.northNeighbor != null) {
                    this.goNorth();
                } else if (e.key == 'ArrowRight' && this.selectedBlock.canBeTraversed() &&
                    this.selectedBlock.eastNeighbor != null) {
                    this.goEast();
                } else if (e.key == 'ArrowDown' && this.selectedBlock.canBeTraversed() &&
                    this.selectedBlock.southNeighbor != null) {
                    this.goSouth();
                } else if (e.key == 'ArrowLeft' && this.selectedBlock.canBeTraversed() &&
                    this.selectedBlock.westNeighbor != null) {
                    this.goWest();
                }
        });
    }

    goBack(lineType) {
        var lineType = lineType.toUpperCase();

        if (lineType == 'N') {
            this.selectedBlock.eraseLine('N');
            this.selectedBlock.rect.style = 'none';

            this.selectedBlock = this.selectedBlock.northNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.eraseLine('S');

            this.blocksInNewLine.pop();
        } else if (lineType == 'E') {
            this.selectedBlock.eraseLine('E');
            this.selectedBlock.rect.style = 'none';

            this.selectedBlock = this.selectedBlock.eastNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.eraseLine('W');

            this.blocksInNewLine.pop();
        } else if (lineType == 'S') {
            this.selectedBlock.eraseLine('S');
            this.selectedBlock.rect.style = 'none';

            this.selectedBlock = this.selectedBlock.southNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.eraseLine('N');

            this.blocksInNewLine.pop();
        } else if (lineType == 'W') {
            this.selectedBlock.eraseLine('W');
            this.selectedBlock.rect.style = 'none';

            this.selectedBlock = this.selectedBlock.westNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.eraseLine('E');

            this.blocksInNewLine.pop();
        }
    }

    chooseNewTerminal() {
        // effectively the last block in a newly drawn line is not added to the array
        // since I don't need the first element ('cause it's a terminal) I will remove it from my array
        this.blocksInNewLine.shift();
        // generate a random number from 0 upto last index of blocksInNewLine 
        var randIndex = Math.round(Math.random() * (this.blocksInNewLine.length - 1));
        this.blocksInNewLine[randIndex].setTerminal(true);
    }

    goNorth() {
        if (this.blocksInNewLine.length != 0 &&
            (this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.northNeighbor)) {
            this.goBack('N');
        } else if (this.selectedBlock.northNeighbor.canBeTraversed()) {
            // previous block
            this.selectedBlock.rect.style = 'none';
            this.selectedBlock.drawLine('N');
            this.blocksInNewLine.push(this.selectedBlock);

            // current block
            this.selectedBlock = this.selectedBlock.northNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.drawLine('S');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
            }
        }
    }

    goEast() {
        if (this.blocksInNewLine.length != 0 &&
            (this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.eastNeighbor)) {
            this.goBack('E');
        } else if (this.selectedBlock.eastNeighbor.canBeTraversed()) {
            // previous block
            this.selectedBlock.rect.style = 'none';
            this.selectedBlock.drawLine('E');
            this.blocksInNewLine.push(this.selectedBlock);

            // current block
            this.selectedBlock = this.selectedBlock.eastNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.drawLine('W');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
            }
        }
    }

    goSouth() {
        if (this.blocksInNewLine.length != 0 &&
            (this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.southNeighbor)) {
            this.goBack('S');
        } else if (this.selectedBlock.southNeighbor.canBeTraversed()) {
            // previous block
            this.selectedBlock.rect.style = 'none';
            this.selectedBlock.drawLine('S');
            this.blocksInNewLine.push(this.selectedBlock);

            // current block
            this.selectedBlock = this.selectedBlock.southNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.drawLine('N');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
            }
        }
    }

    goWest() {
        if (this.blocksInNewLine.length != 0 &&
            (this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.westNeighbor)) {
            this.goBack('W');
        } else if (this.selectedBlock.westNeighbor.canBeTraversed()) {
            // previous block
            this.selectedBlock.rect.style = 'none';
            this.selectedBlock.drawLine('W');
            this.blocksInNewLine.push(this.selectedBlock);

            // current block
            this.selectedBlock = this.selectedBlock.westNeighbor;
            this.selectedBlock.rect.style = 'stroke-width:3;stroke:#F8B400;';
            this.selectedBlock.drawLine('E');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
            }
        }
    }
}


const gameBoard = new GameBoard();