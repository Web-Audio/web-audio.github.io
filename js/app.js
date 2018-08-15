/**
* MIT License
*
* Copyright (c) 2018 Caterina Paun
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

// Start with init() function on page load
window.addEventListener('load', init, false);
// console.log(stopwords);

let arr = [];
let textstring = "";

// Check for browser compatiblity with Web Audio API & microphone access
function init() {
  let testSpeech;

  try {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    testSpeech = new SpeechRecognition();
    console.log(testSpeech);
  }
  catch(e) {
    alert('Web Speech API is not supported in this browser');
  }

  testSpeech.onerror = function(event) {
    if (event.error == "no-speech") {
      alert("Error: No speech available.");
    }
    if (event.error == "audio-capture") {
      alert("Error: No microphone available for audio capture.");
    }
  };

}

function startSpeech() {

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  // Set the language the English (US); this can be set to seveal other languages and dialets
  recognition.lang = 'en-US';

  let p = document.createElement('p');
  const paper = document.querySelector('.paper');
  paper.appendChild(p);

  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');

      console.log(e.results);


      const replaceScript = transcript.replace(/dog/gi, '🐕')
                            .replace(/emoji|emojis/gi, '😁');
      p.textContent = replaceScript;

      if (e.results[0].isFinal) {
        p = document.createElement('p');
        paper.appendChild(p);
        textstring += transcript + " ";
        console.log(textstring);
      }

      var stopWords = /(?:^|\s+)(?:the|and|a|or|in|on)(?=\s+|$)/gi;
      arr = textstring.replace(stopWords, "").trim();

      // console.log("teststring", arr);

      arr = textstring.split(" ");
      printResults();
  });


  recognition.addEventListener('end', recognition.start);

  recognition.start();

  recognition.onspeechend = function() {
    recognition.stop();
    console.log('Speech recognition has stopped.');
  }
}

// Print the word counts for each word
function printResults() {
  var counts = {}, i, value;

  for (i = 0; i < arr.length-1; i++) {
      value = arr[i];
      if (typeof counts[value] === "undefined") {
          counts[value] = 1;
      } else {
          counts[value]++;
      }
  }

  document.getElementById("analyticsCount").innerHTML = "";

  // console.log(Object.entries(counts));
  for(var i in counts){
    var output = i.toUpperCase() + ' occured ' + counts[i] + ' times';
    if (counts[i] > 2) {
      console.log(output);
      document.getElementById("analyticsCount").innerHTML += output + "<br/>";
    }
  }
}

function highlightWords(val) {
  console.log(val);
}

function clearSpeech() {
  var node = document.getElementById("paper");
  node.innerHTML = "";
}

function analyzeSpeech() {
  document.getElementById('analyticsDiv').style.display = "block";
  printResults();
}
