var userNavigation = [];
var Architect = synaptic.Architect;

let touchStarted = false;


alert("Changed");

document.getElementById("cvs").addEventListener("click", function(event){
  alert(event);
  alert(event.pageX);
  event.preventDefault();
  userNavigation = [event.layerX, event.layerY];
})

document.getElementById("cvs").addEventListener("touchstart", function(event){
  alert(Object.keys(event.originalEvent.targetTouches));
  alert(event.originalEvent.targetTouches);
  alert(event.originalEvent.targetTouches.pageX);
  event.preventDefault();
  userNavigation = [event.layerX, event.layerY];
    touchStarted = true;
})

document.getElementById("cvs").addEventListener("mousedown", function(event){
  event.preventDefault();
  userNavigation = [event.layerX, event.layerY];
    touchStarted = true;
})

document.getElementById("cvs").addEventListener("touchend", function(event){
  event.preventDefault();
  userNavigation = [event.layerX, event.layerY];
  touchStarted = false;
})

document.getElementById("cvs").addEventListener("mouseup", function(event){
  event.preventDefault();
  userNavigation = [event.layerX, event.layerY];
  touchStarted = false;
})

document.getElementById("cvs").addEventListener("touchcancel", function(event){
  event.preventDefault();
  userNavigation = [event.layerX, event.layerY];
  touchStarted = false;
})

document.getElementById("cvs").addEventListener("touchmove", function(event){
  event.preventDefault();
  if(touchStarted){
    userNavigation = [event.layerX, event.layerY];
  }
})

document.getElementById("cvs").addEventListener("mousemove", function(event){
  event.preventDefault();
  if(touchStarted){
    userNavigation = [event.layerX, event.layerY];
  }
})

function Mimic(){
  return{
  opponentNetwork: null, // https://wagenaartje.github.io/neataptic/docs/neat/
  startingInput: [],
  startingOpponentInput: [],
  userControlled: false,
  timeSteps: 110,
  maxInitialDistance: 20,
  minDistance: 2.3,
  tagDistance: 1.8,
  cooldownTimer: 20,
  startDelay: 50,
  maxSpeed: 0.2,
  countdown: 5,
  playerCooldown: 0,
  opponentCooldown: 0,
  finishTimer: 0,
  finishTimerDuration: 30,
  animationTimer: 0,
  timeLimit: 400,
  duelCounter: 0,
  gameResultWin: false,
  noOfLosses: 0,
  noOfWins: 0,
  currentGen: 0,
  currentPosition: [],
  currentOpponentPosition: [],
  trainingData: [],
  generatePopulation: function () {
    this.opponentNetwork = new Architect.Liquid(6, 25, 4, 50, 20);

    this.trainingData = mimicTrainingData; //initial training data just to get the thing started (1 round x 5 goes)
  },
  prepareDuel: function(){
    this.setInitialPositionValue();

    this.initializePositionBeforeTimeStep();

    this.finishLoop = false;

    this.animationTimer = 0;

    this.currentGen++;

    this.userControlled = true;

    this.duel();

  },
  duel: function(){
    const isGenerationFinished = this.currentGen % 5 == 0;
    const isMatchFinished = this.animationTimer >= this.timeLimit || this.finishLoop;
    const isStart = this.animationTimer <= this.startDelay;

    if(!isMatchFinished && !isStart){
      this.animationTimer++

      this.timeStep();
      this.drawMovement();

      var thisGenetic = this;
      setTimeout(function(){thisGenetic.duel() }, 30);
    }else if(!isMatchFinished && isStart){
      this.animationTimer++

      this.drawMovement();
      this.drawPregameOverlay();

      var thisGenetic = this;
      setTimeout(function(){thisGenetic.duel() }, 30);
    } else if(this.finishTimer < this.finishTimerDuration){
      this.finishTimer ++;
      this.drawMovement();

      var thisGenetic = this;
      setTimeout(function(){thisGenetic.duel() }, 30);
    }else if(!isGenerationFinished){
      this.finishTimer = 0;
      this.drawMovement();
      this.prepareDuel();
    }else{
      this.finishTimer = 0;
      this.evolve();
      console.log(JSON.stringify(this.trainingData));
      this.trainingData = [];
      roundOver();
    }
  },
  setInitialPositionValue: function(){
    const playerStartingBearing = Math.PI/2 - (2 * Math.random() * Math.PI/10  - Math.PI/10) * (2 * Math.round(Math.random()) - 1); //- Math.PI/30 + Math.random() * 2 * Math.PI / 15;
    const opponentStartingBearing = playerStartingBearing + (2 * Math.round(Math.random() + 1) - 3) * (Math.PI / 18);

    const playerInitialXCoordinate = this.maxInitialDistance * Math.cos(playerStartingBearing);
    const playerInitialYCoordinate = this.maxInitialDistance * Math.sin(playerStartingBearing);
    const opponentInitialXCoordinate = this.maxInitialDistance * Math.cos(opponentStartingBearing);
    const opponentInitialYCoordinate = this.maxInitialDistance * Math.sin(opponentStartingBearing);

    this.startingInput[0] = playerInitialXCoordinate;
    this.startingInput[1] = playerInitialYCoordinate;
    this.startingOpponentInput[0] = opponentInitialXCoordinate;
    this.startingOpponentInput[1] = opponentInitialYCoordinate;
  },
  initializePositionBeforeTimeStep: function(){
    this.currentPosition = this.startingInput.slice();
    this.currentOpponentPosition = this.startingOpponentInput.slice();

    this.playerCooldown = 0;
    this.opponentCooldown = 0;

    this.playerTagSuccesses = 0;
    this.opponentTagSuccesses = 0;
  },
  makeRatioASimulationPosition: function(ratio){
    simPosition = [];
    simPosition[0] = (ratio[0] - 0.5) * (2 * this.maxInitialDistance * desiredScreenRatio);
    simPosition[1] = (ratio[1] - 0.3) * (2 * this.maxInitialDistance);
    return simPosition;
  },
  makeSimulationPositionARatio: function(simPosition){
    ratio = [];
    ratio[0] = simPosition[0] / (2 * this.maxInitialDistance * desiredScreenRatio);
    ratio[1] = simPosition[1] / (2 * this.maxInitialDistance);
    return ratio;
  },
  timeStep: function(){
    //TRIG IN HERE a2 = b2 + c2 - 2bc cos A
    const relativeOpponentPosition = [this.currentOpponentPosition[0] - this.currentPosition[0], this.currentOpponentPosition[1] - this.currentPosition[1]];
    const relativePlayerPosition = [this.currentPosition[0] - this.currentOpponentPosition[0], this.currentPosition[1] - this.currentOpponentPosition[1]];

    let output = [];

    let ratioCoords;
    if(userNavigation.length > 0){
      ratioCoords = canvasCoordinatesToCanvasRatio(userNavigation);
      output[0] = this.makeRatioASimulationPosition(ratioCoords)[0] - this.currentPosition[0];
      output[1] = this.makeRatioASimulationPosition(ratioCoords)[1] - this.currentPosition[1];
    }else{
      output = [0,0]
    }

    let inputStimuli = [];
    inputStimuli.push(this.currentOpponentPosition[0]);
    inputStimuli.push(this.currentOpponentPosition[1]);
    inputStimuli.push(this.currentPosition[0]);
    inputStimuli.push(this.currentPosition[1]);
    inputStimuli.push(relativePlayerPosition[0]);
    inputStimuli.push(relativePlayerPosition[1]);

    let opponentOutputRaw = this.opponentNetwork.activate(inputStimuli);

    let opponentMovement = [];
    const opponentOutputXSign = opponentOutputRaw[2] > 0.5 ? 1 : -1;
    const opponentOutputYSign = opponentOutputRaw[3] > 0.5 ? 1 : -1;
    opponentMovement[0] = opponentOutputXSign * opponentOutputRaw[0] * this.maxSpeed;
    opponentMovement[1] = opponentOutputYSign * opponentOutputRaw[1] * this.maxSpeed;

    output[0] = notNAElseZero(output[0]);
    output[1] = notNAElseZero(output[1]);
    opponentMovement[0] = notNAElseZero(opponentMovement[0]);
    opponentMovement[1] = notNAElseZero(opponentMovement[1]);

    const rawOutput = output;

    output = limitValue(output, this.maxSpeed);
    opponentMovement = limitValue(opponentMovement, this.maxSpeed);

    let inputTrainingStimuli = [];
    inputTrainingStimuli.push(this.currentPosition[0]);
    inputTrainingStimuli.push(this.currentPosition[1]);
    inputTrainingStimuli.push(this.currentOpponentPosition[0]);
    inputTrainingStimuli.push(this.currentOpponentPosition[1]);
    inputTrainingStimuli.push(relativeOpponentPosition[0]);
    inputTrainingStimuli.push(relativeOpponentPosition[1]);

    let givenOutput = output.slice();
    givenOutput[2] = givenOutput[0] >= 0 ? 1 : 0;
    givenOutput[3] = givenOutput[1] >= 0 ? 1 : 0;
    givenOutput[0] = Math.abs(givenOutput[0] / this.maxSpeed);
    givenOutput[1] = Math.abs(givenOutput[1] / this.maxSpeed);

    this.trainingData.push({
      input: inputTrainingStimuli,
      output: givenOutput
    });

    const playerAndOpponentXDiff = this.currentPosition[0] - this.currentOpponentPosition[0];
    const playerAndOpponentYDiff = this.currentPosition[1] - this.currentOpponentPosition[1];
    const playerAndOpponentDistance = Math.sqrt(Math.pow(playerAndOpponentXDiff, 2) + Math.pow(playerAndOpponentYDiff, 2));
    const playerDistanceToOrigin = Math.sqrt(Math.pow(this.currentPosition[0], 2) + Math.pow(this.currentPosition[1], 2));
    const opponentDistanceToOrigin = Math.sqrt(Math.pow(this.currentOpponentPosition[0], 2) + Math.pow(this.currentOpponentPosition[1], 2));

    if(playerAndOpponentDistance < this.tagDistance && playerDistanceToOrigin < opponentDistanceToOrigin && this.opponentCooldown < 1){
        this.playerCooldown = this.cooldownTimer
        this.opponentTagSuccesses += 1
    }else if(playerAndOpponentDistance < this.tagDistance && playerDistanceToOrigin > opponentDistanceToOrigin && this.playerCooldown < 1){
        this.opponentCooldown = this.cooldownTimer
        this.playerTagSuccesses += 1
    }

    this.playerCooldown -= 1
    this.opponentCooldown -= 1

    if(this.playerCooldown < 1){
      this.currentPosition[0] = this.currentPosition[0] + output[0];
      this.currentPosition[1] = this.currentPosition[1] + output[1];
    }

    if(this.opponentCooldown < 1){
      this.currentOpponentPosition[0] = this.currentOpponentPosition[0] + opponentMovement[0];
      this.currentOpponentPosition[1] = this.currentOpponentPosition[1] + opponentMovement[1];
    }

    this.finishLoop = false;

    const bothPlayerAndOpponentOffTheScreen = ((playerDistanceToOrigin[0] > this.maxInitialDistance * desiredScreenRatio
      || playerDistanceToOrigin[1] > this.maxInitialDistance)
       && (opponentDistanceToOrigin[0] > this.maxInitialDistance * desiredScreenRatio
         ||opponentDistanceToOrigin[1] > this.maxInitialDistance));

    if(playerDistanceToOrigin < this.minDistance || opponentDistanceToOrigin < this.minDistance
      || bothPlayerAndOpponentOffTheScreen){
      this.finishLoop = true;

    if(this.userControlled){
      if(opponentDistanceToOrigin < this.minDistance){
        this.gameResultWin = false;
        this.noOfLosses += 1;
      }else if(playerDistanceToOrigin < this.minDistance){
        this.gameResultWin = true;
        this.noOfWins += 1;
      }
    }
    }
  },
  drawMovement: function(){
    const positionThisFrame = this.currentPosition;
    const opponentPositionThisFrame = this.currentOpponentPosition;
    const xPosition = this.makeSimulationPositionARatio(positionThisFrame)[0];
    const yPosition = this.makeSimulationPositionARatio(positionThisFrame)[1];
    const xOpponentPosition = this.makeSimulationPositionARatio(opponentPositionThisFrame)[0];
    const yOpponentPosition = this.makeSimulationPositionARatio(opponentPositionThisFrame)[1];

    if(userNavigation.length === 2 && this.userControlled){
      const userTarget = canvasCoordinatesToCanvasRatio(userNavigation);
      clearCanvas();
      if(this.finishTimer > 0){
        drawFinish(0.5, 0.3, this.finishTimer, this.finishTimerDuration, this.gameResultWin);
      }
      drawFourCircles(0.5, 0.3, xPosition + 0.5, yPosition + 0.3, xOpponentPosition + 0.5, yOpponentPosition + 0.3, userTarget[0], userTarget[1], this.playerCooldown, this.opponentCooldown);
      drawGenerationText(this.currentGen);
    }else{
      clearCanvas();
      if(this.finishTimer > 0){
        drawFinish(0.5, 0.3, this.finishTimer, this.finishTimerDuration, this.gameResultWin);
      }
      drawThreeCircles(0.5, 0.3, xPosition + 0.5, yPosition + 0.3, xOpponentPosition + 0.5, yOpponentPosition + 0.3, this.playerCooldown, this.opponentCooldown);
      drawGenerationText(this.currentGen);
    }
  },
  drawPregameOverlay: function(){
    const pregameTimer = 4 - Math.ceil((this.animationTimer / this.startDelay) * 3);
    const pregameTimerRaw = 4 - (this.animationTimer / this.startDelay) * 3;
    drawPregameOverlayText(pregameTimer, 255 - Math.round(255 * (pregameTimerRaw - pregameTimer)));
  },
  evolve: function () {
    const learningRate = .1;
    shuffleArray(this.trainingData);
    for(let i in this.trainingData){
      this.opponentNetwork.activate(this.trainingData[i].input);
      this.opponentNetwork.propagate(learningRate, this.trainingData[i].output);
    }
  }
}
}

function limitValue(value, limit){
  const magnitude = Math.sqrt(Math.pow(value[0],2) + Math.pow(value[1],2));
  if(magnitude > limit){
      value[0] = value[0] * (limit / magnitude)
      value[1] = value[1] * (limit / magnitude)
  }
  return value
}

function notNAElseZero(value){
  if(isNaN(value)){
    return 0
  }else{
    return value
  }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
