var checkPageButton = document.getElementById('checkPage');
var API_BASE_URL = "http://localhost:5000"

function getSummaryForArticle(html) {
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": API_BASE_URL + '/summary',
      "method": "POST",
      "data": {'data': html}
  }
  return $.ajax(settings);
}

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
    code: "document.documentElement.innerHTML;"
  },

  function(results){
    $("#summary_content").html(`<div style="display:flex; justify-content:center;"><div class="loader"/></div>`);
    getSummaryForArticle(results[0]).then((data) => {
      console.log(data);
      $("#summary_content").html(`<p>${data["summary"]}</p>`);
      $("#links").html(renderLinksTable(data["related_links"]))
    });
  }
);
