//Called when user clicks on browser action.
chrome.browserAction.onClicked.addListener(function(tab){
    //Send message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
});

//Listen from content.js for url to open
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.message === "new_tab"){
            chrome.tabs.create({"url":request.url});
        }
    }
);
