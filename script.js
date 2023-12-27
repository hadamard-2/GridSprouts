const BLOCK_SIDE = '54px';
const BLOCK_COLOR = '#282828'

var div = document.querySelector('div')
var blocksInNewLine = []

class Block {
    constructor() {
        // create an svg
        this.block = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // set its attributes
        this.block.setAttribute('width', BLOCK_SIDE)
        this.block.setAttribute('height', BLOCK_SIDE)

        // create a rect
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // set its attributes
        rect.setAttribute('width', BLOCK_SIDE)
        rect.setAttribute('height', BLOCK_SIDE)
        rect.style.fill = BLOCK_COLOR
        // make rect child of svg
        this.block.appendChild(rect)

        div.appendChild(this.block)

        // for start blocks only
        // this.drawDot();

        // var mouseDown = false;
        // this.block.addEventListener('mousedown', () => {
        //     mouseDown = true;
        // })

        // this.block.addEventListener('mouseup', () => {
        //     mouseDown = false;
        // })

        // this.block.addEventListener('mouseleave', (e) => {
        //     if (mouseDown) {
        //         mouseDown = false;

        //         this.drawLine(this.mouseLeaveOrEnterDirection(e))
        //     }
        // })


        // neighbor test
        this.block.addEventListener('click', () => {
            this.topNeighbor.block.querySelector('rect').style.fill = '#0F90D1'
            this.rightNeighbor.block.querySelector('rect').style.fill = '#0F90D1'
            this.bottomNeighbor.block.querySelector('rect').style.fill = '#0F90D1'
            this.leftNeighbor.block.querySelector('rect').style.fill = '#0F90D1'
        })
    }

    drawDot() {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        dot.setAttribute('cx', '27');
        dot.setAttribute('cy', '27');
        dot.setAttribute('r', '8');
        dot.setAttribute('fill', '#F8B400');

        this.block.appendChild(dot)
    }

    drawLine(lineType) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        line.setAttribute('stroke', '#F8B400');
        line.setAttribute('stroke-width', '6');

        lineType = lineType.toUpperCase()
        if (lineType == 'N') {
            line.setAttribute('x1', '27');
            line.setAttribute('y1', '0');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '30');
        } else if (lineType == 'E') {
            line.setAttribute('x1', '54');
            line.setAttribute('y1', '27');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '27');
        } else if (lineType == 'S') {
            line.setAttribute('x1', '27');
            line.setAttribute('y1', '54');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '24');
        } else if (lineType == 'W') {
            line.setAttribute('x1', '0');
            line.setAttribute('y1', '27');
            line.setAttribute('x2', '27');
            line.setAttribute('y2', '27');
        }

        this.block.appendChild(line)
    }

    mouseLeaveDirection(e) {
        var blockRect = this.block.getBoundingClientRect();

        var mouseX = e.clientX;
        var mouseY = e.clientY;

        if (mouseX < blockRect.left) {
            return 'W'
        } else if (mouseX > blockRect.right) {
            return 'E'
        } else if (mouseY < blockRect.top) {
            return 'N'
        } else if (mouseY > blockRect.bottom) {
            return 'S'
        }
    }
};




var gameBoard = [];
var rows = 11, cols = 15;

for (let i = 0; i < rows; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < cols; j++) {
        gameBoard[i][j] = new Block();
    }
}

// (1, 5)

// topNeighbor - (0, 5)
// rightNeighbor - (1, 6)
// bottomNeighbor - (2, 5)
// leftNeightbor - (1, 4)


for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        gameBoard[i][j].topNeighbor = (i - 1) >= 0 ? gameBoard[i - 1][j] : null;
        gameBoard[i][j].rightNeighbor = (j + 1) < cols ? gameBoard[i][j + 1] : null;
        gameBoard[i][j].bottomNeighbor = (i + 1) < rows ? gameBoard[i + 1][j] : null;
        gameBoard[i][j].leftNeighbor = (j - 1) >= 0 ? gameBoard[i][j - 1] : null;
    }
}

// var dotBlock = gameBoard[5][7]

// // things that should happen for a dot block
// dotBlock.drawDot();

// var mouseDown = false;
// dotBlock.block.addEventListener('mousedown', () => {
//     mouseDown = true;
// })

// dotBlock.block.addEventListener('mouseup', () => {
//     mouseDown = false;
// })

// dotBlock.block.addEventListener('mouseleave', (e) => {
//     if (mouseDown) {
//         mouseDown = false;

//         dotBlock.drawLine(dotBlock.mouseLeaveDirection(e))
//     }
// })



// var lineBlock = gameBoard[5][8]

// // things that should happen for a line block
// lineBlock.block.addEventListener('mouseenter', () => {

// })

// lineBlock.block.addEventListener('mouseleave', (e) => {
//     lineBlock.drawLine(lineBlock.mouseLeaveDirection(e))
// })