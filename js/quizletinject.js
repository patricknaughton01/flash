// If we are on quizlet's auth page
if(/quizlet\.com\/authorize/.test(window.location.href)){
  //Check and make sure the state is valid, protects from CSRF attacks
  if(window.location.href.toString().match(/state=(.+?)(\&|$)/)[1] === "pQDVvFncGKMIQjNlYEx"){
    var code = window.location.href.toString().match(/code=(.+?)(\&|$)/);
    try{
      code = code[1];
      if(code !== ""){
        chrome.runtime.sendMessage({
          "purpose": "quizletGetAccessToken",
          "key": code
        });
      }
    }catch(e){}
  }
}
