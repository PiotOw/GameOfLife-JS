window.onload = function (event) {
    console.log('init');
    const cellWidth = 20;
    const cellHeight = 20;
    const cellColor = "rgb(250,82,82)";
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
                    .map(el => el.split(' '))
                    .filter(array => array.length > 1 || array[0] !== '')

            }
        ).then(_ => main())
    console.log(readData);

    function main() {

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
}
