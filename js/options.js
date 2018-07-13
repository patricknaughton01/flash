$(function(){
  $("#jellyCardProgramSelect").chosen();
  displayConfigMenu();
  $("#jellyCardProgramSelect").on("change", displayConfigMenu);
  $("#jellyAnkiConfigSubmit").on("click", configAnki);
});

function configAnki(){
  var version = parseInt(document.getElementById("jellyAnkiConfigVersion").value);
  var versionValid = version >= 1 && version <=6;
  var address = document.getElementById("jellyAnkiConfigAddress").value;
  var addressValid = true;

  if(address === ""){
    address = "127.0.0.1";
  }else if(!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(address))){
    addressValid = false;
  }

  var versionErrorElem = document.getElementById("jellyAnkiConfigVersionError");
  var addressErrorElem = document.getElementById("jellyAnkiConfigAddressError");
  versionErrorElem.style.display = "none";
  addressErrorElem.style.display = "none";
  if(!versionValid){
    versionErrorElem.style.display = "block";
  }
  if(!addressValid){
    addressErrorElem.style.display = "block";
  }
  if(versionValid && addressValid){
    chrome.storage.sync.set({"flashCardProgram": "anki"});
    chrome.storage.sync.set({"ankiVersion": version});
    chrome.storage.sync.set({"ankiAddress": address});
    alert("Your settings have been saved. You can view them at any time by clicking the \"Configure Card Programs\" button in this extensions popup. You can continue perusing your settings at your leisure.");
  }
}

function displayConfigMenu(event){
  var ankiBlock = document.getElementById("jellyAnkiConfig");
  var quizletBlock = document.getElementById("jellyQuizletConfig");
  ankiBlock.style.display = "none";
  quizletBlock.style.display = "none";
  switch($("#jellyCardProgramSelect").val()){
    case "anki":
      ankiBlock.style.display = "block";
      chrome.storage.sync.get(["ankiVersion", "ankiAddress"], function(response){
        if(response.ankiVersion !== undefined){
          document.getElementById("jellyAnkiConfigVersion").value = response.ankiVersion;
        }
        if(response.ankiAddress !== undefined){
          document.getElementById("jellyAnkiConfigAddress").value = response.ankiAddress;
        }
      });
      break;
    case "quizlet":
      quizletBlock.style.display = "block";
      break;
    default:
      console.log("don't select none!");
  }
}
