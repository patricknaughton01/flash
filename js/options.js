
$(function(){
  $("#jellyCardProgramSelect").chosen({
    width: "100px"
  });
  displayConfigMenu();
  $("#jellyCardProgramSelect").on("change", displayConfigMenu);
  $("#jellyAnkiConfigSubmit").on("click", configAnki);
  $("#jellyQuizletGo").on("click", function(){
    var state = makeRandom(100);
    chrome.runtime.sendMessage({
      "purpose": "quizletAuth",
      "state": state,
      "url": "https://quizlet.com/authorize?response_type=code&client_id=Ht4NH2ktXv&scope=read write_set&state=" + state
    });
  });
  toc("toc-list");
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

function toc(listId){
  var list = document.getElementById("toc-list");
  var contents = document.getElementById("jellyContent").innerHTML.toString();
  var matches = contents.match(/<h(\d).*?id=\"(.*?)\">.*?<\/h\d>/g);
  var tabPx = 10;
  for(var i = 0; i < matches.length; i++){
    var number = parseInt(matches[i].match(/<h(\d).*?>/)[1]);
    var id = matches[i].match(/id=\"(.*?)\"/)[1];
    var title = matches[i].match(/<h\d.*?>(.*?)<\/h\d>/)[1];
    var tabWidth = (number - 1) * tabPx;
    var listElem = document.createElement("LI");
    var linkElem = document.createElement("A");
    linkElem.href = "#" + id;
    var textElem = document.createTextNode(title);
    var fontSize = 20 - 2*number;
    linkElem.appendChild(textElem);
    linkElem.style.fontSize = fontSize.toString() + "px";
    listElem.appendChild(linkElem);
    listElem.style.paddingLeft = tabWidth.toString() + "px";
    listElem.style.listStyleType = "none";
    list.appendChild(listElem);
  }
}

function makeRandom(len){
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var arr = [];
  for(var i = 0; i < len; i++){
    arr.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }
  return(arr.join(""));
}
