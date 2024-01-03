const BLOCK_SIDE_LENGTH = '54px';
const BLOCK_COLOR = '#282828';

var dotColor = '#F8B400';
var lineColor = '#F8B400';

var div = document.querySelector('div');

class Block {
    constructor(initialState) {
        this.isTerminal = false;

        // create an svg
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // set its attributes
        this.svg.setAttribute('width', BLOCK_SIDE_LENGTH);
        this.svg.setAttribute('height', BLOCK_SIDE_LENGTH);
        this.svg.style.fill = BLOCK_COLOR;

        // create a rect
        this.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // set its attributes
        this.rect.setAttribute('width', BLOCK_SIDE_LENGTH);
        this.rect.setAttribute('height', BLOCK_SIDE_LENGTH);
        this.rect.style.fill = BLOCK_COLOR;

        // make rect child of svg
        this.svg.appendChild(this.rect);

        div.appendChild(this.svg);

        this.attachEventListener();
    }

    setTerminal(isTerminal) {
        this.isTerminal = isTerminal;
        if (isTerminal) {
            this.drawDot();
        }
    }

    attachEventListener() {
        this.svg.addEventListener('click', () => {
            if (this.isTerminal) {
                if (gameBoard.selectedBlock == null) {
                    this.selectBlock();
                }
                // if some other terminal block has been selected
                else if (gameBoard.selectedBlock != null && gameBoard.selectedBlock.isTerminal) {
                    // previously selected block
                    gameBoard.selectedBlock.rect.style = 'none';

                    this.selectBlock();
                }
            }
        });
    }

    openNeighborCount() {
        var openNeighborCount = 0;
        var neighbors = [this.northNeighbor, this.eastNeighbor, this.southNeighbor, this.westNeighbor];

        neighbors.forEach((neighbor) => {
            if (neighbor && !neighbor.isTerminal && (neighbor.lineCount() == 0)) {
                openNeighborCount++;
            }
        });

        return openNeighborCount;
    }

    selectBlock(neighborType) {
        if (neighborType) {
            switch (neighborType) {
                case 'N':
                    this.northNeighbor.selectBlock();
                    break;
                case 'E':
                    this.eastNeighbor.selectBlock();
                    break;
                case 'S':
                    this.southNeighbor.selectBlock();
                    break;
                case 'W':
                    this.westNeighbor.selectBlock();
                    break;
            }
        } else {
            gameBoard.selectedBlock = this;
            this.rect.style = `stroke-width:3;stroke:${lineColor};`;
        }
    }

    lineCount() {
        return this.svg.querySelectorAll('line').length;
    }

    thereIsLine(lineType) {
        return this.svg.querySelectorAll(`.${lineType}`).length != 0;
    }

    canBeTraversed(lineTypeFull) {
        if (!this[lineTypeFull + 'Neighbor'])
            return false;

        if (this.isTerminal) {
            return this.lineCount() < 3 && !this.thereIsLine(lineTypeFull[0].toUpperCase());
        } else {
            return this.lineCount() < 2;
        }
    }

    drawDot() {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        dot.setAttribute('cx', '27');
        dot.setAttribute('cy', '27');
        dot.setAttribute('r', '8');
        dot.setAttribute('fill', dotColor);

        this.svg.appendChild(dot)
    }

    drawLine(lineType) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        line.setAttribute('stroke', lineColor);
        line.setAttribute('stroke-width', '6');

        var lineType = lineType.toUpperCase();
        if (lineType == 'N') {
            line.setAttribute('class', 'N');

            line.setAttribute('x1', '27');
            line.setAttribute('y1', '0');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '30');
        } else if (lineType == 'E') {
            line.setAttribute('class', 'E');

            line.setAttribute('x1', '54');
            line.setAttribute('y1', '27');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '27');
        } else if (lineType == 'S') {
            line.setAttribute('class', 'S');

            line.setAttribute('x1', '27');
            line.setAttribute('y1', '54');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '24');
        } else if (lineType == 'W') {
            line.setAttribute('class', 'W');

            line.setAttribute('x1', '0');
            line.setAttribute('y1', '27');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '27');
        }

        // this always places new line elements after the rect (meaning I can see them)
        // the main reason I'm doing this and not appendChild is that I want my circle (dot) to be the last child of svg
        this.svg.insertBefore(line, this.svg.firstChild.nextSibling);

        // if there are 3 lines sprouting from a terminal block, it's no longer a terminal
        // if (this.lineCount() == 3) {
        //     this.setTerminal(false);
        // }
    }

    eraseLine(lineType) {
        var lineType = lineType.toUpperCase();

        var lineToBeErased = this.svg.querySelector(`.${lineType}`);
        lineToBeErased.remove();
    }
};
