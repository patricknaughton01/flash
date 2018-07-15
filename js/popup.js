$(function(){
  $options = `
        <option value=off>Off</$option>
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
        <option value="d">D</option>
        <option value="e">E</option>
        <option value="f">F</option>
        <option value="g">G</option>
        <option value="h">H</option>
        <option value="i">I</option>
        <option value="j">J</option>
        <option value="k">K</option>
        <option value="l">L</option>
        <option value="m">M</option>
        <option value="n">N</option>
        <option value="o">O</option>
        <option value="p">P</option>
        <option value="q">Q</option>
        <option value="r">R</option>
        <option value="s">S</option>
        <option value="t">T</option>
        <option value="u">U</option>
        <option value="v">V</option>
        <option value="w">W</option>
        <option value="x">X</option>
        <option value="y">Y</option>
        <option value="z">Z</option>`;
  $(".jellySelectLetter").html($options);
  $(".jellySetting").on("change", function(event){
    savePopupSettings();
  });
  $("#jellySettingsButton").on("click", function(){
    chrome.tabs.create({"url": "/html/options.html"});
  });
  chrome.storage.sync.get(null, function(result){
    changeSelection("jellyActivationKey", result.activationKey.key);
    console.log(result.activationKey.key);
    document.getElementById("jellyHighlightAnswer").checked = result.highlightAnswer;
    changeSelection("jellyPictureKey", result.pictureTerms.key);
    changeSelection("jellyAudioKey", result.audioTerms.key);
    changeSelection("jellyVisibilityKey", result.visibilityToggle.key);
    changeSelection("jellyCardProgram", result.flashCardProgram);
  });
});

/**
 * Save all settings
 */
function savePopupSettings(){
  chrome.storage.sync.set({"activationKey": {"key": $("#jellyActivationKey").val()}}, function(){});
  chrome.storage.sync.set({"highlightAnswer": $("#jellyHighlightAnswer").is(":checked")}, function(){});
  chrome.storage.sync.set({"pictureTerms": {"key": $("#jellyPictureKey").val()}}, function(){});
  chrome.storage.sync.set({"audioTerms": {"key": $("#jellyAudioKey").val()}}, function(){});
  chrome.storage.sync.set({"visibilityToggle": {"key": $("#jellyVisibilityKey").val()}}, function(){});
  chrome.storage.sync.set({"flashCardProgram": $("#jellyCardProgram").val()}, function(){});
}

/**
 * Change the selected value of the element identified by id `idName` to
 * the value named by `targVal`
 */
 function changeSelection(idName, targVal){
   var selElem = document.getElementById(idName);
   console.log(selElem);
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
