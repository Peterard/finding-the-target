
var trainComPlayCom = function(){
  genetic.live();
  genetic.evolve();

  if(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 1) < genetic.numberOfEvolutionsEachRound){
    genetic.evolutionIteration += 1;
    drawProgressText("Training completion: " + Math.round(100*(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 1)) / (genetic.numberOfEvolutionsEachRound)) + "%");
    genetic.evolutionIterationProcess = setTimeout(trainComPlayCom, 1);
  }else{
    genetic.evolutionIteration += 1;

    genetic.userControlled = false;

    genetic.play();
  }
};


var trainComPlayHuman = function(){
  genetic.live();
  genetic.evolve();

  if(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 1) < genetic.numberOfEvolutionsEachRound){
    genetic.evolutionIteration += 1;
    drawProgressText("Training completion: " + Math.round(100*(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 1)) / (genetic.numberOfEvolutionsEachRound)) + "%");
    let thisGenome = genetic;
    genetic.evolutionIterationProcess = setTimeout(trainComPlayHuman, 1);
  }else{
    genetic.evolutionIteration += 1;

    genetic.userControlled = true;

    genetic.play();
  }
};


var trainHumanPlayHuman = function(){

  if(genetic.evolutionIteration < genetic.numberOfEvolutionsEachRound){
    genetic.live();
    genetic.evolve();

    if(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 1) < genetic.numberOfEvolutionsEachRound){
      genetic.evolutionIteration += 1;
      drawProgressText("Training completion: " + Math.round(100*(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 1)) / (genetic.numberOfEvolutionsEachRound)) + "%");
      let thisGenome = genetic;
      genetic.evolutionIterationProcess = setTimeout(trainHumanPlayHuman, 1);
    }else{
      genetic.evolutionIteration += 1;

      genetic.userControlled = true;

      genetic.play();
    }

  }else{
    genetic.duel();
  }
};
