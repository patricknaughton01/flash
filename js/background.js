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
  }else if(request.purpose === "quizletAuth"){
    quizletAuth(request.url);
  }else if(request.purpose === "quizletGetAccessToken"){
    quizletGetAccessToken(request.key);
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

function quizletAuth(url){
  chrome.tabs.create({"url": url});
}

function quizletGetAccessToken(key){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.quizlet.com/oauth/token/");
  xhr.onreadystatechange = function(){
    if(this.readyState!==4)return;
    if(this.status!==200){
      alert(JSON.parse(this.responseText).error_description);
      alert(":( Something went wrong when setting your access token. \
        See if you can reproduce this error and contact Patrick Naughton if so at patricknaughton01@gmail.com");
      return;
    }
    chrome.storage.sync.set({"quizletAccessToken": JSON.parse(this.responseText).access_token}, function(){
      alert("Your access token was successfully set! (even if the background says 'Cannot continue')");
    });
  }
  xhr.setRequestHeader('Authorization', "Basic " + "SHQ0Tkgya3RYdjo2OVRIU0NNckMzeUdiVFNLeXZLeDhi");
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.send(JSON.stringify({
    "grant_type": "authorization_code",
    "code": key,
    "redirect_uri": "https://quizlet.com/authorize"
  }));
}

function saveSettings(){
  chrome.storage.sync.set(settings, function(){

  });
}

function loadSettings(){
  chrome.storage.sync.getBytesInUse(null, function(bytes){
    if(bytes === 0){
      chrome.tabs.create({'url': "/html/options.html"});
      settings = {
        "activationKey": {"key": "off"},
        "highlightAnswer": true,
        "pictureTerms": {"key": "off"},
        "audioTerms": {"key": "off"},
        "visibilityToggle": {"key": "v"}
      };
      saveSettings();
    }else{
      chrome.storage.sync.get(null, function(data){
        settings = data;
      });
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
