window.onload = function (event) {
    console.log('init');
    const cellWidth = 20;
    const cellHeight = 20;
    const cellColor = "rgb(250,82,82)";
    let gridWidth;
    let gridHeight;
    let cells;
    let readData = []


    const canvas = document.getElementById('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext("2d");

    redraw();

    fetch('data.txt')
        .then(response => response.text())
        .then(data => {
                readData = data
                    .split('\n')
                    .filter(line => line !== '')
                    .map(line => line.length > 1 ? line.split('') : line)

            }
        ).then(_ => main())

    function main() {
        gridWidth = readData.shift();
        gridHeight = readData.shift();
        cells = readData.map(array => array.map(element => element === 'X'));
        addBorderToCells();
    }

    function addBorderToCells() {
        for (const row of cells) {
            row.unshift(null);
            row.push(null);
        }
        const tempRow = [];
        for (let i = 0; i < cells[0].length; i++) {
            tempRow.push(null);
        }
        cells.unshift(tempRow);
        cells.push(tempRow);
    }

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.rect(400, 400, cellWidth, cellHeight);
        ctx.closePath();
        ctx.fillStyle = cellColor;
        ctx.fill();
        requestAnimationFrame(redraw);
    }

    function getCellNextState(cellsWithNeighbours) {
        let aliveNeighbours = 0;
        for (let [row, i] of cellsWithNeighbours) {
            for (let [cell, j] of row) {
                if ((i === 1 && j === 1) && cell) {
                    aliveNeighbours++;
                }
            }
        }
        return cellsWithNeighbours[1][1] ? [2, 3].includes(aliveNeighbours) : aliveNeighbours === 3;
    }

    function getMiniGrid(index) {
        const grid = [];

        for (let i = 0; i < gridHeight / 2 + 2; i++) {
            const startY = [0, 1].includes(index) ? 0 : gridHeight / 2;
            const row = [];
            for (let j = 0; j < gridWidth / 2 + 2; j++) {
                const startX = [0, 2].includes(index) ? 0 : gridWidth / 2;
                row.push(cells[startY + i][startX + j]);
            }
            grid.push(row);
        }
        return grid;

        //
        // switch (index) {
        //     case 0:
        //         for (let i = 0; i < grid[0].length; i++) {
        //             grid[0][i] = false;
        //         }
        //         for (let i = 0; i < grid.length; i++) {
        //             grid[i][0] = false;
        //         }
        //         break;
        //     case 1:
        //         for (let i = 0; i < grid[0].length; i++) {
        //             grid[0][i] = false;
        //         }
        //         for (let i = 0; i < grid.length; i++) {
        //             grid[i][grid[0].length - 1] = false;
        //         }
        //         break;
        //     case 2:
        //         for (let i = 0; i < grid[0].length; i++) {
        //             grid[0][i] = false;
        //         }
        //         for (let i = 0; i < grid.length; i++) {
        //             grid[i][0] = false;
        //         }
        //         break;
        //     case 3:
        //         for (let i = 0; i < grid[0].length; i++) {
        //             grid[0][i] = false;
        //         }
        //         for (let i = 0; i < grid.length; i++) {
        //             grid[i][0] = false;
        //         }
        // }
    }
}
