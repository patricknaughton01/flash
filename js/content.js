
var highlightedText = "";
var cardExists = false;

/**
 * Add a card to the DOM at the icon location to create a card
 */
function addCard(termText, x, y, xSize, ySize, element){
  if (!cardExists){
    cardExists = true;
    element.id = "jellyActiveIcon";
    window.getSelection().removeAllRanges();
    var container = document.createElement("div");
    container.classList.add("jellyNewCardContainer");
    container.style.position = "absolute";
    xOffset = xSize + 5;
    yOffset = ySize/2 - 100;
    x += xOffset;
    y += yOffset;
    container.style.left = x.toString() + "px";
    container.style.top = y.toString() + "px";
    document.getElementsByTagName("body")[0].appendChild(container);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.runtime.getURL('html/card-template.html'));
    xhr.onreadystatechange = function(){
      if(this.readyState !== 4)return;
      if(this.status !== 200)return;
      document.getElementsByClassName("jellyNewCardContainer")[0].innerHTML = this.responseText;
      fillInCard();
    }
    xhr.send();
  }
}

/**
 *  A function to fill in the detials of a card based on the program the user has
 *  selected.
 */
function fillInCard(){
  chrome.storage.sync.get("flashCardProgram", function(response){
    // Fill in different fields based on the chosen flash card program
    switch(response["flashCardProgram"]){
      case "anki":
        var newCard = document.getElementById("jellyNewCard");
        newCard.style.backgroundImage = "url(" + chrome.runtime.getURL('img/anki_logo.jpg') + ")";
        newCard.style.backgroundRepeat = "no-repeat";
        newCard.style.backgroundSize = "100%";
        chrome.storage.sync.get(["ankiVersion", "ankiAddress"], function(response){
          if(response.ankiVersion === undefined || response.ankiAddress === undefined){
            alert("You haven't set up Anki");
            chrome.tabs.create({"url":"/html/options.html"});
          }else{
            var xhr = new XMLHttpRequest();
            xhr.open('POST',"http://" + response.ankiAddress.toString() + ":8765");
            xhr.onreadystatechange = function(){
              if(this.readyState !== 4)return;
              if(this.status !== 200)return;
              displayAnkiConfig(JSON.parse(this.responseText));
            }
            xhr.addEventListener("error", function(error){
              console.log(error);
              alert("Couldn't connect to Anki. Is your address correct? Is Anki running? Do you have AnkiConnect installed?");
            });
            xhr.send(JSON.stringify({
              "action": "multi",
              "version": response.ankiVersion,
              "params": {
                "actions": [
                  {"action": "deckNames"},
                  {"action": "modelNames"}
                ]
              }
            }));
          }
        });
        /*var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.runtime.getURL('html/anki/text-fb-card.html'));
        xhr.onreadystatechange = function(){
          if(this.readyState !== 4)return;
          if(this.status !== 200)return;
          document.getElementById("jellyNewTextCardDependent").innerHTML = this.responseText;
          document.getElementById("jellyNewTextTermField").value = highlightedText;
          document.getElementById("jellyNewTextAnswerField").focus();
          //document.getElementById("jellySaveButton").onclick = saveCard();
        }
        xhr.send();*/
        break;
      case "quizlet":
        break;
      default:
        chrome.tabs.create({"url": "/html/options.html"});
    }
  });
}

/**
 * Display Anki Config info based on the user's anki account info
 */
function displayAnkiConfig(accountInfo){
  var deckNames = accountInfo[0];
  var modelNames = accountInfo[1];
  chrome.storage.sync.get(["ankiDeck", "ankiModel"], function(response){
    var deck;
    var model;
    if(response.ankiDeck === undefined || !deckNames.includes(response.ankiDeck)){
      deck = deckNames[0];
    }else{
      deck = response.ankiDeck;
    }
    if(response.ankiModel === undefined || !modelNames.includes(response.ankiModel)){
      model = modelNames[0];
    }else{
      model = response.ankiModel;
    }
    chrome.storage.sync.set({"ankiDeck": deck, "ankiModel": model}, function(){});
    document.getElementById("jellyNewCardConfig").innerHTML = "<div id=\"jellyNewAnkiCardDeckBox\"><label for=\"jellyNewAnkiCardDeck\">Deck: </label><select id=\"jellyNewAnkiCardDeck\" class=\"jellyNewAnkiCardConfig jellyNewAnkiCardConfigSelect\"></select></div><div id=\"jellyNewAnkiCardModelBox\"><label for=\"jellyNewAnkiCardModel\">Model: </label><select id=\"jellyNewAnkiCardModel\" class=\"jellyNewAnkiCardConfig jellyNewAnkiCardConfigSelect\"></select></div>";
  });
}

/**
 * Create image popup when user highlights text
 */
document.onmouseup = function(){
  var x = event.pageX;
  var y = event.pageY;

  var clickedElement = event.target;
  var clickedIcon = elementClassContainsClick(["jellyIcon"], clickedElement);
  var clickedCard = elementClassContainsClick(["jellyNewTextCard"], clickedElement);
  if(clickedIcon != null){
    var cardLeftStart = parseInt(clickedIcon.style.left);
    var cardTopStart = parseInt(clickedIcon.style.top);
    addCard(
      highlightedText,
      cardLeftStart,
      cardTopStart,
      clickedIcon.offsetWidth,
      clickedIcon.offsetHeight,
      clickedIcon
    );
  }else if(clickedCard != null){

  }else{
    clearClass("jellyIcon");
    clearClass("jellyNewCardContainer");
    cardExists = false;
    highlightedText = window.getSelection().toString();
    if(highlightedText != ""){
      var xOffset = -9;
      var yOffset = 10;
      var xSize = 18;
      var ySize = 18
      x += xOffset;
      y += yOffset;
      var icon = document.createElement("div");
      icon.classList.add("jellyIcon");
      icon.style.position = "absolute";
      icon.style.width = xSize.toString() + "px";
      icon.style.height = ySize.toString() + "px";
      icon.style.left = x.toString() + "px";
      icon.style.top = y.toString() + "px";
      icon.innerHTML = "<img src='" + chrome.extension.getURL('img/icon.png') + "' />";
      document.getElementsByTagName("body")[0].appendChild(icon);
    }
  }


}

/**
 * Return true if an element with a class in classList contains clicked_element
 */
function elementClassContainsClick(classList, clicked_element){
  while(true){
    if(hasOverlap(Array.from(clicked_element.classList), classList)){
      break;
    }else if(clicked_element.parentNode == document){
      clicked_element = null;
      break;
    }else{
      clicked_element = clicked_element.parentNode;
    }
  }
  return clicked_element;
}

/**
 * Return true if the lists intersect (their union is not the emptyset)
 */
function hasOverlap(list1, list2){
  for (var i = 0; i<list1.length; i++){
    if(list2.includes(list1[i])){
      return(true);
    }
  }
  return(false);
}

/**
 * Delete existing image popups if the user doesn't highlight anything
 */
function clearClass(className){
  try{
    var icons = document.getElementsByClassName(className);
    for(var i = 0; i < icons.length; i++){
      icons[i].parentNode.removeChild(icons[i]);
    }
  }catch(exception){}
}
