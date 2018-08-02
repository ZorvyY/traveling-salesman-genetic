
let visFitness = getFitnessGrapher();

function getFitnessGrapher() {

  let data = [];

  let dataCanvas = document.getElementById('dataCanvas');
  let cx = dataCanvas.getContext('2d');


  let lineGenerator = d3.line().context(cx);

  let max = 0;

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = dataCanvas.width - margin.left - margin.right,
    height = dataCanvas.height - margin.top - margin.bottom;

  cx.translate(margin.left, margin.top);

  let scaleX = d3.scaleLinear()
      .range([0, width]);
  let scaleY = d3.scaleLinear()
      .range([height, 0]);


  return function visFitness(topFitness, bottomFitness, otherFitness) {

    cx.clearRect(
      -margin.left, -margin.top,
      dataCanvas.width, dataCanvas.height
    );

    //data.push(fitness);

    if (max < fitness) max = fitness;

    scaleX
      .domain([0, topFitness.length])

    scaleY
      .domain([0, topFitness[topFitness.length-1]])

    lineGenerator.x((d, i) => scaleX(i));
    lineGenerator.y(d => scaleY(d));

    xAxis(); yAxis();

    function drawData(data, color) {
      cx.beginPath();
      lineGenerator(data);
      cx.save();
      cx.strokeStyle = color;
      cx.stroke();
      cx.restore();
    }

    drawData(topFitness, 'steelblue');
    drawData(bottomFitness, 'red');
    otherFitness.forEach(fitness => {
      drawData(fitness, 'grey')
    });

  };

  function xAxis() {
    var tickCount = 10,
        tickSize = 6,
        ticks = scaleX.ticks(tickCount),
        tickFormat = scaleX.tickFormat();

    cx.beginPath();
    ticks.forEach(function(d) {
      cx.moveTo(scaleX(d), height);
      cx.lineTo(scaleX(d), height + tickSize);
    });
    cx.strokeStyle = "black";
    cx.stroke();

    cx.textAlign = "center";
    cx.textBaseline = "top";
    ticks.forEach(function(d) {
      cx.fillText(tickFormat(d), scaleX(d), height + tickSize);
    });
  }

  function yAxis() {
    var tickCount = 10,
        tickSize = 6,
        tickPadding = 3,
        ticks = scaleY.ticks(tickCount),
        tickFormat = scaleY.tickFormat(tickCount);

    cx.beginPath();
    ticks.forEach(function(d) {
      cx.moveTo(0, scaleY(d));
      cx.lineTo(-6, scaleY(d));
    });
    cx.strokeStyle = "black";
    cx.stroke();

    cx.beginPath();
    cx.moveTo(-tickSize, 0);
    cx.lineTo(0.5, 0);
    cx.lineTo(0.5, height);
    cx.lineTo(-tickSize, height);
    cx.strokeStyle = "black";
    cx.stroke();

    cx.textAlign = "right";
    cx.textBaseline = "middle";
    ticks.forEach(function(d) {
      cx.fillText(tickFormat(d), -tickSize - tickPadding, scaleY(d));
    });

    cx.save();
    cx.rotate(-Math.PI / 2);
    cx.textAlign = "right";
    cx.textBaseline = "top";
    cx.font = "bold 10px sans-serif";
    cx.fillText("Fitness", -10, 10);
    cx.restore();
  }
}

