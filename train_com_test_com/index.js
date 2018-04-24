let genetic = new Genetic();

const retrievedGenetic = JSON.parse(localStorage.getItem('genetic'));

if (Genetic.prototype.isPrototypeOf(retrievedGenetic)){
  genetic = retrievedGenetic;
}

genetic.generateRandomPopulation()

let iteration = 0;
let finalOutcome = {};
let finalPlayer;
let finalOpponent;
let evolutionIterationProcess;
let playProcess;
let movementProcess;

let pageNumber = 0;
const headerText = ["Welcome", "Rules", "Strategy", "Other versions"];
const titleText = ["This is a machine learning game", "There are three main rules to this game", "How will they play?", "Bot vs Player"];
const contentText = ["One bot plays against another, and they should (theoretically) both get better as they play",
"<ol>\
  <li>The bots are yellow and pink circles. Their aim is to get home to the brown circle in the middle.</li>\
  <li>They need to get home before their opponent, else they lose.</li>\
  <li>If they touch or 'tag' their opponent, then the bot which is closest to home when they touch is unable to move for a few seconds.</li>\
</ol>",
"Will they make a beeline for the target? Will they be agressive and first seek to subdue your opponent by tagging them before going towards the objective? How will their strategy develop?",
"If you want to go head to head against the bots, go ahead and try at <a href='../train_com_test_player/index.html'>Bot vs Player Version</a> <br><br>\
 Alternatively, if you want to teach the bots how you play by playing against them, go ahead at <a href='../train_player_test_player/index.html'>Bot vs Player (Learning) Version</a>. Be warned, the bots are not fast learners."];
const buttonText = ["Rules ▶", "Strategy ▶", "Versions ▶", "Train"];

const nextPage = function(){

}

// run this in 500ms (1 second)
document.getElementById("progress-button").addEventListener("click", function(e){
  e.preventDefault();
  if(pageNumber < 3){
    pageNumber += 1
    $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
    $("#canvas-overlay .card-title").html(titleText[pageNumber]);
    $("#canvas-overlay .card-text").html(contentText[pageNumber]);
    $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
  }else{
    $("#canvas-overlay").hide();
    trainComPlayCom();
  }
});

// run this in 500ms (1 second)


var gameFinish = function(){
  localStorage.setItem('genetic', JSON.stringify(genetic));

  trainComPlayCom();
}

//genetic.play();
