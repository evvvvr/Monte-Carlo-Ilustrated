var CanvasSize = 450;

var Palette = {
    Roots: 'rgb(148,137,121)',
    Elm: 'rgb(168,168,120)'
};

function* take(gen, count) {
    for (var i = 0; i < count; i++) {
        yield gen.next().value;
    }
}

function* generateRandomPoints() {
    while (true) {
        yield {
            x: Math.random(),
            y: Math.random()
        }; 
    }
}

function isPointInCircle(p, radius) {
    return Math.sqrt(p.x * p.x + p.y * p.y) < 1;
}

function* step(points) {
    for (var point of points) {
        yield {
            x: point.x,
            y: point.y,
            isInCircle: isPointInCircle(point)
        };
    }
}

function* estimatePi() {
    var totalPoints    = 0;
    var pointsInCircle = 0;
    var stepGenerator  = step(generateRandomPoints());

    for (var point of stepGenerator) {
        ++totalPoints;

        if (point.isInCircle) {
            ++pointsInCircle;
        }

        yield {
            x: point.x,
            y: point.y,
            isInCircle: point.isInCircle,
            totalPoints,
            pointsInCircle,
            estimatedPi: (pointsInCircle / totalPoints) * 4
        };
    }
}

var requestAnimationId;
var canvas                = document.getElementById('myCanvas');
var cntx                  = canvas.getContext('2d');
var piGenerator           = estimatePi();
var totalPointsElement    = document.getElementById('totalPoints'); 
var pointsInCircleElement = document.getElementById('pointsInCircle'); 
var piValueElement        = document.getElementById('piValue');

function draw() {
    requestAnimationId = requestAnimationFrame(draw);

    for (var item of take(piGenerator, 100)) {
        var x = item.x * CanvasSize;
        var y = item.y * CanvasSize;

        cntx.fillStyle = item.isInCircle ? Palette.Elm : Palette.Roots;
        cntx.fillRect(x, y, 1, 1);

        totalPointsElement.textContent    = item.totalPoints;
        pointsInCircleElement.textContent = item.pointsInCircle;
        piValueElement.textContent        = item.estimatedPi; 
    }
}

var playPauseButton = document.getElementById('playPauseBtn');

function onResumeClick() {
    playPauseBtn.value = '❚❚';
    playPauseBtn.title = 'Pause';

    playPauseBtn.removeEventListener('click', onResumeClick);
    playPauseBtn.addEventListener('click', onPauseClick);

    requestAnimationId = requestAnimationFrame(draw);
}

function onPauseClick() {
    playPauseBtn.value = '▶';
    playPauseBtn.title = 'Resume';

    playPauseBtn.removeEventListener('click', onPauseClick);
    playPauseBtn.addEventListener('click', onResumeClick);

    cancelAnimationFrame(requestAnimationId);
}

function init() {
    cntx.strokeStyle = Palette.Roots; 
    cntx.beginPath();
    cntx.arc(0, 0, CanvasSize, 0, 2 * Math.PI);
    cntx.stroke();

    playPauseBtn.addEventListener('click', onResumeClick);
}

document.addEventListener('DOMContentLoaded', init);