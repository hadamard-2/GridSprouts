class GameBoard {
    constructor() {
        this.blocksInNewLine = [];
        this.numOfMoves = 0;

        this.boardMatrix = [];
        this.rows = 11, this.cols = 15;

        for (let i = 0; i < this.rows; i++) {
            this.boardMatrix[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.boardMatrix[i][j] = new Block();
            }
        }

        this.chooseInitialSetOfTerminals();

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.boardMatrix[i][j].northNeighbor = (i - 1) >= 0 ? this.boardMatrix[i - 1][j] : null;
                this.boardMatrix[i][j].eastNeighbor = (j + 1) < this.cols ? this.boardMatrix[i][j + 1] : null;
                this.boardMatrix[i][j].southNeighbor = (i + 1) < this.rows ? this.boardMatrix[i + 1][j] : null;
                this.boardMatrix[i][j].westNeighbor = (j - 1) >= 0 ? this.boardMatrix[i][j - 1] : null;
            }
        }

        document.addEventListener('keydown', (e) => {
            if (!this.selectedBlock)
                return;

            const directionMapping = {
                'ArrowUp': { dir: 'N', oppositeDir: 'S' },
                'ArrowRight': { dir: 'E', oppositeDir: 'W' },
                'ArrowDown': { dir: 'S', oppositeDir: 'N' },
                'ArrowLeft': { dir: 'W', oppositeDir: 'E' }
            };

            const dirFull = {
                'N': 'north',
                'S': 'south',
                'E': 'east',
                'W': 'west'
            }

            const directionInfo = directionMapping[e.key];

            if (directionInfo) {
                const { dir, oppositeDir } = directionInfo;

                if (this.tryingToGoBack(dir)) {
                    this.goBack(dir);
                } else if (this.selectedBlock.canBeTraversed(dirFull[dir]) &&
                    this.selectedBlock[dirFull[dir] + 'Neighbor'].canBeTraversed(dirFull[oppositeDir])) {
                    this.goForward(dir);
                }
            }

        });
    }

    chooseInitialSetOfTerminals() {
        this.boardMatrix[3][5].setTerminal(true);
        this.boardMatrix[2][9].setTerminal(true);
        this.boardMatrix[7][7].setTerminal(true);
    }

    chooseNewTerminal() {
        // effectively the last block in a newly drawn line is not added to the array
        // since I don't need the first element (because it's a terminal) I will remove it from my array
        this.blocksInNewLine.shift();

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

    switchColors() {
        if (this.numOfMoves % 2 == 0) {
            dotColor = lineColor = '#F8B400';
        } else {
            dotColor = lineColor = '#0F90D1';
        }
    }

    tryingToGoBack(neighborType) {
        var neighborType = neighborType.toUpperCase();

        if (this.blocksInNewLine.length != 0) {
            switch (neighborType) {
                case 'N':
                    return this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.northNeighbor;
                case 'E':
                    return this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.eastNeighbor;
                case 'S':
                    return this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.southNeighbor;
                case 'W':
                    return this.blocksInNewLine[this.blocksInNewLine.length - 1] == this.selectedBlock.westNeighbor;
                default:
                    return false; // Handle invalid neighborType
            }
        } else {
            return false; // Handle case when blocksInNewLine is empty
        }
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

    // can be substituted by an object
    opposite(lineType) {
        var lineType = lineType.toUpperCase();

        switch (lineType) {
            case 'N':
                return 'S';
            case 'E':
                return 'W';
            case 'S':
                return 'N';
            case 'W':
                return 'E';
            default:
                return '-';
        }
    }

    goForward(lineType) {
        // previous block
        this.selectedBlock.rect.style = 'none';
        this.selectedBlock.drawLine(lineType);
        this.blocksInNewLine.push(this.selectedBlock);

        // current block
        this.selectedBlock.selectBlock(lineType);
        this.selectedBlock.drawLine(this.opposite(lineType));

        // if the currently selected block is terminal, clear blocksInNewLine
        if (this.selectedBlock.isTerminal) {
            this.chooseNewTerminal();
            this.blocksInNewLine = [];
            this.numOfMoves++;
            this.switchColors();
        }
    }
}


const gameBoard = new GameBoard();