class GameBoard {
    constructor() {
        this.blocksInNewLine = [];
        this.numOfMoves = 0;

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

            this.selectedBlock.northNeighbor.selectBlock();
            this.selectedBlock.eraseLine('S');

            this.blocksInNewLine.pop();
        } else if (lineType == 'E') {
            this.selectedBlock.eraseLine('E');
            this.selectedBlock.rect.style = 'none';

            this.selectedBlock.eastNeighbor.selectBlock();
            this.selectedBlock.eraseLine('W');

            this.blocksInNewLine.pop();
        } else if (lineType == 'S') {
            this.selectedBlock.eraseLine('S');
            this.selectedBlock.rect.style = 'none';

            this.selectedBlock.southNeighbor.selectBlock();
            this.selectedBlock.eraseLine('N');

            this.blocksInNewLine.pop();
        } else if (lineType == 'W') {
            this.selectedBlock.eraseLine('W');
            this.selectedBlock.rect.style = 'none';

            this.selectedBlock.westNeighbor.selectBlock();
            this.selectedBlock.eraseLine('E');

            this.blocksInNewLine.pop();
        }
    }

    chooseNewTerminal() {
        // effectively the last block in a newly drawn line is not added to the array
        // since I don't need the first element (because it's a terminal) I will remove it from my array
        this.blocksInNewLine.shift();

        // // sort them in descending order of openNeighborCount
        // var sortedBlocksInNewLine = this.blocksInNewLine.sort((prev, current) =>
        //     current.openNeighborCount() - prev.openNeighborCount()
        // );

        // // the block with the highest openNeighborCount gets set as the new terminal
        // sortedBlocksInNewLine[0].setTerminal(true);

        //NOTE - I'm gonna do a something a little extra here. 
        // Instead of choosing the first element with the highest open neighbor count, 
        // I will 
        // - get the highest neighborCount
        // - filter out the blocks with the highest count
        // - choose a random block from the filtered list

        var highestOpenNeighborCount = this.blocksInNewLine
            .reduce((accumulator, current) => accumulator.openNeighborCount() > current.openNeighborCount() ? accumulator : current)
            .openNeighborCount();

        var filteredBlocksInNewLine = this.blocksInNewLine.filter((block) => block.openNeighborCount() == highestOpenNeighborCount);

        // generate a random number from 0 upto last index of filteredBlocksInNewLine 
        var randIndex = Math.round(Math.random() * (filteredBlocksInNewLine.length - 1));
        filteredBlocksInNewLine[randIndex].setTerminal(true);
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
            this.selectedBlock.northNeighbor.selectBlock();
            this.selectedBlock.drawLine('S');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
                this.numOfMoves++;
                if (this.numOfMoves % 2 == 0) {
                    dotColor = lineColor = '#F8B400';
                } else {
                    dotColor = lineColor = '#0F90D1';
                }
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
            this.selectedBlock.eastNeighbor.selectBlock();
            this.selectedBlock.drawLine('W');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
                this.numOfMoves++;
                if (this.numOfMoves % 2 == 0) {
                    dotColor = lineColor = '#F8B400';
                } else {
                    dotColor = lineColor = '#0F90D1';
                }
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
            this.selectedBlock.southNeighbor.selectBlock();
            this.selectedBlock.drawLine('N');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
                this.numOfMoves++;
                if (this.numOfMoves % 2 == 0) {
                    dotColor = lineColor = '#F8B400';
                } else {
                    dotColor = lineColor = '#0F90D1';
                }
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
            this.selectedBlock.westNeighbor.selectBlock();
            this.selectedBlock.drawLine('E');

            // if the currently selected block is terminal, clear blocksInNewLine
            if (this.selectedBlock.isTerminal) {
                this.chooseNewTerminal();
                this.blocksInNewLine = [];
                this.numOfMoves++;
                if (this.numOfMoves % 2 == 0) {
                    dotColor = lineColor = '#F8B400';
                } else {
                    dotColor = lineColor = '#0F90D1';
                }
            }
        }
    }
}


const gameBoard = new GameBoard();