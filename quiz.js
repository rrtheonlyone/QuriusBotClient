var API_BASE_URL = "http://localhost:5000"
var questions = [];
var id = 0;
var next_id = 5;

$(document).on('ready', function() {
  $(".flip").flip();
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
    $(".front").html(`<div style="display:flex; justify-content:center;"><div class="loader"/></div>`);
    getDataForQuiz(results[0]).then((data) => {
      console.log(data);
      questions = data["data"];
      display_question();
    });
  } 
);

function display_question() {
  if(next_id <= id || questions.length == 0) {
    document.getElementsByClassName("front")[0].innerHTML = "No more questions left";
    document.getElementsByClassName("back")[0].innerHTML = "No answer";
  } else {
    question_data = JSON.parse(questions[id]);
    question = question_data.question.replace(/(\\n)+/g, '');
    question = question.replace(/(\\")+/g, '');
    document.getElementsByClassName("front")[0].innerHTML = question;
    document.getElementsByClassName("back")[0].innerHTML = question_data.answer;
    id = (id + 5) % questions.length;
    next_id = (next_id + 5) % questions.length;
  }
}

document.addEventListener('DOMContentLoaded', function() {
	$('#nextButton').on('click', function(event) {
	  display_question();
	});
});
