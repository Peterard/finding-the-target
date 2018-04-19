const genetic = new Genetic();

genetic.generateRandomPopulation()

let iteration = 0;
let finalOutcome = {};
let finalPlayer;
let finalOpponent;
let evolutionIterationProcess;
let playProcess;
let movementProcess;

let pageNumber = 0;
const headerText = ["Welcome", "Rules", "How to play", "Strategy", "Other versions"];
const titleText = ["This is a machine learning game", "There are three main rules to this game", "Movement", "How will you play?", "Com vs Com"];
const contentText = ["You play against the computer, and the computer (theoretically) gets better as you play",
"<ol>\
  <li>You are a yellow circle. Your aim is to get home to the brown circle in the middle.</li>\
  <li>You need to get home before your opponent, a pink circle. If the pink circle gets home first, you lose.</li>\
  <li>If you touch or 'tag' your opponent, then the one of you who is closest to home when you touch is unable to move for a few seconds.</li>\
</ol>",
"You move via clicking in the direction that you want to move in. A red reticule should appear wherever you click on the screen. Your yellow circle will move (quite slowly) in that direction",
"Will you make a beeline for the target? Will you be agressive and first seek to subdue your opponent by tagging them before going towards the objective? And what will the computer do?",
"If you would like to relax and watch two computers duel it out instead, then please feel free to try the <a href='../train_com_test_com/index.html'>Com vs Com Version</a><br><br>\
 Alternatively, if you want to teach the bots how you play by playing against them, go ahead at <a href='../train_player_test_player/index.html'>Bot vs Player (Learning) Version</a>. Be warned, the bots are not fast learners."];
const buttonText = ["Rules ▶", "How to play ▶", "Strategy ▶", "Versions ▶", "Train"];

const nextPage = function(){

}

// run this in 500ms (1 second)
document.getElementById("progress-button").addEventListener("click", function(e){
  e.preventDefault();
  if(pageNumber < 4){
    pageNumber += 1
    $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
    $("#canvas-overlay .card-title").html(titleText[pageNumber]);
    $("#canvas-overlay .card-text").html(contentText[pageNumber]);
    $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
  }else{
    $("#canvas-overlay").hide();
    trainComPlayHuman();
  }
});

// run this in 500ms (1 second)
document.getElementById("play-again-button").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("continue-canvas-overlay").classList.add("d-none");
  trainComPlayHuman();
});

var gameFinish = function(){
  const gameResult = genetic.gameResultWin;
  const noOfWins = genetic.noOfWins;
  const noOfLosses = genetic.noOfLosses;

  document.getElementById("continue-canvas-overlay").classList.remove("d-none");
  document.getElementById("post-game-message-title").innerHTML = gameResult ? "Congratulations!" : "Unlucky!";
  document.getElementById("post-game-message").innerHTML = gameResult ? "You won! Continue?" : "You lost! Play again?";
  document.getElementById("post-game-results-won").innerHTML =  "Won: " + Math.round((100 * (noOfWins / (noOfWins + noOfLosses)))) + "% (" + noOfWins + "/" + (noOfWins + noOfLosses) + ")";
  document.getElementById("post-game-results-lost").innerHTML = "Lost: " + Math.round((100 * (noOfLosses / (noOfWins + noOfLosses)))) + "% (" + noOfLosses + "/" + (noOfWins + noOfLosses) + ")";
  document.getElementById("post-game-results-won-bar").style.width = Math.round(100 * (noOfWins / (noOfWins + noOfLosses))) + "%";
  document.getElementById("post-game-results-lost-bar").style.width = Math.round(100 * (noOfLosses / (noOfWins + noOfLosses))) + "%";
}

//genetic.play();
