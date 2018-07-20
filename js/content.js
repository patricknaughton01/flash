
var highlightedText = "";
var highlightPos = [0, 0];
var cardExists = false;
var ankiAddress = "";
var ankiVersion = "";
var ctrlDown = false;
var altDown = false;
var newCardIdBufferLen = 17;

var keyCallbacks = {
  "activationKey": {"callbackDown": "", "callbackUp": "activateIcon"},
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
    container.style.backgroundColor = "#ffffff";
    xOffset = xSize + 5;
    yOffset = ySize/2 - 100;
    x += xOffset;
    y += yOffset;
    container.style.left = x.toString() + "px";
    container.style.top = y.toString() + "px";
    container.style.zIndex = 1000000;
    document.getElementsByTagName("body")[0].appendChild(container);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.runtime.getURL('html/card-template.html'));
    xhr.onreadystatechange = function(){
      if(this.readyState !== 4)return;
      if(this.status !== 200)return;
      var cardContainers = document.getElementsByClassName("jellyNewCardContainer");
      if(cardContainers.length > 0 && cardContainers[0] !== null){
        cardContainers[0].innerHTML = this.responseText;
        fillInCard();
      }
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
    var newCard = document.getElementById("jellyNewCard");
    if(newCard === null)return;
    newCard.style.backgroundRepeat = "no-repeat";
    newCard.style.backgroundSize = "cover";
    // No need to check for existence because we know `newCard` exists
    document.getElementById("jellyLoadingIcon").src = chrome.extension.getURL("img/loading.gif");
    // Fill in different fields based on the chosen flash card program
    switch(response["flashCardProgram"]){
      case "anki":
        newCard.style.backgroundImage = "url(" + chrome.runtime.getURL('img/anki_logo.jpg') + ")";
        document.getElementById("jellySaveButton").onclick = saveAnkiCard;
        chrome.storage.sync.get(["ankiVersion", "ankiAddress"], function(response){
          if(response.ankiVersion === undefined || response.ankiAddress === undefined){
            alert("You haven't set up Anki");
            chrome.runtime.sendMessage({"purpose": "createTab", "url": "/html/options.html"});
          }else{
            ankiAddress = response.ankiAddress;
            ankiVersion = response.ankiVersion;
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
        newCard.style.backgroundImage = "url(" + chrome.runtime.getURL('img/quizlet_logo.png') + ")";
        document.getElementById("jellySaveButton").onclick = saveQuizletCard;
        chrome.storage.sync.get("quizletUsername", function(response){
          if(response.quizletUsername === undefined){
            alert("You haven't set up Quizlet");
            chrome.runtime.sendMessage({"purpose": "createTab", "url": "/html/options.html"});
          }else{
            quizletRequest(
              displayQuizletConfig,
              "GET",
              "/users/" + response.quizletUsername + "/sets",
            );
          }
        });
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
  if(deckNames.length <= 0){
    alert("You don't have any Anki decks! Make a deck before using Jelly!");
    closeCard();
    return;
  }
  if(modelNames.length <= 0){
    alert("You don't have any Anki models! Make a model before using Jelly!");
    closeCard();
    return;
  }
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
    document.getElementById("jellyNewCardConfig").innerHTML = (`
      <div id=\"jellyNewAnkiCardDeckBox\">
        <label for=\"jellyNewAnkiCardDeck\" class=\"jellyNewAnkiCardConfigLabel\">
          Deck:
        </label>
        <select id=\"jellyNewAnkiCardDeck\" class=\"jellyNewAnkiCardConfig jellyNewAnkiCardConfigSelect\">
        </select>
      </div>
      <div id=\"jellyNewAnkiDeckBox\">
        <button id="jellyNewAnkiDeck" class="jellyNewAnkiCardConfig">
          New Deck
        </button>
      </div>
      <div id=\"jellyNewAnkiCardModelBox\">
        <label for=\"jellyNewAnkiCardModel\" class=\"jellyNewAnkiCardConfigLabel\">
          Model:
        </label>
        <select id=\"jellyNewAnkiCardModel\" class=\"jellyNewAnkiCardConfig jellyNewAnkiCardConfigSelect\">
        </select>
      </div>`);
    var configLabels = document.getElementsByClassName("jellyNewAnkiCardConfigLabel");
    for (var i =0; i<configLabels.length; i++){
      configLabels[i].style.backgroundColor = "#ffffff";
      configLabels[i].style.margin = "5px";
    }

    var newDeckButton = document.getElementById("jellyNewAnkiDeck");
    newDeckButton.onclick = function(){
      newAnkiDeck(deckNames);
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
function displayFields(fields){
  var fieldString = "";
  for(var i = 0; i<fields.length; i++){
    fieldString += "<div id=\"jellyNewCardField" + fields[i] + "Box\" class=\"jellyNewCardFieldBox\">";
    fieldString += "<label for=\"jellyNewCardField" + fields[i] + "\" class=\"jellyNewCardLabel\">" + fields[i] + ":</label><br/>"
    fieldString += "<div id=\"jellyNewCardInputBox" + fields[i] + "\" class=\"jellyNewCardInputBox\">"
    fieldString += "<textarea rows=\"2\" cols=\"20\" id=\"jellyNewCardField" + fields[i] + "\" class=\"jellyNewCardField\"></textarea>"
    fieldString += "</div>"
    fieldString += "</div>"
  }
  fieldString += `<style>
    .jellyNewCardFieldBox{
      margin:5px;
    }
    .jellyNewCardInputBox{
      margin: 5px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .jellyNewCardField{
      width: 90%;
      margin: auto;
      display: block;
      resize: none;
    }
    .jellyNewCardLabel{
      background-color: #ffffff;
    }
  </style>`;
  var dependentDiv = document.getElementById("jellyNewCardDependent");
  if(dependentDiv === null){
    console.log("Couldn't find element of id `jellyNewCardDependent`");
    return;
  }
  dependentDiv.style.display = "block";
  dependentDiv.innerHTML = fieldString;
  var cardFields = document.getElementsByClassName("jellyNewCardField");
  if(cardFields.length > 0){
    chrome.storage.sync.get("highlightPref", function(response){
      var highlightIndex = response.highlightPref;
      if(highlightIndex === undefined)highlightIndex = 0;
      try{
        cardFields[highlightIndex].innerText = highlightedText;
      }catch(e){
        cardFields[0].innerText = highlightedText;
        notify("warning", "Highlight index" + highlightIndex + "out of range", 2000);
      }
    });
    chrome.storage.sync.get("focusPref", function(response){
      var focusIndex = response.focusPref;
      if(focusIndex === undefined)focusIndex = 1;
      try{
        cardFields[focusIndex].focus();
      }catch(e){
        cardFields[cardFields.length-1].focus();
        notify("warning", "Focus index " + focusIndex + " was out of range", 2000);
      }
    });
  }else{
    notify("error", "No new card fields?", 3000);
    closeCard();
  }
}

/**
 * Save the anki card to the database
 */
function saveAnkiCard(){
  var fields = document.getElementsByClassName("jellyNewCardField");
  if(fields.length <= 0){
    console.log("No Jelly fields found.");
    return;
  }
  var output = {};
  for(var i = 0; i<fields.length; i++){
    if(fields[i].value === ""){
      alert("You must fill out all fields!");
      return;
    }else{
      var fieldName = fields[i].getAttribute("id");
      output[fieldName.slice(newCardIdBufferLen)] = fields[i].value;
    }
  }
  var deck = document.getElementById("jellyNewAnkiCardDeck");
  var model = document.getElementById("jellyNewAnkiCardModel");
  if(deck === null){
    console.log("No deck info found at id `jellyNewAnkiCardDeck`.");
    return;
  }
  if(model === null){
    console.log("No model info found at id `jellyNewAnkiCardModel`.");
    return;
  }
  ankiRequest(ankiCardWrapUp, "addNote", {
    "note": {
      "deckName": deck.value,
      "modelName": model.value,
      "fields": output,
      "tags":[
        "jelly"
      ]
    }
  });
}

function ankiCardWrapUp(responseText){
  if(responseText !== null){
    notify("success", "Anki card saved!", 2000);
  }else{
    notify("error", "Save failed :(", 2000);
  }
  closeCard();
}

function newAnkiDeck(existingDecks){
  var newDeckName = prompt("Please enter the name of the new deck").trim();
  if(newDeckName !== null){
    if(!existingDecks.includes(newDeckName)){
      chrome.storage.sync.set({"ankiDeck": newDeckName}, function(response){
        ankiRequest(addNewDeckToActiveAnkiCard, "createDeck", {"deck": newDeckName});
      });
    }else{
      notify("warning", "Deck already exists", 3000);
    }
  }
}

function addNewDeckToActiveAnkiCard(response){
  notify("success", "Added new deck", 2000);
  fillInCard();
}

function displayQuizletConfig(setInfo){
  var sets = [];
  var setNames = [];
  var setIds = [];
  for(var i = 0; i < setInfo.length; i++){
    var title = setInfo[i].title;
    var id = setInfo[i].id;
    sets.push({id: title});
    setNames.push(title);
    setIds.push(id);
  }
  if(sets.length <= 0){
    alert("You don't have any Quizlet sets! Make a set before using Jelly!");
    closeCard();
    return;
  }
  chrome.storage.sync.get("quizletSetId", function(response){
    var currSetId;
    if(response.quizletSetId === undefined || !setIds.includes(response.quizletSetId)){
      currSetId = setIds[0];
    }else{
      currSetId = response.quizletSetId;
    }
    chrome.storage.sync.set({"quizletSetId": currSetId});
    document.getElementById("jellyNewCardConfig").innerHTML = (`
      <div id=\"jellyNewQuizletCardDeckBox\">
      <label for=\"jellyNewQuizletCardDeck\" class=\"jellyNewQuizletCardConfigLabel\">Set:
      </label>
      <select id=\"jellyNewQuizletCardSet\" class=\"jellyNewQuizletCardConfig jellyNewQuizletCardConfigSelect\">
      </select>
      </div>
      <div id="jellyNewQuizletSetBox">
        <button id="jellyNewQuizletSet" class="jellyNewQuizletCardConfig">New Set</button>
      </div>
    `);

    document.getElementById("jellyNewQuizletSet").onclick = newQuizletSet;

    var configLabel = document.getElementsByClassName("jellyNewQuizletCardConfigLabel")[0];
    configLabel.style.backgroundColor = "#ffffff";
    configLabel.style.margin = "5px";
    var setSelect = document.getElementById("jellyNewQuizletCardSet");
    setSelect.innerHTML = generateOptionsList(setNames, setIds);
    changeSelection("jellyNewQuizletCardSet", currSetId);
    setSelect.onchange = function(){
      chrome.storage.sync.set({"quizletSetId": document.getElementById("jellyNewQuizletCardSet").value}, function(){});
    };
    displayFields(["Term", "Definition"]);
  });
}

function saveQuizletCard(){
  var setId = document.getElementById("jellyNewQuizletCardSet").value.toString();
  var output = {};
  var cardFields = document.getElementsByClassName("jellyNewCardField");
  for(var i = 0; i<cardFields.length; i++){
    output[cardFields[i].getAttribute("id").slice(newCardIdBufferLen).toLowerCase()] = cardFields[i].value;
  }
  quizletRequest(quizletCardWrapUp, "POST", "/sets/" + setId + "/terms", output);
  setTimeout(function(){
    tryToDeleteQuizletSentinels(setId);
  }, 3000);
}

function quizletCardWrapUp(response){
  if(response.id !== undefined){
    notify("success", "Quizlet card saved!", 2000);
  }else{
    notify("error", "Save failed :(", 2000);
  }
  closeCard();
}

function newQuizletSet(){
  var newSetName = prompt("Please enter the name of the new set").trim();
  if(newSetName !== null){
    quizletRequest(
      addNewSetToActiveQuizletCard,
      "POST",
      "/sets",
      {
        "title": newSetName,
        "terms": ["jellySentinel!@#$%^&*()", "jellySentinel)(*&^%$#@!"],
        "definitions": ["jellySentinel!@#$%^&*()", "jellySentinel)(*&^%$#@!"],
        "lang_terms": "en",
        "lang_definitions": "en"
      }
    );
  }
}

function addNewSetToActiveQuizletCard(response){
  chrome.storage.sync.set({"quizletSetId": response.set_id}, function(response){
    notify("success", "Added new set", 2000);
    fillInCard();
  });
}

function tryToDeleteQuizletSentinels(setId){
  quizletRequest(deleteQuizletSentinels, "GET", "/sets/" + setId);
}

function deleteQuizletSentinels(response){
  var setId = response.id.toString();
  var terms = response.terms;
  for(var i = 0; i<terms.length; i++){
    if(terms[i].term === "jellySentinel!@#$%^&*()" || terms[i].term === "jellySentinel)(*&^%$#@!"){
      deleteQuizletTerm(setId, terms[i].id);
      break;
    }
  }
}

function deleteQuizletTerm(setId, termId){
  quizletRequest(notifyDeletion, "DELETE", "/sets/" + setId + "/terms/" + termId);
}

function notifyDeletion(response){
  notify("success", "Sentinel deleted", 1000);
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
document.onmouseup = async function(){
  var x = event.pageX;
  var y = event.pageY;
  highlightPos = [x, y];

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
    highlightedText = window.getSelection().toString().trim();
    if(highlightedText != ""){
      await sleep(1);
      highlightedText = window.getSelection().toString().trim();
      if(highlightedText != ""){
        if(!cardExists){
          chrome.storage.sync.get("activationKey", function(response){
            if(response.activationKey.key === "off"){
              makeIcon(x, y);
            }
          });
        }else{
          chrome.storage.sync.get("highlightAnswer", function(highlightStatus){
            if(highlightStatus.highlightAnswer){
              chrome.storage.sync.get("ankiFocusPref", function(response){
                var focusIndex = response.ankiFocusPref;
                if(focusIndex === undefined)focusIndex = 1;
                try{
                  document.getElementsByClassName("jellyNewCardField")[focusIndex].innerText = highlightedText;
                }catch(e){
                  notify("warning", "Focus index " + focusIndex + " was out of range", 2000);
                }
              });
            }else{
              closeCard();
              chrome.storage.sync.get("activationKey", function(response){
                if(response.activationKey.key === "off"){
                  makeIcon(x, y);
                }
              });
            }
          });
        }
      }else{
        closeCard();
      }
    }else{
      closeCard();
    }
  }


}

/**
 * Create icon at (absolute) position x, y
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
 * Create an icon at the last highlighted position if text is highlighted and
 * the activation key is pressed.
 */
function activateIcon(){
  if(highlightedText !== ""){
    makeIcon(highlightPos[0], highlightPos[1]);
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

function quizletRequest(callback, method, endpoint, params={}){
  chrome.storage.sync.get("quizletAccessToken", function(response){
    if(response.quizletAccessToken !== undefined){
      chrome.runtime.sendMessage({
        "purpose": "quizletRequest",
        "callback": callback.name,
        "access_token": response.quizletAccessToken,
        "method": method,
        "endpoint": endpoint,
        "params": params
      });
    }else{
      alert("You haven't set up Quizlet!");
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.type === "ankiResponse"){
    if(request.error !== null){
      console.log(request.error);
      notify("error", request.error.charAt(0).toUpperCase() + request.error.slice(1), 5000);
      closeCard();
    }else{
      window[request.callback](request.result);
    }
  }else if(request.type === "quizletResponse"){
    window[request.callback](request.response);
  }
});

/**
 *  Create a string of options where each value and text element are the elements
 *  of inputArr
 */
function generateOptionsList(inputArr, values=[]){
  var str = "";
  if(values.length === 0 || values.length !== inputArr.length){
    for(var i in inputArr){
      str += "<option value=\"" + inputArr[i] + "\">" + inputArr[i] + "</option>"
    }
  }else{
    for(var i = 0; i<inputArr.length; i++){
      str += "<option value=\"" + values[i] + "\">" + inputArr[i] + "</option>"
    }
  }
  return str;
}

/**
 *  Save the user's last used deck and/or model
 */
function saveAnkiCardConfig(){
  var deck = document.getElementById("jellyNewAnkiCardDeck");
  var model = document.getElementById("jellyNewAnkiCardModel");
  var error = false;
  if(deck === null){
    console.log("No Anki deck info with id `jellyNewAnkiCardDeck` to save");
    error = true;
  }
  if(model === null){
    console.log("No Anki model info with id `jellyNewAnkiCardModel` to save");
    error = true;
  }
  if(error)return;
  chrome.storage.sync.set({"ankiDeck": deck.value, "ankiModel": model.value});
}

/**
 *  Save the model preference and update the displayed fields based on the model
 */
function ankiModelUpdate(){
  saveAnkiCardConfig();
  ankiRequest(displayFields, "modelFieldNames", {"modelName": document.getElementById("jellyNewAnkiCardModel").value})
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

/**
 * Create a notification banner in the top right of the screen that automatically
 * disappears after `timeout` milliseconds
 */
function notify(type, message, timeout){
  var notificationContainer = document.createElement("div");
  notificationContainer.classList.add("jellyNotificationContainer");
  notificationContainer.style.top = "10px";
  notificationContainer.style.right = "10px";
  notificationContainer.style.position = "fixed";
  var color;
  switch(type){
    case "success":
      color = "#66ff66";
      break;
    case "warning":
      color = "#ffff66";
      break;
    case "error":
      color = "#ff6666";
      break;
    default:
  }
  notificationContainer.style.backgroundColor = color;
  notificationContainer.style.zIndex = 1000000;
  document.getElementsByTagName("body")[0].appendChild(notificationContainer);
  var notificationString = `<div class="jellyNotification">
    <p class="jellyNotificationText">`;
  notificationString += message;
  notificationString += `</p>
    </div>

    <style>
      .jellyNotification{
        width:300px;
        height:50px;
        border: 4px solid rgba(32, 32, 32, 0.5);
        display: flex;
        flex-flow: row, wrap;
        overflow: hidden;
        flex-wrap:no-wrap;
      }
      .jellyNotificationContainer:hover{
        opacity: 0.2;
      }
      .jellyNotificationText{
        margin-top:auto;
        margin-bottom:auto;
        margin-left:3px;
        padding:5px;
        font-size: 0.75em;
        whitespace: nowrap;
      }
    </style>`;
  notificationContainer.innerHTML = notificationString;
  setTimeout(function(){destroyNotification(notificationContainer);}, timeout);
}

function destroyNotification(notification){
  notification.parentNode.removeChild(notification);
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
