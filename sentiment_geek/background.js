

//once chrome extension is activated, pull in some body of text from current page --> async and after DOM content has loaded
//queue up sentiment API and push body of text into it

// function hideView(){
//   activated = false;
//   document.querySelector('header').style = "display: none";

// }

function analyzePage(){
 
  

  function insertPuppy() {
    const newPuppy = document.createElement("img");
    newPuppy.style = "position: absolute; top:0; left: auto; right: auto; bottom: 0; z-index: 100;"
    newPuppy.src = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg";
    document.querySelector('body').prepend(newPuppy);
   console.log(newPuppy);
  }
  
  function insertAffirmations() {
    const header = document.querySelector("h1");
    console.log(header);
   header.innerText = "You are successful. You are important."
   
  }

  function modifyHeader(pos, score, ratio, kws){
    const header = document.createElement("header");
   
    document.querySelector('body').prepend(header);
    console.log(pos, score, ratio, kws);
    let keywordHTML = '';
    for(let i = 0; i < kws.length; i++){
      keywordHTML += `<div><p style="18px;"> Keyword: ${kws[i].word} , ${kws[i].score.toFixed(2)} </p> </div> <br>`;
    }
    header.innerHTML = `<div style="height: 200px; font-size: 75px;"<h2> Sentiment Geek Analysis: </h2> </div> <br>`;
    header.innerHTML += `<div style="font-size: 50px;"><h3> Sentiment Score: ${pos}</h3> </div> <br>`;
    header.innerHTML += `<div style="font-size: 40px;"><h3> Overall Score: ${score.toFixed(2)}</h3> </div> <br>`;
    header.innerHTML += `<div style="font-size: 40px;"><h3> Overall Ratio: ${ratio.toFixed(2)}</h3> </div> <br>`;
    header.innerHTML += keywordHTML;
    header.innerHTML += `<div><p><strong>Sentiment Score:</strong> -0.05 negative < neutral < 0.05 positive</p></div>`;
    header.innerHTML += `<div><p><strong>Ratio Definition:</strong> Combined total score of negative keywords compared to positive, ranging from -1 to 1</p></div><br><br><br><br>`;
    //const header = document.querySelector("header");
    const url = document.URL;
    
    header.style = `display: block; position: absolute; z-index: 100; height: fit-content; width: 100%; text-align: center; padding-top: 100px; color: white; overflow: hidden; background: #C04848;  /* fallback for old browsers */ background: linear-gradient(rgb(72,0,72,0.8), rgb(192,72,72,0.8)), url(${url});  /* Chrome 10-25, Safari 5.1-6 */background: linear-gradient(rgb(72,0,72,0.8), rgb(192,72,72,0.8)), url(${url}); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */background-size: cover;background-repeat: no-repeat;`
    console.log(pos);
    if(pos === 'positive'){
      header.innerHTML+=`<img src="https://media.tenor.com/qQ9K5ChqXScAAAAi/happy-rainbow.gif" style="filter: none; height: 300px; position: fixed; top: 0; left: 0">`
      header.innerHTML+=`<img src="https://media.tenor.com/qQ9K5ChqXScAAAAi/happy-rainbow.gif" style="filter: none; height: 300px; position: fixed; top: 0; right: 0;">`
    } if(pos === 'negative'){
      header.innerHTML+=`<img src="https://media.tenor.com/hylEE2LtVtcAAAAC/sad.gif" style="filter: none; height: 300px; position: fixed; top: 0; left: 0">`
      header.innerHTML+=`<img src="https://media.tenor.com/hylEE2LtVtcAAAAC/sad.gif" style="filter: none; height: 300px; position: fixed; top: 0; right: 0;">`
    }
    if(pos === 'neutral'){
      header.innerHTML+=`<img src="https://media.tenor.com/Yblv9qQOI3MAAAAC/shrug-shoulder-oh.gif" style="filter: none; height: 300px; position: fixed; top: 0; left: 0">`
      header.innerHTML+=`<img src="https://media.tenor.com/Yblv9qQOI3MAAAAC/shrug-shoulder-oh.gif" style="filter: none; height: 300px; position: fixed; top: 0; right: 0;">`
    }
    
}
  function queueHappyMusic(){
    var myAudio = new Audio();
    myAudio.src = "happy_piano_music.mp3";
    myAudio.type = "audio/mpeg";
    myAudio.play();
    console.log('making sure this is passing through')
  }
  // pull in everything with html tag p (as our string)
  let testText = document.getElementsByTagName('p');
  // let testText = document.getElementsByTagName("p")[0].innerHTML;
  // triggered when someone clicks button
  console.log(testText);
  // create string to analyze based on first 5 p tags
  // loop to grab first 5 p tags from testText array, and grab innerText
  let paragraphToAnalyze = '';
  for(let i = 0; i < 5; i++){
    if(testText[i]){
      paragraphToAnalyze += " " + testText[i].innerText;
    }
    
  }
  console.log(paragraphToAnalyze);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b054279159msh00dd392c0e8d37bp146235jsn7fbbc1c7cb74',
      'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com'
    }
  };
  
  fetch(`https://twinword-sentiment-analysis.p.rapidapi.com/analyze/?text=${paragraphToAnalyze}`, options)
  .then(response => response.json())
  .then(response => {
    console.log('this is the response', response);
    return testingNonAsync(response);
  });
  

  
  function testingNonAsync(result){
    let sentiment = result.type;
    modifyHeader(sentiment, result.score, result.ratio, result.keywords);
    queueHappyMusic();
    console.log('is this still working?')
  }



  //Invocations of the above
//this is for queueing music 
//queueHappyMusic();
//modifyHeader();
//insertPuppy();
//insertAffirmations();
//insertBreathe()

}



chrome.action.onClicked.addListener((tab) => {
  if(!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: analyzePage
    });
  }
  
});

// chrome.action.onClicked.addListener((tab) => {
//   if(!tab.url.includes("chrome://")) {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: reddenPage
//     });
//   }
// });