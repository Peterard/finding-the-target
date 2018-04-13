var Neat    = neataptic.Neat;
var Methods = neataptic.Methods;
var Config  = neataptic.Config;
var Architect = neataptic.architect; //This might need to be changed to neataptic.Architect (i.e. capital letter) depending on the version of neaptic
var Network = neataptic.Network;
var userNavigation = [];

document.getElementById("cvs").addEventListener("click", function(event){
  userNavigation = [event.layerX, event.layerY];
})

function Genetic(){
  return{
  neat: null, // https://wagenaartje.github.io/neataptic/docs/neat/
  opponentNeat: null, // https://wagenaartje.github.io/neataptic/docs/neat/
  startingInput: [],
  startingOpponentInput: [],
  userControlled: false,
  timeSteps: 70,
  maxInitialDistance: 65,
  minDistance: 5,
  tagDistance: 6,
  cooldownTimer: 20,
  maxSpeed: 1,
  countdown: 5,
  playerCooldown: 0,
  opponentCooldown: 0,
  testTimer: 0,
  evolutionIterationProcess: null,
  movementProcess: null,
  evolutionIteration: 0,
  numberOfEvolutionsEachRound: 250,
  animationTimer: 0,
  duelCounter: 0,
  gameResultWin: false,
  noOfLosses: 0,
  noOfWins: 0,
  currentPosition: [],
  currentOpponentPosition: [],
  finalOutcome: [],
  finalOpponentOutcome: [],
  generateRandomPopulation: function () {
    this.neat = new Neat(
      6, // number of inputs
      2, // number of outputs
      null, // fitnessFunction - in this example we are calculating fitness inside live method
      {
        elitism: 15, // this sets how many genomes in population will be passed into next generation without mutation https://www.researchgate.net/post/What_is_meant_by_the_term_Elitism_in_the_Genetic_Algorithm
        popsize: 20,
        mutationRate: 0.3, // sets the mutation rate. If set to 0.3, 30% of the new population will be mutated. Default is 0.3
        network: // https://wagenaartje.github.io/neataptic/docs/architecture/network/
          new Architect.Random(
            6,
            8,
            2,
          ),
      },
    )

    this.opponentNeat = new Neat(
      6, // number of inputs
      2, // number of outputs
      null, // fitnessFunction - in this example we are calculating fitness inside live method
      {
        elitism: 15, // this sets how many genomes in population will be passed into next generation without mutation https://www.researchgate.net/post/What_is_meant_by_the_term_Elitism_in_the_Genetic_Algorithm
        popsize: 20,
        mutationRate: 0.3, // sets the mutation rate. If set to 0.3, 30% of the new population will be mutated. Default is 0.3
        network: // https://wagenaartje.github.io/neataptic/docs/architecture/network/
          new Architect.Random(
            6,
            8,
            2,
          ),
      },
    )
  },
  duel: function(){
    this.duelCounter
  },
  live: function () {
    // increment generation index
    this.iterateGeneration();

    this.setInitialPositionValue();

    const isUserControlled = this.userControlled;
    // loop through each genome
    for (let genomeIndex in this.neat.population) {

      this.setGenome(genomeIndex);


      this.userControlled = false;

      for(let repeatCounter = 0; repeatCounter < 5; repeatCounter++){
        this.initializePositionBeforeTimeStep();

        for (let i = 0; i < this.timeSteps; i++){
          this.timeStep()
          if(this.finishLoop){
            break
          }
        }
        this.determineFitness();
      }

      this.userControlled = isUserControlled;
    }
  },
  play: function(){
    this.iterateGeneration();

    this.setInitialPositionValue();

    this.setGenome(0);

    this.initializePositionBeforeTimeStep();

    this.finishLoop = false;

    this.animationTimer = 0;

    this.moveAndDraw();

  },
  moveAndDraw: function(){
    this.animationTimer++

    if(this.animationTimer === 1){
      this.drawMovement();
      var thisGenetic = this;
      this.movementProcess = setTimeout(function(){thisGenetic.moveAndDraw() }, 1000);
    }else if(!(this.finishLoop || this.animationTimer > 400)){
        this.timeStep();
        this.drawMovement();

        var thisGenetic = this;
        this.movementProcess = setTimeout(function(){thisGenetic.moveAndDraw() }, 50);
    }else{
      this.finishLoop = false;

      if(this.animationTimer >= 400 && this.userControlled){
        this.gameResultWin = false;
        this.noOfLosses += 1;
      }

      gameFinish();
    }
  },
  iterateGeneration: function(){
    this.neat.generation += 1;
    this.opponentNeat.generation += 1;

    this.neat.sort();
    this.opponentNeat.sort();
  },
  setInitialPositionValue: function(){
    const playerStartingBearing = Math.random() * 2 * Math.PI;
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
  determineFitness: function(){
    const finalPlayerDistanceToOrigin = Math.sqrt(Math.pow(this.currentPosition[0], 2) + Math.pow(this.currentPosition[1], 2));
    const finalOpponentDistanceToOrigin = Math.sqrt(Math.pow(this.currentOpponentPosition[0], 2) + Math.pow(this.currentOpponentPosition[1], 2));

    // calculate fitness for each genome
    // We say that fitness is inversely proportional to the distance from the origin, and proportional to the opoonent's distance to the origin
    this.genome.score += ((1 + finalOpponentDistanceToOrigin) / (1 + finalPlayerDistanceToOrigin)) * (1 * (this.playerTagSuccesses + 1)) * (1 / (this.opponentTagSuccesses + 1));//(5/(0.01 + finalPlayerDistanceToOrigin)) + (finalPlayerDistanceToOrigin < this.minDistance && finalOpponentDistanceToOrigin > finalPlayerDistanceToOrigin ? 1 : 0);//(1 + finalOpponentDistanceToOrigin) / (1 + finalPlayerDistanceToOrigin);
    this.opponentGenome.score += ((1 + finalPlayerDistanceToOrigin) / (1 + finalOpponentDistanceToOrigin)) * (1 * (this.playerTagSuccesses + 1)) * (1 / (this.opponentTagSuccesses + 1));//(5/(0.01 + finalOpponentDistanceToOrigin)) + (finalOpponentDistanceToOrigin < this.minDistance && finalOpponentDistanceToOrigin < finalPlayerDistanceToOrigin ? 1 : 0);//(1 + finalPlayerDistanceToOrigin) / (1 + finalOpponentDistanceToOrigin);
  },
  setGenome: function(genomeIndex){
    this.genome = this.neat.population[genomeIndex]
    this.opponentGenome = this.opponentNeat.population[genomeIndex]

    this.genome.score = 0
    this.opponentGenome.score = 0
  },
  makeRatioASimulationPosition: function(ratio){
    return (ratio - 0.5) * (2*this.maxInitialDistance) ;
  },
  makeSimulationPositionARatio: function(simPosition){
    return simPosition / (2*this.maxInitialDistance);
  },
  timeStep: function(){
    //TRIG IN HERE a2 = b2 + c2 - 2bc cos A
    const relativeOpponentPosition = [this.currentOpponentPosition[0] - this.currentPosition[0], this.currentOpponentPosition[1] - this.currentPosition[1]];
    const relativePlayerPosition = [this.currentPosition[0] - this.currentOpponentPosition[0], this.currentPosition[1] - this.currentOpponentPosition[1]];

    let output = [];

    if(this.userControlled){
      let ratioCoords;
      if(userNavigation.length > 0){
        ratioCoords = canvasCoordinatesToCanvasRatio(userNavigation);
        output[0] = this.makeRatioASimulationPosition(ratioCoords[0]) - this.currentPosition[0];
        output[1] = this.makeRatioASimulationPosition(ratioCoords[1]) - this.currentPosition[1];
      }else{
        output = [0,0]
      }
    }else{
      output = this.genome.activate(this.currentPosition, this.currentOpponentPosition, relativeOpponentPosition);
    }
    let opponentMovement = this.opponentGenome.activate(this.currentOpponentPosition, this.currentPosition, relativePlayerPosition)

    output[0] = notNAElseZero(output[0]);
    output[1] = notNAElseZero(output[1]);
    opponentMovement[0] = notNAElseZero(opponentMovement[0]);
    opponentMovement[1] = notNAElseZero(opponentMovement[1]);

    output = limitValue(output, this.maxSpeed);
    opponentMovement = limitValue(opponentMovement, this.maxSpeed);

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

    if(playerDistanceToOrigin < this.minDistance || opponentDistanceToOrigin < this.minDistance
      || (playerDistanceToOrigin > this.maxInitialDistance && opponentDistanceToOrigin > this.maxInitialDistance)){
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
    const xPosition = this.makeSimulationPositionARatio(positionThisFrame[0]);
    const yPosition = this.makeSimulationPositionARatio(positionThisFrame[1]);
    const xOpponentPosition = this.makeSimulationPositionARatio(opponentPositionThisFrame[0]);
    const yOpponentPosition = this.makeSimulationPositionARatio(opponentPositionThisFrame[1]);
    if(userNavigation.length === 2){
      const userTarget = canvasCoordinatesToCanvasRatio(userNavigation);
      drawFourCircles(0.5, 0.5, xPosition + 0.5, yPosition + 0.5, xOpponentPosition + 0.5, yOpponentPosition + 0.5, userTarget[0], userTarget[1]);
    }else{
      drawThreeCircles(0.5, 0.5, xPosition + 0.5, yPosition + 0.5, xOpponentPosition + 0.5, yOpponentPosition + 0.5);
    }
  },
  evolve: function () {
    const neat = this.neat
    const averageScore = neat.getAverage();
    $("#results").prepend(`[generation ${neat.generation}] Average score: ${neat.getAverage()} (the closer to zero the better) <br>`);
    // sort by genome.score in descending order
    neat.sort()

    // our new population will be here
    let newPopulation = []

    // we want to push neat.elitism number of best genomes into the new population automatically
    let numberOfElitesAdded = 0;
    for (let i = 0; i < neat.elitism; i++) {
      if(!isNaN(neat.population[i].score)){
        newPopulation.push(neat.population[i])
        numberOfElitesAdded += 1
      }
    }

    // we want to get offspring from the current population and push it into the new population
    for (let i = 0; i < neat.popsize - numberOfElitesAdded; i++) {
      newPopulation.push(neat.getOffspring())
    }

    // set new population
    neat.population = newPopulation
    // mutate the population
    neat.mutate()

    //opponent grows too
    const opponentNeat = this.opponentNeat
    $("#results").prepend(`[generation ${opponentNeat.generation}] Average score: ${opponentNeat.getAverage()} (the closer to zero the better) <br>`);
    opponentNeat.sort()
    newPopulation = []
    numberOfElitesAdded = 0;
    for (let i = 0; i < opponentNeat.elitism; i++) {
      if(!isNaN(opponentNeat.population[i].score)){
        newPopulation.push(opponentNeat.population[i])
        numberOfElitesAdded += 1
      }
    }
    for (let i = 0; i < opponentNeat.popsize - numberOfElitesAdded; i++) {
      newPopulation.push(opponentNeat.getOffspring())
    }
    opponentNeat.population = newPopulation
    opponentNeat.mutate()

    return averageScore;
  },
  listenToEndAllProcesses: function(){
    document.getElementById("exit").addEventListener("click", function(){
      clearCanvas();
      this.endAllProcesses();
    });

    document.getElementById("restart").addEventListener("click", function(){
      trainComPlayHuman();
    });
  },
  endAllProcesses: function(){
    clearTimeout(this.evolutionIterationProcess);
    clearTimeout(this.movementProcess);
  },
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
