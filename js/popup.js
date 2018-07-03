$(function(){
  $options = `
        <option value=off>Off</$option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="E">E</option>
        <option value="F">F</option>
        <option value="G">G</option>
        <option value="H">H</option>
        <option value="I">I</option>
        <option value="J">J</option>
        <option value="K">K</option>
        <option value="L">L</option>
        <option value="M">M</option>
        <option value="N">N</option>
        <option value="O">O</option>
        <option value="P">P</option>
        <option value="Q">Q</option>
        <option value="R">R</option>
        <option value="S">S</option>
        <option value="T">T</option>
        <option value="U">U</option>
        <option value="V">V</option>
        <option value="W">W</option>
        <option value="X">X</option>
        <option value="Y">Y</option>
        <option value="Z">Z</option>`;
  $(".jellySelectLetter").html($options);
  $(".jellySetting").on("change", function(event){
    savePopupSettings();
  });
  chrome.storage.sync.get(null, function(result){
    changeSelection("jellyActivationKey", result.activationKey);
    document.getElementById("jellyHighlightAnswer").checked = result.highlightAnswer;
    changeSelection("jellyPictureKey", result.pictureTerms);
    changeSelection("jellyAudioKey", result.audioTerms);
    changeSelection("jellyCardProgram", result.flashCardProgram);
  });
});

/**
 * Save all settings
 */
function savePopupSettings(){
  chrome.storage.sync.set({"activationKey": $("#jellyActivationKey").val()}, function(){});
  chrome.storage.sync.set({"highlightAnswer": $("#jellyHighlightAnswer").is(":checked")}, function(){});
  chrome.storage.sync.set({"pictureTerms": $("#jellyPictureKey").val()}, function(){});
  chrome.storage.sync.set({"audioTerms": $("#jellyAudioKey").val()}, function(){});
  chrome.storage.sync.set({"flashCardProgram": $("#jellyCardProgram").val()}, function(){});
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
