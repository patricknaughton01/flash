// Listen for message from background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.message === "clicked_browser_action"){
        // Get first url of the page
        var firstLink = document.getElementsByTagName("A")[0].href;
        console.log(firstLink);
        //Send it back to background.js
        chrome.runtime.sendMessage({"message":"new_tab", "url":firstLink});
    }
});
