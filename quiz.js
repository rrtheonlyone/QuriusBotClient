function fetchQuestions(html, url, callback) {
  chrome.storage.local
    .get(['questions', 'questionsCachedAt', 'questionsURL'],
      (questionsObj) => {
        if (
          questionsObj.questionsURL == url &&
          questionsObj.questions != undefined &&
          questionsObj.questionsCachedAt != undefined &&
          questionsObj.questionsCachedAt > Date.now() - 3600*1000
        ) {
          callback(questionsObj.questions)
        } else {
          var settings = {
              "async": true,
              "crossDomain": true,
              "url": API_BASE_URL + '/quiz',
              "method": "POST",
              "data": {'data': html}
          }
          $.ajax(settings).then(response => {
            chrome.storage.local.set({
              questionsURL: url,
              questions: response,
              questionsCachedAt: Date.now(),
            })
            console.log(response);
            callback(response);
          });
        }
      }
    )
}

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
    code: "[document.documentElement.innerHTML, document.location.href];"
  },

  function(results){
    $(".front").html(`<div style="display:flex; justify-content:center;"><div class="loader"/></div>`);
    fetchQuestions(results[0][0], results[0][1], (data) => {
      questions = data["data"];
      // console.log(data);
      // console.log(questions);
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
