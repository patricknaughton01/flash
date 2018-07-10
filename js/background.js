var settings;

loadSettings();
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

/**
 * Respond with requested settings
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.purpose == "settings"){
    sendSettings(request.key);
  }
});

function saveSettings(){
  chrome.storage.sync.set(settings, function(){

  });
}

function loadSettings(){
  chrome.storage.sync.get(null, function(data){
    settings = data;
  });
}

function sendSettings(key){
  chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
    var activeTab = tabs[0];
    if (key == null){
      chrome.tabs.sendMessage(activeTab.id, settings);
    }else{
      chrome.tabs.sendMessage(activeTab.id, settings.key);
    }
  })
}
