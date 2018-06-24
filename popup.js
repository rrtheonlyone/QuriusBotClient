function fetchSummary(html, url, callback) {
  chrome.storage.local
    .get(['summaryPage', 'summaryPageCachedAt', 'summaryURL'],
      (summaryObj) => {
        if (
          summaryObj.summaryURL == url &&
          summaryObj.summaryPage != undefined &&
          summaryObj.summaryPageCachedAt != undefined &&
          summaryObj.summaryPageCachedAt > Date.now() - 3600*1000
        ) {
          callback(summaryObj.summaryPage)
        } else {
          var settings = {
            "async": true,
            "crossDomain": true,
            "url": API_BASE_URL + '/summary',
            "method": "POST",
            "data": {'data': html}
          }
          $.ajax(settings).then(response => {
            chrome.storage.local.set({
              summaryURL: url,
              summaryPage: response,
              summaryPageCachedAt: Date.now(),
            })
            callback(response);
          });
        }
      }
    )
}

var checkPageButton = document.getElementById('checkPage');
var API_BASE_URL = "http://localhost:5000"

function renderLinksTable(links) {
  let rows = "";
  for (let link of links) {
    rows += (
      `<tr>
        <td><a class="link" href=${link['url']}>${link['title']}</a></td>
      </tr>`
    )
  }
  return `<table>${rows}</table>`;
}

chrome.tabs.executeScript(
  null, {
    code: "[document.documentElement.innerHTML, document.location.href];"
  },

  function(results){
    $("#summary_content").html(`<div style="display:flex; justify-content:center;"><div class="loader"/></div>`);
    fetchSummary(results[0][0], results[0][1], (data) => {
      $("#summary_content").html(`<p>${data["summary"]}</p>`);
      $("#links").html(renderLinksTable(data["related_links"]))
    });
  }
);
