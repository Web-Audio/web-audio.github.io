// Start with init() function on page load
window.addEventListener('load', init, false);

// Check for browser compatiblity with Web Audio API
function init() {
  try {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let context = new SpeechRecognition();
    console.log(context);
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let arr = [];
let textstring = "";

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'en-US';


let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

    const replaceScript = transcript.replace(/hello/gi, 'HELLO')
                          .replace(/like/gi, 'LIKE')
                          .replace(/dog/gi, '🐕')
                          .replace(/aced/gi, '💯')
                          .replace(/emoji|emojis/gi, '😁')
                          .replace(/testing/gi, 'TESTING');
    p.textContent = replaceScript;

    if (e.results[0].isFinal) {
      p = document.createElement('p');
      words.appendChild(p);
      textstring += transcript + " ";
      console.log(textstring);
    }

    var stopWords = /(?:^|\s+)(?:the|and|a|or|in|on)(?=\s+|$)/gi;
    arr = textstring.replace(stopWords, "").trim();

    console.log("===============????");
    console.log("teststring", arr);

    arr = textstring.split(" ");
    printResults();
});

recognition.addEventListener('end', recognition.start);

recognition.start();

recognition.onspeechend = function() {
  recognition.stop();
  console.log('Speech recognition has stopped.');
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

function analyzeSpeech() {
  document.getElementById('analyticsDiv').style.display = "block";
  printResults();
}
