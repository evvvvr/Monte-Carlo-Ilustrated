var SquareSideSize = 1;

var CircleRadius = SquareSideSize;

function estimatePi(squareSize) {
    var numOfPoints         = 0;
    var numOfPointsInCircle = 0;
    var stepGenerator       = step(squareSize, generateRandomPoints(squareSize));

    while (true) {
        for (var point of take(stepGenerator, 100)) {
            ++numOfPoints;

            if (point.isInCircle) {
                ++numOfPointsInCircle;
            }
        }

        var estimatedPiValue = (numOfPointsInCircle / numOfPoints) * 4;

        console.log('Estimated PI value is: %d\n', estimatedPiValue);
    }
}

function* step(squareSize, points) {
    for (var point of points) {
        yield {
            x: point.x,
            y: point.y,
            isInCircle: isPointInCircle(point, squareSize)
        };
    }
}

function* take(gen, count) {
    for (var i = 0; i < count; i++) {
        yield gen.next().value;
    }
}

function* generateRandomPoints(squareSize) {
    while (true) {
        yield {
            x: Math.random(),
            y: Math.random()
        }; 
    }
}

function isPointInCircle(p, radius) {
    return Math.sqrt(p.x * p.x + p.y * p.y) < radius;
}

console.log('Estimating PI value using circle inscribed into with square size %d ', SquareSideSize);
estimatePi(SquareSideSize);