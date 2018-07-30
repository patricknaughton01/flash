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
  $langOpts = `
    <option value="af">Afrikaans</option>
    <option value="ak">Akan</option>
    <option value="sq">Albanian</option>
    <option value="am">Amharic</option>
    <option value="ar">Arabic</option>
    <option value="hy">Armenian</option>
    <option value="az">Azerbaijani</option>
    <option value="eu">Basque</option>
    <option value="be">Belarusian</option>
    <option value="bem">Bemba</option>
    <option value="bn">Bengali</option>
    <option value="bh">Bihari</option>
    <option value="xx-bork">Bork, bork, bork!</option>
    <option value="bs">Bosnian</option>
    <option value="br">Breton</option>
    <option value="bg">Bulgarian</option>
    <option value="km">Cambodian</option>
    <option value="ca">Catalan</option>
    <option value="chr">Cherokee</option>
    <option value="ny">Chichewa</option>
    <option value="zh-CN">Chinese (Simplified)</option>
    <option value="zh-TW">Chinese (Traditional)</option>
    <option value="co">Corsican</option>
    <option value="hr">Croatian</option>
    <option value="cs">Czech</option>
    <option value="da">Danish</option>
    <option value="nl">Dutch</option>
    <option value="xx-elmer">Elmer Fudd</option>
    <option value="en">English</option>
    <option value="eo">Esperanto</option>
    <option value="et">Estonian</option>
    <option value="ee">Ewe</option>
    <option value="fo">Faroese</option>
    <option value="tl">Filipino</option>
    <option value="fi">Finnish</option>
    <option value="fr">French</option>
    <option value="fy">Frisian</option>
    <option value="gaa">Ga</option>
    <option value="gl">Galician</option>
    <option value="ka">Georgian</option>
    <option value="de">German</option>
    <option value="el">Greek</option>
    <option value="gn">Guarani</option>
    <option value="gu">Gujarati</option>
    <option value="xx-hacker">Hacker</option>
    <option value="ht">Haitian Creole</option>
    <option value="ha">Hausa</option>
    <option value="haw">Hawaiian</option>
    <option value="iw">Hebrew</option>
    <option value="hi">Hindi</option>
    <option value="hu">Hungarian</option>
    <option value="is">Icelandic</option>
    <option value="ig">Igbo</option>
    <option value="id">Indonesian</option>
    <option value="ia">Interlingua</option>
    <option value="ga">Irish</option>
    <option value="it">Italian</option>
    <option value="ja">Japanese</option>
    <option value="jw">Javanese</option>
    <option value="kn">Kannada</option>
    <option value="kk">Kazakh</option>
    <option value="rw">Kinyarwanda</option>
    <option value="rn">Kirundi</option>
    <option value="xx-klingon">Klingon</option>
    <option value="kg">Kongo</option>
    <option value="ko">Korean</option>
    <option value="kri">Krio (Sierra Leone)</option>
    <option value="ku">Kurdish</option>
    <option value="ckb">Kurdish (Soranî)</option>
    <option value="ky">Kyrgyz</option>
    <option value="lo">Laothian</option>
    <option value="la">Latin</option>
    <option value="lv">Latvian</option>
    <option value="ln">Lingala</option>
    <option value="lt">Lithuanian</option>
    <option value="loz">Lozi</option>
    <option value="lg">Luganda</option>
    <option value="ach">Luo</option>
    <option value="mk">Macedonian</option>
    <option value="mg">Malagasy</option>
    <option value="ms">Malay</option>
    <option value="ml">Malayalam</option>
    <option value="mt">Maltese</option>
    <option value="mi">Maori</option>
    <option value="mr">Marathi</option>
    <option value="mfe">Mauritian Creole</option>
    <option value="mo">Moldavian</option>
    <option value="mn">Mongolian</option>
    <option value="sr-ME">Montenegrin</option>
    <option value="ne">Nepali</option>
    <option value="pcm">Nigerian Pidgin</option>
    <option value="nso">Northern Sotho</option>
    <option value="no">Norwegian</option>
    <option value="nn">Norwegian (Nynorsk)</option>
    <option value="oc">Occitan</option>
    <option value="or">Oriya</option>
    <option value="om">Oromo</option>
    <option value="ps">Pashto</option>
    <option value="fa">Persian</option>
    <option value="xx-pirate">Pirate</option>
    <option value="pl">Polish</option>
    <option value="pt-BR">Portuguese (Brazil)</option>
    <option value="pt-PT">Portuguese (Portugal)</option>
    <option value="pa">Punjabi</option>
    <option value="qu">Quechua</option>
    <option value="ro">Romanian</option>
    <option value="rm">Romansh</option>
    <option value="nyn">Runyakitara</option>
    <option value="ru">Russian</option>
    <option value="gd">Scots Gaelic</option>
    <option value="sr">Serbian</option>
    <option value="sh">Serbo-Croatian</option>
    <option value="st">Sesotho</option>
    <option value="tn">Setswana</option>
    <option value="crs">Seychellois Creole</option>
    <option value="sn">Shona</option>
    <option value="sd">Sindhi</option>
    <option value="si">Sinhalese</option>
    <option value="sk">Slovak</option>
    <option value="sl">Slovenian</option>
    <option value="so">Somali</option>
    <option value="es">Spanish</option>
    <option value="es-419">Spanish (Latin American)</option>
    <option value="su">Sundanese</option>
    <option value="sw">Swahili</option>
    <option value="sv">Swedish</option>
    <option value="tg">Tajik</option>
    <option value="ta">Tamil</option>
    <option value="tt">Tatar</option>
    <option value="te">Telugu</option>
    <option value="th">Thai</option>
    <option value="ti">Tigrinya</option>
    <option value="to">Tonga</option>
    <option value="lua">Tshiluba</option>
    <option value="tum">Tumbuka</option>
    <option value="tr">Turkish</option>
    <option value="tk">Turkmen</option>
    <option value="tw">Twi</option>
    <option value="ug">Uighur</option>
    <option value="uk">Ukrainian</option>
    <option value="ur">Urdu</option>
    <option value="uz">Uzbek</option>
    <option value="vi">Vietnamese</option>
    <option value="cy">Welsh</option>
    <option value="wo">Wolof</option>
    <option value="xh">Xhosa</option>
    <option value="yi">Yiddish</option>
    <option value="yo">Yoruba</option>
    <option value="zu">Zulu</option>
  `;
  $(".jellySelectLang").html($langOpts);
  var autoOption = document.createElement("OPTION");
  autoOption.setAttribute("value", "auto");
  autoOption.appendChild(document.createTextNode("Auto"));
  var sourceLangElem = document.getElementById("jellySourceLang");
  sourceLangElem.insertBefore(autoOption, sourceLangElem.firstChild);
  $(".jellySetting").on("change", function(event){
    console.log("change");
    savePopupSettings();
  });
  $("#jellySettingsButton").on("click", function(){
    chrome.tabs.create({"url": "/html/options.html"});
  });
  chrome.storage.sync.get(null, function(result){
    changeSelection("jellyActivationKey", result.activationKey.key);
    document.getElementById("jellyHighlightAnswer").checked = result.highlightAnswer;
    document.getElementById("jellyAutoTranslate").checked = result.autoTranslate;
    changeSelection("jellyPictureKey", result.pictureTerms.key);
    changeSelection("jellyAudioKey", result.audioTerms.key);
    changeSelection("jellyVisibilityKey", result.visibilityToggle.key);
    changeSelection("jellySourceLang", result.sourceLang);
    changeSelection("jellyTargetLang", result.targetLang);
    document.getElementById("jellyHighlightIndex").value = result.highlightPref + 1;
    document.getElementById("jellyFocusIndex").value = result.focusPref + 1;
    changeSelection("jellyCardProgram", result.flashCardProgram);
  });
});

/**
 * Save all settings
 */
function savePopupSettings(){
  chrome.storage.sync.set({"activationKey": {"key": $("#jellyActivationKey").val()}}, function(){});
  chrome.storage.sync.set({"highlightAnswer": $("#jellyHighlightAnswer").is(":checked")}, function(){});
  chrome.storage.sync.set({"autoTranslate": $("#jellyAutoTranslate").is(":checked")}, function(){});
  chrome.storage.sync.set({"pictureTerms": {"key": $("#jellyPictureKey").val()}}, function(){});
  chrome.storage.sync.set({"audioTerms": {"key": $("#jellyAudioKey").val()}}, function(){});
  chrome.storage.sync.set({"visibilityToggle": {"key": $("#jellyVisibilityKey").val()}}, function(){});
  chrome.storage.sync.set({"sourceLang": $("#jellySourceLang").val()}, function(){});
  chrome.storage.sync.set({"targetLang": $("#jellyTargetLang").val()}, function(){});
  chrome.storage.sync.set({"highlightPref": $("#jellyHighlightIndex").val() - 1}, function(){});
  chrome.storage.sync.set({"focusPref": $("#jellyFocusIndex").val() - 1}, function(){});
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
