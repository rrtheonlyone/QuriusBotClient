var checkPageButton = document.getElementById('checkPage');
var API_URL = "localhost:5000"

chrome.tabs.executeScript( 
  null, {
    code: "document.documentElement.innerHTML;"
  },
  
  function(results){ 
    console.log(results);

    

  } 
);


