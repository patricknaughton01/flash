var settings;

loadSettings();

/**
 * Respond with requested settings
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.purpose == "settings"){
    sendSettings(request.key);
  }else if(request.purpose === "ankiRequest"){
    ankiRequest(request.callback, request.address, request.action, request.version, request.params);
  }
});

/**
 *  Make a request to the anki api
 */
function ankiRequest(callback, address, action, version, params={}){
  var xhr = new XMLHttpRequest();
  xhr.open('POST',"http://" + address.toString() + ":8765");
  xhr.onreadystatechange = function(){
    if(this.readyState !== 4)return;
    if(this.status !== 200)return;
    var response = JSON.parse(this.responseText);
    response.callback = callback;
    sendAnkiResponse(response);
  }
  xhr.addEventListener("error", function(error){
    console.log(error);
    alert("Couldn't connect to Anki. Is your address correct? Is Anki running? Do you have AnkiConnect installed?");
  });
  xhr.send(JSON.stringify({action, "version":version, params}));
}

function sendAnkiResponse(response){
  chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {
      "type": "ankiResponse",
      "callback": response.callback,
      "result": response.result,
      "error": response.error
    });
  });
}

function saveSettings(){
  chrome.storage.sync.set(settings, function(){

  });
}

function loadSettings(){
  chrome.storage.sync.get(null, function(data){
      settings = data;
      if(settings == null){
        chrome.tabs.create({'url': "/html/options.html"});
        settings = {
          "activationKey": "off",
          "highlightAnswer": true,
          "pictureTerms": "off",
          "audioTerms": "off"
        };
        saveSettings();
      }
  });
}

function sendSettings(key){
  chrome.storage.sync.get(null, function(result){
    settings = result;
  });
  chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
    var activeTab = tabs[0];
    if (key == null){
      chrome.tabs.sendMessage(activeTab.id, settings);
    }else{
      chrome.tabs.sendMessage(activeTab.id, settings.key);
    }
  })
}
