const CanvasSize = 450;

const Palette = {
    Roots: 'rgb(148,137,121)',
    Elm: 'rgb(168,168,120)'
};

function* take(gen, count) {
    for (let i = 0; i < count; i++) {
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
    for (let point of points) {
        yield {
            x: point.x,
            y: point.y,
            isInCircle: isPointInCircle(point)
        };
    }
}

function* estimatePi() {
    const stepGenerator  = step(generateRandomPoints());

    let totalPoints    = 0;
    let pointsInCircle = 0;

    for (let point of stepGenerator) {
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

const totalPointsElement    = document.getElementById('totalPoints'); 
const pointsInCircleElement = document.getElementById('pointsInCircle'); 
const piValueElement        = document.getElementById('piValue');

function setIndicators(value) {
    totalPointsElement.textContent    = value.totalPoints;
    pointsInCircleElement.textContent = value.pointsInCircle;
    piValueElement.textContent        = value.estimatedPi;
}

const canvas = document.getElementById('myCanvas');
const cntx   = canvas.getContext('2d');

let piGenerator = estimatePi();

let requestAnimationId;

function draw() {
    requestAnimationId = requestAnimationFrame(draw);

    for (let item of take(piGenerator, 100)) {
        const x = item.x * CanvasSize;
        const y = item.y * CanvasSize;

        cntx.fillStyle = item.isInCircle ? Palette.Elm : Palette.Roots;
        cntx.fillRect(x, y, 1, 1);

        setIndicators(item);
    }
}

const playPauseButton = document.getElementById('playPauseBtn');
const resetButton     = document.getElementById('resetBtn');

function onResumeClick() {
    playPauseBtn.value = '❚❚';
    playPauseBtn.title = 'Pause';

    resetBtn.disabled = false;

    playPauseBtn.removeEventListener('click', onResumeClick);
    playPauseBtn.addEventListener('click', onPauseClick);

    requestAnimationId = requestAnimationFrame(draw);
}

function flipPauseButtonIntoResume() {
    playPauseBtn.value = '▶';
    playPauseBtn.title = 'Resume';

    playPauseBtn.removeEventListener('click', onPauseClick);
    playPauseBtn.addEventListener('click', onResumeClick);    
}

function onPauseClick() {
    flipPauseButtonIntoResume();

    cancelAnimationFrame(requestAnimationId);
}

function drawCircle() {
    cntx.strokeStyle = Palette.Roots; 
    cntx.beginPath();
    cntx.arc(0, 0, CanvasSize, 0, 2 * Math.PI);
    cntx.stroke();
}

function onResetClick() {
    cancelAnimationFrame(requestAnimationId);

    resetBtn.disabled = true;

    setIndicators({
        totalPoints: '0',
        pointsInCircle: '0',
        estimatedPi: 'N/A'
    });

    cntx.clearRect(0, 0, CanvasSize, CanvasSize);
    drawCircle();

    flipPauseButtonIntoResume();

    piGenerator = estimatePi();
}

function init() {
    drawCircle();

    playPauseBtn.addEventListener('click', onResumeClick);
    resetButton.addEventListener('click', onResetClick);
}

document.addEventListener('DOMContentLoaded', init);