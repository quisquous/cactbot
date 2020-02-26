'use strict';

class BrowserTTSEngine {
  static play(text) {
    try {
      // check to see if we've already gotten this tts before
      let iframe = window.document.querySelector("[data-tts=\""+text+"\"]");
      if (iframe === null) {
        iframe = document.createElement("iframe");
        // remove sandbox so we can modify contents/call play on audio element later
        iframe.removeAttribute('sandbox');
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        let encText = encodeURIComponent(text);
        iframe.contentDocument.body.innerHTML = "<audio src=\"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=" + encText + "\" id=\"TTS\">";
        iframe.dataset["tts"] = text;
      }
      iframe.contentDocument.body.firstElementChild.play();
    } catch(e) {
        console.log("Exception performing TTS", e);
    }
  }
}