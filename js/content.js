document.onmouseup = function(){
  if(window.getSelection){
    console.log(window.getSelection().toString());
  }
}
