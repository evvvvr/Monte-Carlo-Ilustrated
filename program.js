var CanvasSize      = 450;
var CanvasElementId = 'myCanvas'

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

var piGenerator = estimatePi();

function draw() {
    requestAnimationFrame(draw);

    var totalPointsElement    = document.getElementById('totalPoints'); 
    var pointsInCircleElement = document.getElementById('pointsInCircle'); 
    var piValueElement        = document.getElementById('piValue');

    var canvas = document.getElementById(CanvasElementId);
    var cntx   = canvas.getContext('2d');

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

function init() {
    var canvas = document.getElementById(CanvasElementId);
    var cntx   = canvas.getContext('2d');

    cntx.strokeStyle = Palette.Roots; 
    cntx.beginPath();
    cntx.arc(0, 0, CanvasSize, 0, 2 * Math.PI);
    cntx.stroke();

    requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', init);