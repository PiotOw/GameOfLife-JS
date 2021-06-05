window.onload = function (event) {
    const cellWidth = 1;
    const cellHeight = 1;
    let gridWidth;
    let gridHeight;
    let cells;
    let readData = [];
    let parts = [];


    const canvas = document.getElementById('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext("2d");

    fetch('data.txt')
        .then(response => response.text())
        .then(data => {
                readData = data
                    .split('\n')
                    .filter(line => line !== '')
            }
        ).then(_ => main())

    function main() {
        gridWidth = readData.shift();
        gridHeight = readData.shift();
        cells = readData.map(line => line.length > 1 ? line.split('') : line)
            .map(array => array.map(element => element === 'X'));
        addBorderToCells(cells);
        redraw();

        setInterval(() => {
            var start = new Date();
            parts = [];
            for (let i = 0; i < 4; i++) {
                parts.push(getPartGrid(i));
            }
            new Parallel(parts, {maxWorkers: 4}).require(getCellNextState).map(function (part) {
                const newPart = [];
                let miniGrid = [];
                for (let i = 1; i < part.length - 1; i++) {
                    const newRow = [];
                    for (let j = 1; j < part[0].length - 1; j++) {
                        miniGrid = [
                            [part[i - 1][j - 1], part[i - 1][j], part[i - 1][j + 1]],
                            [part[i][j - 1], part[i][j], part[i][j + 1]],
                            [part[i + 1][j - 1], part[i + 1][j], part[i + 1][j + 1]],
                        ];
                        newRow.push(getCellNextState(miniGrid));
                    }
                    newPart.push(newRow);
                }
                return newPart;
            }).then(function (parts) {
                cells = mergeParts(parts);
                var end = new Date()
                redraw();
                console.log(end - start);
            });
        }, 1000);

    }

    function addBorderToCells(cellGrid) {
        for (const row of cellGrid) {
            row.unshift(null);
            row.push(null);
        }
        const tempRow = [];
        for (let i = 0; i < cellGrid[0].length; i++) {
            tempRow.push(null);
        }
        cellGrid.unshift(tempRow);
        cellGrid.push(tempRow);
    }

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < cells.length; i++) {
            const cellsRow = cells[i];
            for (let j = 0; j < cellsRow.length; j++) {
                const cell = cellsRow[j];
                if (cell !== null) {
                    ctx.fillStyle = cell ? '#080808' : '#E4E4E4';
                    ctx.fillRect(j * (cellWidth) + 100, i * (cellHeight) + 100, cellWidth, cellHeight);
                }
            }
        }
    }

    function getCellNextState(cellsWithNeighbours) {
        let aliveNeighbours = 0;
        for (let i = 0; i < cellsWithNeighbours.length; i++) {
            const row = cellsWithNeighbours[i]
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (!(i === 1 && j === 1) && cell) {
                    aliveNeighbours++;
                }
            }
        }
        return cellsWithNeighbours[1][1] ? [2, 3].includes(aliveNeighbours) : aliveNeighbours === 3;
    }

    function getPartGrid(index) {
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
    }

    function mergeParts(parts) {
        const newGrid = [];
        for (let i = 0; i < gridHeight; i++) {
            const newRow = parts[i < gridHeight / 2 ? 0 : 2][i % (gridHeight / 2)]
            newRow.push(...parts[i < gridHeight / 2 ? 1 : 3][i % (gridHeight / 2)])
            newGrid.push(newRow);
        }
        addBorderToCells(newGrid);
        return newGrid;
    }
}
