var API_BASE_URL = "http://localhost:5000"

function getDataForQuiz(html) {
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": API_BASE_URL + '/quiz',
      "method": "POST",
      "data": {'data': html}
  }
  return $.ajax(settings);
}

chrome.tabs.executeScript( 
  null, {
    code: "document.documentElement.innerHTML;"
  },
  
  function(results){ 
    getDataForQuiz(results[0]).then((data) => {
      console.log(data);
    });
  } 
);