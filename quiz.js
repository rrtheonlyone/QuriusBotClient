var API_BASE_URL = "http://localhost:5000"
var questions = [];
var id = 0;

$(document).on('ready', function() {
  $(".flip").flip({
    forceHeight: true
  });
});


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
      questions = data["data"];
      display_question();
    });
  } 
);

function display_question() {
  question_data = JSON.parse(questions[id]);
  question = question_data.question.replace(/(\\n)+/g, '');
  question = question.replace(/(\\")+/g, '');
  document.getElementsByClassName("front")[0].innerHTML = question;
  document.getElementsByClassName("back")[0].innerHTML = question_data.answer;
  id+=5;
}

document.addEventListener('DOMContentLoaded', function() {
	$('#nextButton').on('click', function(event) {
	  display_question()
	});
});