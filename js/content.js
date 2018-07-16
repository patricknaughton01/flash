
var highlightedText = "";
var cardExists = false;
var ankiAddress = "";
var ankiVersion = "";
var ctrlDown = false;
var altDown = false;

var keyCallbacks = {
  "activationKey": {"callbackDown": "", "callbackUp": ""},
  "pictureTerms": {"callbackDown": "", "callbackUp": ""},
  "audioTerms": {"callbackDown": "", "callbackUp": ""},
  "visibilityToggle": {"callbackDown": "makeCardInvisible", "callbackUp": "makeCardVisible"}
};

/**
 * Trigger keydown functions
 */
document.onkeydown = function(e){
  switch(e.key){
    case "Alt":
      altDown = true;
      break;
    case "Control":
      ctrlDown = true;
      break;
    default:
      chrome.storage.sync.get(null, function(response){
        for(var val in response){
          var key = response[val].key;
          if(key !== undefined && key === e.key && ctrlDown && altDown){
            if(keyCallbacks[val]["callbackDown"] !== ""){
              window[keyCallbacks[val]["callbackDown"]]();
            }
          }
        }
      });
  }
}

document.onkeyup = function(e){
  switch(e.key){
    case "Alt":
      altDown = false;
      break;
    case "Control":
      ctrlDown = false;
      break;
    default:
      chrome.storage.sync.get(null, function(response){
        for(var val in response){
          var key = response[val].key;
          if(key !== undefined && key === e.key && ctrlDown && altDown){
            if(keyCallbacks[val]["callbackUp"] !== ""){
              window[keyCallbacks[val]["callbackUp"]]();
            }
          }
        }
      });
  }
}

/**
 * Make the flash card invisible (if it exists) to allow the user to see text
 * they can highlight for the answer.
 */
function makeCardInvisible(){
  var cardContainer = document.getElementById("jellyNewCardContainer");
  if(cardContainer !== null){
    cardContainer.style.display = "none";
  }
}

/**
 * Make the flash card visible (if it exists)
 */
function makeCardVisible(){
  var cardContainer = document.getElementById("jellyNewCardContainer");
  if(cardContainer !== null){
    cardContainer.style.display = "block";
  }
}

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
    container.id = "jellyNewCardContainer";
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
        newCard.style.backgroundSize = "cover";
        document.getElementById("jellySaveButton").onclick = saveAnkiCard;
        chrome.storage.sync.get(["ankiVersion", "ankiAddress"], function(response){
          if(response.ankiVersion === undefined || response.ankiAddress === undefined){
            alert("You haven't set up Anki");
            chrome.tabs.create({"url":"/html/options.html"});
          }else{
            ankiAddress = response.ankiAddress;
            ankiVersion = response.ankiVersion;
            //ankiRequest(displayAnkiConfig, "deckNames");
            ankiRequest(displayAnkiConfig, "multi", {
              "actions": [
                {"action": "deckNames"},
                {"action": "modelNames"}
              ]
            });
          }
        });
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
    document.getElementById("jellyNewCardConfig").innerHTML = "<div id=\"jellyNewAnkiCardDeckBox\"><label for=\"jellyNewAnkiCardDeck\" class=\"jellyNewAnkiCardConfigLabel\">Deck: </label><select id=\"jellyNewAnkiCardDeck\" class=\"jellyNewAnkiCardConfig jellyNewAnkiCardConfigSelect\"></select></div><div id=\"jellyNewAnkiCardModelBox\"><label for=\"jellyNewAnkiCardModel\" class=\"jellyNewAnkiCardConfigLabel\">Model: </label><select id=\"jellyNewAnkiCardModel\" class=\"jellyNewAnkiCardConfig jellyNewAnkiCardConfigSelect\"></select></div>";
    var configLabels = document.getElementsByClassName("jellyNewAnkiCardConfigLabel");
    for (var i =0; i<configLabels.length; i++){
      configLabels[i].style.backgroundColor = "#ffffff";
      configLabels[i].style.margin = "5px";
    }
    var deckSelect = document.getElementById("jellyNewAnkiCardDeck");
    var modelSelect = document.getElementById("jellyNewAnkiCardModel");
    deckSelect.innerHTML = generateOptionsList(deckNames);
    modelSelect.innerHTML = generateOptionsList(modelNames);
    changeSelection("jellyNewAnkiCardDeck", deck);
    changeSelection("jellyNewAnkiCardModel", model);
    deckSelect.onchange = saveAnkiCardConfig
    modelSelect.onchange = ankiModelUpdate;
    ankiModelUpdate();
  });
}

/**
 *  Put the fields of the card into the web page so they can be edited.
 */
function displayAnkiFields(fields){
  var fieldString = "";
  for(var i = 0; i<fields.length; i++){
    fieldString += "<div id=\"jellyNewAnkiCardField" + fields[i] + "Box\" class=\"jellyNewAnkiCardFieldBox\">";
    fieldString += "<label for=\"jellyNewAnkiCardField" + fields[i] + "\" class=\"jellyNewAnkiCardLabel\">" + fields[i] + ":</label><br/>"
    fieldString += "<div id=\"jellyNewAnkiCardInputBox" + fields[i] + "\" class=\"jellyNewAnkiCardInputBox\">"
    fieldString += "<textarea rows=\"2\" cols=\"20\" id=\"jellyNewAnkiCardField" + fields[i] + "\" class=\"jellyNewAnkiCardField\"></textarea>"
    fieldString += "</div>"
    fieldString += "</div>"
  }
  fieldString += `<style>
    .jellyNewAnkiCardFieldBox{
      margin:5px;
    }
    .jellyNewAnkiCardInputBox{
      margin: 5px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .jellyNewAnkiCardField{
      width: 90%;
      margin: auto;
      display: block;
      resize: none;
    }
    .jellyNewAnkiCardLabel{
      background-color: #ffffff;
    }
  </style>`;
  document.getElementById("jellyNewCardDependent").innerHTML = fieldString;
  chrome.storage.sync.get("ankiHighlightPref", function(response){
    var highlightIndex = response.ankiHighlightPref;
    if(highlightIndex === undefined)highlightIndex = 0;
    document.getElementsByClassName("jellyNewAnkiCardField")[highlightIndex].innerText = highlightedText;
  });
  chrome.storage.sync.get("ankiFocusPref", function(response){
    var focusIndex = response.ankiFocusPref;
    if(focusIndex === undefined)focusIndex = 1;
    try{
      document.getElementsByClassName("jellyNewAnkiCardField")[focusIndex].focus();
    }catch(e){
      // TODO: Make this a banner instead of an alert.
      alert("It seems your focus field was out of range.");
    }
  });
}

/**
 * Save the anki card to the database
 */
function saveAnkiCard(){
  var fields = document.getElementsByClassName("jellyNewAnkiCardField");
  var output = {};
  for(var i = 0; i<fields.length; i++){
    if(fields[i].value === ""){
      alert("You must fill out all fields!");
      return;
    }else{
      var fieldName = fields[i].getAttribute("id");
      output[fieldName.slice(21)] = fields[i].value;
    }
  }
  ankiRequest(ankiCardWrapUp, "addNote", {
    "note": {
      "deckName": document.getElementById("jellyNewAnkiCardDeck").value,
      "modelName": document.getElementById("jellyNewAnkiCardModel").value,
      "fields": output,
      "tags":[
        "jelly"
      ]
    }
  });
}

function ankiCardWrapUp(responseText){
  //TODO: Banner saying whether save was successful or not.
  closeCard();
}

/**
 * Clear out any existing cards or icons
 */
function closeCard(){
  clearClass("jellyIcon");
  clearClass("jellyNewCardContainer");
  cardExists = false;
}

/**
 * Create image popup when user highlights text
 */
document.onmouseup = function(){
  var x = event.pageX;
  var y = event.pageY;

  var clickedElement = event.target;
  var clickedIcon = elementClassContainsClick(["jellyIcon"], clickedElement);
  var clickedCard = elementClassContainsClick(["jellyNewCard"], clickedElement);
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
    highlightedText = window.getSelection().toString();
    if(highlightedText != ""){
      if(!cardExists){
        makeIcon(x, y);
      }else{
        chrome.storage.sync.get("highlightAnswer", function(highlightStatus){
          if(highlightStatus.highlightAnswer){
            chrome.storage.sync.get("ankiFocusPref", function(response){
              var focusIndex = response.ankiFocusPref;
              if(focusIndex === undefined)focusIndex = 1;
              try{
                document.getElementsByClassName("jellyNewAnkiCardField")[focusIndex].innerText = highlightedText;
              }catch(e){
                //TODO: change to Banner
                alert("It appears your focus index was out of range");
              }
            });
          }else{
            closeCard();
            makeIcon(x,y);
          }
        });
      }
    }else{
      closeCard();
    }
  }


}

/**
 * Create an icon at position x, y
 */
function makeIcon(x, y){
  clearClass("jellyIcon");
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
    do{
      var icons = document.getElementsByClassName(className);
      icons[0].parentNode.removeChild(icons[0]);
    }while(icons.length > 0);
  }catch(exception){}
}

/**
 *  Make a request to the anki api
 */
function ankiRequest(callbackFunc, action, params={}){
  chrome.runtime.sendMessage({
    "purpose": "ankiRequest",
    "callback": callbackFunc.name,
    "address": ankiAddress,
    "action": action,
    "version": ankiVersion,
    "params": params
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.type === "ankiResponse"){
    if(request.error !== null){
      console.log(request.error);
      alert("Anki error: " + request.error);
    }else{
      window[request.callback](request.result);
    }
  }
});

/**
 *  Create a string of options where each value and text element are the elements
 *  of inputArr
 */
function generateOptionsList(inputArr){
  var str = "";
  for(var i in inputArr){
    str += "<option value=\"" + inputArr[i] + "\">" + inputArr[i] + "</option>"
  }
  return str;
}

/**
 *  Save the user's last used deck and/or model
 */
function saveAnkiCardConfig(){
  var deck = document.getElementById("jellyNewAnkiCardDeck").value;
  var model = document.getElementById("jellyNewAnkiCardModel").value;
  chrome.storage.sync.set({"ankiDeck": deck, "ankiModel": model});
}

/**
 *  Save the model preference and update the displayed fields based on the model
 */
function ankiModelUpdate(){
  saveAnkiCardConfig();
  ankiRequest(displayAnkiFields, "modelFieldNames", {"modelName": document.getElementById("jellyNewAnkiCardModel").value})
}

/**
 * Change the selected value of the element identified by id `idName` to
 * the value named by `targVal`
 */
 function changeSelection(idName, targVal){
   var selElem = document.getElementById(idName);
   if(selElem != null){
     var opts = selElem.options;
     for (var i = 0; i<opts.length; i++){
       if (opts[i].value == targVal){
         selElem.selectedIndex = i;
         return true;
       }
     }
     return false;
   }else{
     return false;
   }
 }
