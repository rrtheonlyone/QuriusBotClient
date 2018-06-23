var checkPageButton = document.getElementById('checkPage');
var API_BASE_URL = "http://localhost:5000"

function getDataForSummary(html) {
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": API_BASE_URL + '/summary',
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
    getDataForSummary(results[0]).then((data) => {
      console.log(data);
      document.getElementById("summary_content").append(data["summary"]); 
    });
  } 
);


