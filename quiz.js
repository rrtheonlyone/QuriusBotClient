var API_BASE_URL = "http://localhost:5000"
var questions = [];
var id = 0;
var new_id = 5;

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
  if(new_id <= id) {
    document.getElementById("question").innerHTML = "No more questions left";
    document.getElementById("answer").innerHTML = "No answer";
  }
  question_data = JSON.parse(questions[id]);
  question = question_data.question.replace(/(\\n)+/g, '');
  question = question.replace(/(\\")+/g, '');
  document.getElementById("question").innerHTML = question;
  document.getElementById("answer").innerHTML = question_data.answer;
  id = (id + 5) & questions.length;
  new_id = (new_id + 5) % questions.length;
}

document.addEventListener('DOMContentLoaded', function() {
	$('#nextButton').on('click', function(event) {
	  display_question()
	});
});