document.onmouseup = async function(){
  if(window.getSelection().toString() != ""){
    console.log(window.getSelection().toString());
    var x = event.pageX;
    var y = event.pageY;
    x -= 9;
    y += 10;
    await sleep(1);
    if(window.getSelection().toString() != ""){
      var icon = document.createElement("div");
      icon.classList.add("jellyIcon");
      icon.style.position = "absolute";
      icon.style.width = "18px";
      icon.style.height = "18px";
      icon.style.left = x.toString() + "px";
      icon.style.top = y.toString() + "px";
      icon.innerHTML = "<img src='" + chrome.extension.getURL('img/icon.png') + "' />";
      document.getElementsByTagName("body")[0].appendChild(icon);
    }
  }
}

document.onmousedown = function(){
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
