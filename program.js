var NumberOfTrials = 10000000;

var SquareSideSize = 100;

var CircleRadius = SquareSideSize;

function isPointInCircle(p, radius) {
    return Math.sqrt(p.x * p.x + p.y * p.y) < radius;
}

function generateRandomPointInSquare(squareSize) {
    return {
        x: Math.floor((Math.random() * squareSize) + 1),
        y: Math.floor((Math.random() * squareSize) + 1)
    };
}

function estimatePi(squareSize, numOfTrials) {
    var numOfPointsInCircle      = 0;
    var numOfPointsOutsideCircle = 0;

    for (var i = 0; i < numOfTrials; i++) {
        if (isPointInCircle(generateRandomPointInSquare(squareSize), squareSize)) {
            ++numOfPointsInCircle;
        } else {
            ++numOfPointsOutsideCircle;
        }
    }

    return (numOfPointsInCircle / (numOfPointsInCircle + numOfPointsOutsideCircle)) * 4;
}

console.log('Estimating PI value using circle inscribed into with square size %d ' +
    'using %d trials', SquareSideSize, NumberOfTrials);

var pi = estimatePi(SquareSideSize, NumberOfTrials);

console.log('Estimated PI value is: ', pi);