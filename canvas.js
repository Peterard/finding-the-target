var cvs = document.getElementById('cvs');

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
        context.font = "30px Arial";
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
    new Canvas(cvs).clear().setColor("fill", "brown").setColor("stroke", "brown").circle(111,111,input,true,true).setColor("fill", "yellow").setColor("stroke", "yellow").circle(222,111,input,true,true);
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

    const canvas = new Canvas(cvs);
    canvas.clear();
    canvas.setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,20,true,true);
    canvas.setColor("fill", "yellow").setColor("stroke", "green").circle(secondX, secondY,10,true,true);
    canvas.setColor("fill", "pink").setColor("stroke", "blue").circle(thirdX, thirdY,10,true,true);
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

    const canvas = new Canvas(cvs);
    canvas.clear();
    canvas.setColor("fill", "brown").setColor("stroke", "brown").circle(firstX,firstY,20,true,true);
    canvas.setColor("fill", "white").setColor("stroke", "red").circle(fourthX, fourthY,10,false,true);
    canvas.setColor("fill", "yellow").setColor("stroke", "green").circle(secondX, secondY,10,true,true);
    canvas.setColor("fill", "pink").setColor("stroke", "blue").circle(thirdX, thirdY,10,true,true);
}

var canvasCoordinatesToCanvasRatio = function(coords){
  var width = cvs.width;
  var height = cvs.height;

  return [coords[0]/width, coords[1]/height]
}

var drawText = function(inputText){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  canvas.clear();
  canvas.font = "30px Arial";
  canvas.textDraw(inputText,width/2,height/2, "black");
}

var drawProgressText = function(inputText){
  var width = cvs.width;
  var height = cvs.height;

  const canvas = new Canvas(cvs);
  canvas.clear();
  canvas.font = "30px Arial";
  canvas.textDraw(inputText,width/6,height/2, "black");
}
