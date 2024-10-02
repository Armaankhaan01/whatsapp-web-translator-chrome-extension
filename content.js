function test() {
  var list = document.getElementsByClassName("Tkt2p");
  for (var i = 0; i < list.length; i++) {
    let v = document.createElement("input");
    v.type = "button";
    v.value = "translate";
    v.className = "translate";
    v.id = i;
    v.addEventListener(
      "click",
      function () {
        getText(v.id);
      },
      false
    );
    if (list[i].getElementsByClassName("translate").length == 0) {
      list[i].appendChild(v);
    } else {
      var x = list[i].getElementsByClassName("translate")[0];
      x.id = i;
    }
  }
}
function getText(id) {
  var cl = document.getElementsByClassName("Tkt2p")[id];
  var data = cl.getElementsByClassName("_3zb-j ZhF0n")[0];
  getLan(data.textContent, id);
}
function getLan(text, id) {
  var http = new XMLHttpRequest();
  var url =
    "https://translation.googleapis.com/language/translate/v2/detect?key=AIzaSyDiUqDbtPcv71sScjmlqQb5aDZpSxjV2pQ";
  var params = new FormData();
  params.append("q", text);

  http.onreadystatechange = function () {
    //Call a function when the state changes.
    if (http.status == 200) {
      var jsonObject = JSON.parse(http.responseText);
      var lan = jsonObject.data.detections[0][0].language;
      translate(text, lan, id);
    }
  };
  http.open("POST", url, true);
  http.send(params);
}
function translate(text, lan, id) {
  var http = new XMLHttpRequest();
  var url =
    "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDiUqDbtPcv71sScjmlqQb5aDZpSxjV2pQ";
  var params = new FormData();
  params.append("q", text);
  params.append("format", "text");
  params.append("source", lan);
  params.append("target", "en");

  http.onreadystatechange = function () {
    if (http.status == 200) {
      var jsonObject = JSON.parse(http.responseText);
      var final = jsonObject.data.translations[0].translatedText;
      var cl = document.getElementsByClassName("Tkt2p")[id];
      var tag = cl.getElementsByClassName("_3zb-j ZhF0n")[0];
      tag.textContent = final;
    }
  };
  http.open("POST", url, true);
  http.send(params);
}

setInterval(function () {
  test();
}, 500);

// Send the selected language to the background script
