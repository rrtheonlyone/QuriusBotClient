var API_BASE_URL = "http://localhost:5000"
var questions = [];
var id = 0;

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
  console.log(id)
  question_data = JSON.parse(questions[id]);
  document.getElementById("question").innerHTML = question_data.question
  	.replace(/\".*\n|\n.*\"/g, "");
  document.getElementById("answer").innerHTML = question_data.answer;
  id++;
}

document.addEventListener('DOMContentLoaded', function() {
	$('#nextButton').on('click', function(event) {
	  display_question()
	});
});