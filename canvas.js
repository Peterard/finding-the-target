var cvs = document.getElementById('cvs');

window.addEventListener("resize", resize);
var desiredScreenRatio = 0.57;
var minHeight = 178;
var minWidth = 100;
resize();

 // This is the ratio of Width:height for a 1080 x 1920 resolution screen

function resize(){
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;

  // if(windowHeight < minHeight){
  //   windowHeight = minHeight;
  // }
  //
  // if(windowWidth < minWidth){
  //   windowWidth = minWidth;
  // }

  const screenMargin = 40;

  if(windowWidth >= desiredScreenRatio * windowHeight){
    console.log("BOABIES");
    console.log(document.getElementById('canvas-container').style.height);
    console.log(windowHeight - screenMargin);
    console.log(document.getElementById('canvas-container').style.width);
    console.log(desiredScreenRatio * (windowHeight - screenMargin));
    cvs.height = windowHeight - screenMargin;
    cvs.width = desiredScreenRatio * (windowHeight - screenMargin);
    cvs.style.height = windowHeight - screenMargin + "px";
    cvs.style.width = desiredScreenRatio * (windowHeight - screenMargin) + "px";
    document.getElementById('canvas-container').style.height = windowHeight - screenMargin + "px";
    document.getElementById('canvas-container').style.width = desiredScreenRatio * (windowHeight - screenMargin) + "px";
  }else{
    cvs.height = (windowWidth - screenMargin) / desiredScreenRatio;
    cvs.width = windowWidth - screenMargin;
    cvs.style.height = ((windowWidth - screenMargin) / desiredScreenRatio) + "px";
    cvs.style.width = windowWidth - screenMargin + "px";
    document.getElementById('canvas-container').style.height = ((windowWidth - screenMargin) / desiredScreenRatio) + "px";
    document.getElementById('canvas-container').style.width = windowWidth - screenMargin + "px";
    console.log("dimmer time");
    console.log(document.getElementById('canvas-container').style.height);
    console.log(windowWidth);
    console.log(document.getElementById('canvas-container').style.width);
    console.log(windowWidth - screenMargin);
  }
}


function Canvas(canvas) {
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    // Draw a circle
    this.circle = function(x, y, r, fill, stroke) {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);

        if (fill)   { context.fill(); }
        if (stroke) { context.stroke(); }

        return this;
    };

    // Draw a circle
    this.line = function(x, y, i, j) {
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(i,j);
        context.stroke();

        return this;
    };

    // Draw a rectangle
    this.rectangle = function(x, y, width, height, fill, stroke) {
        context.ctx.rect(x, y, width, height);

        if (fill)   { context.fill(); }
        if (stroke) { context.stroke(); }

        return this;
    };

    // Set canvas draw color
    this.setColor = function(type, color) {
        if (type === 'fill') {
            context.fillStyle = color;
        } else if (type === 'stroke') {
            context.strokeStyle = color;
        }

        return this;
    };

    this.textDraw = function(text, positionX, positionY, color) {
        context.font = (width/15) + "px Arial";
        context.fillStyle = color;
        context.fillText(text,positionX,positionY)

        return this;
    };

    this.textDrawBig = function(text, positionX, positionY, color) {
        context.font = (width/7) + "px Arial";
        context.fillStyle = color;
        context.fillText(text,positionX,positionY)

        return this;
    };

    // Clear entire canvas
    this.clear = function() {
        context.clearRect(0, 0, width, height);

        return this;
    };

}

var drawOnCanvas = function(input){
    new Canvas(cvs).clear().setColor("fill", "brown").setColor("stroke", "brown").circle(0,0,input,true,true).setColor("fill", "yellow").setColor("stroke", "yellow").circle(11,11,input,true,true);
}

var clearCanvas = function(){
    new Canvas(cvs).clear();
}

var drawTwoCircles = function(firstCircleX, firstCircleY, secondCircleX, secondCircleY){
    var width = cvs.width;
    var height = cvs.height;

    const firstX = width * firstCircleX;
    const firstY = height * firstCircleY;
    const secondX = width * secondCircleX;
    const secondY = height * secondCircleY;

    new Canvas(cvs).clear().setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,20,true,true).setColor("fill", "yellow").setColor("stroke", "green").circle(secondX, secondY,10,true,true);
}

var drawThreeCircles = function(firstCircleX, firstCircleY, secondCircleX, secondCircleY, thirdCircleX, thirdCircleY){
    var width = cvs.width;
    var height = cvs.height;

    const firstX = width * firstCircleX;
    const firstY = height * firstCircleY;
    const secondX = width * secondCircleX;
    const secondY = height * secondCircleY;
    const thirdX = width * thirdCircleX;
    const thirdY = height * thirdCircleY;
    const smallCircleRadius = width/30;
    const largeCircleRadius = width/15;

    const canvas = new Canvas(cvs);
    canvas.clear();
    canvas.setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,largeCircleRadius,true,true);
    canvas.setColor("fill", "yellow").setColor("stroke", "green").circle(secondX, secondY,smallCircleRadius,true,true);
    canvas.setColor("fill", "pink").setColor("stroke", "blue").circle(thirdX, thirdY,smallCircleRadius,true,true);
}

var drawFourCircles = function(firstCircleX, firstCircleY, secondCircleX, secondCircleY, thirdCircleX, thirdCircleY, fourthCircleX, fourthCircleY){
    var width = cvs.width;
    var height = cvs.height;

    const firstX = width * firstCircleX;
    const firstY = height * firstCircleY;
    const secondX = width * secondCircleX;
    const secondY = height * secondCircleY;
    const thirdX = width * thirdCircleX;
    const thirdY = height * thirdCircleY;
    const fourthX = width * fourthCircleX;
    const fourthY = height * fourthCircleY;
    const smallCircleRadius = width/30;
    const largeCircleRadius = width/15;

    const canvas = new Canvas(cvs);
    canvas.clear();
    canvas.setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,largeCircleRadius,true,true);
    canvas.setColor("fill", "white").setColor("stroke", "red").circle(fourthX, fourthY,smallCircleRadius,false,true);
    canvas.setColor("stroke", "red").line(fourthX, fourthY + smallCircleRadius, fourthX, fourthY + smallCircleRadius/2);
    canvas.setColor("stroke", "red").line(fourthX, fourthY - smallCircleRadius, fourthX, fourthY - smallCircleRadius/2);
    canvas.setColor("stroke", "red").line(fourthX + smallCircleRadius, fourthY, fourthX + smallCircleRadius/2, fourthY);
    canvas.setColor("stroke", "red").line(fourthX - smallCircleRadius, fourthY, fourthX - smallCircleRadius/2, fourthY);
    canvas.setColor("fill", "yellow").setColor("stroke", "green").circle(secondX, secondY,smallCircleRadius,true,true);
    canvas.setColor("fill", "pink").setColor("stroke", "blue").circle(thirdX, thirdY,smallCircleRadius,true,true);
}

var drawText = function(inputText){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  canvas.clear();
  canvas.font = "15px Arial";
  canvas.textDrawBig(inputText,width/2,height/2, "black");
}

var drawProgressText = function(inputText){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  canvas.clear();
  canvas.font = "15px Arial";
  canvas.textDraw(inputText,width/8,height/2, "black");
}

var drawGenerationText = function(inputGen){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  const leftMargin = width/30;
  const topMargin = width/10;
  canvas.textDraw("Generation: " + inputGen,leftMargin,topMargin, "black");
}

var drawIterationText = function(inputIteration){
  var width = cvs.width;
  var height = cvs.height;

  inputIteration++

  const canvas = new Canvas(cvs);
  const leftMargin = width/30;
  const topMargin = width/10;
  canvas.textDraw("AI Rank (out of 20 AI): " + ordinalSuffixOf(inputIteration), leftMargin, height - topMargin, "black");
}

var drawPregameOverlayText = function(overlayTimerValue, overlayTimerColorValue){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  canvas.textDrawBig(overlayTimerValue, width/2, height/2, "rgb(" + overlayTimerColorValue + ", " + (255 - overlayTimerColorValue) + ", "+ overlayTimerColorValue + ")");
}

var canvasCoordinatesToCanvasRatio = function(coords){
  var width = cvs.width;
  var height = cvs.height;

  return [coords[0]/width, coords[1]/height]
}

function ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
