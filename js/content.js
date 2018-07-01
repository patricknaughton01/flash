
/**
 * Add a card to the DOM at the icon location to create a card
 */
async function addCard(termText, x, y, xSize, ySize){
  window.getSelection().removeAllRanges();
  var container = document.createElement("div");
  var styles = document.createElement("div");
  container.id = "jellyNewTextCardContainer";
  styles.id = "jellyNewTextCardStyle";
  container.style.position = "absolute";
  xOffset = xSize + 5;
  yOffset = ySize/2 - 100;
  x += xOffset;
  y += yOffset;
  container.style.left = x.toString() + "px";
  container.style.top = y.toString() + "px";
  document.getElementsByTagName("body")[0].appendChild(container);
  document.getElementsByTagName("body")[0].appendChild(styles);
  $("#jellyNewTextCardContainer").load(
    chrome.extension.getURL('html/text-card-template.html')
  );
  $("#jellyNewTextCardStyle").load(
    chrome.extension.getURL('css/text-card-template.css')
  );
 }

/**
 * Create image popup when user highlights text
 */
document.onmouseup = async function(){
  if(window.getSelection().toString() != ""){
    var x = event.pageX;
    var y = event.pageY;
    var xOffset = -9;
    var yOffset = 10;
    var xSize = 18;
    var ySize = 18
    x += xOffset;
    y += yOffset;
    await sleep(1);
    var text = window.getSelection().toString();
    if(text != ""){
      var icon = document.createElement("div");
      icon.classList.add("jellyIcon");
      icon.onclick = function(){addCard(text, x, y, xSize, ySize);};
      icon.style.position = "absolute";
      icon.style.width = xSize.toString() + "px";
      icon.style.height = ySize.toString() + "px";
      icon.style.left = x.toString() + "px";
      icon.style.top = y.toString() + "px";
      icon.innerHTML = "<img src='" + chrome.extension.getURL('img/icon.png') + "' />";
      document.getElementsByTagName("body")[0].appendChild(icon);
    }
  }
}

/**
 * Delete existing image popups if the user doesn't highlight anything
 */
function clearIcons(){
  try{
    var icons = document.getElementsByClassName("jellyIcon");
    for(var i = 0; i < icons.length; i++){
      icons[i].parentNode.removeChild(icons[i]);
    }
  }catch(exception){}
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
