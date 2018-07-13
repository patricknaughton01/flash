console.log("running");

$(function(){
  $("#jellyCardProgramSelect").chosen();
  displayConfigMenu();
  $("#jellyCardProgramSelect").on("change", displayConfigMenu);
});

function configAnki(){

}

function displayConfigMenu(event){
  var ankiBlock = document.getElementById("jellyAnkiConfig");
  var quizletBlock = document.getElementById("jellyQuizletConfig");
  ankiBlock.style.display = "none";
  quizletBlock.style.display = "none";
  switch($("#jellyCardProgramSelect").val()){
    case "anki":
      ankiBlock.style.display = "block";
      break;
    case "quizlet":
      quizletBlock.style.display = "block";
      break;
    default:
      console.log("error");
  }
}
