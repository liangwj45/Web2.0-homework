begin = 0;

window.onload = function() {
  _.times(60, function() {
    var hole = document.createElement("div");
    hole.addEventListener("click", whac);
    hole.className = "hole";
    hole.nodeType = "radio";
    $("#map").append(hole);
  });
  $("#start-stop").bind("click", start_stop);
};

function start_stop() {
  if (begin == 0) start();
  else end();
}

function start() {
  begin = 1;
  $("#state")[0].value = "Playing";
  $("#time")[0].value = "31";
  $("#score")[0].value = "0";
  clean();
  setMole();
  time();
}

function time() {
  if (begin == 0) return;
  var current = $("#time")[0];
  if (parseInt(current.value) > 0) {
    current.value = (parseInt(current.value) - 1).toString();
  }
  if (parseInt(current.value) <= 0) end();
  else t = setTimeout("time()", 1000);
}

function setMole() {
  var tmp = $("#map")[0].children[_.random(59)];
  if (tmp.className == "hole") {
    tmp.className = "mole";
  } else {
    setMole();
  }
}

function end() {
  clean();
  begin = 0;
  $("#state")[0].value = "Game Over";
  alert("Game Over, Score: " + $("#score")[0].value);
}

function whac(e) {
  var target = e.target;
  var tmp = parseInt($("#score")[0].value);
  if (target.className == "mole") {
    setMole();
    target.className = "hole";
    tmp += 1;
  } else {
    tmp = tmp <= 1 ? 0 : tmp - 1;
  }
  $("#score")[0].value = tmp.toString();
}

function clean() {
  var map = $("#map")[0];
  for (var i = 0; i < 60; ++i) {
    map.children[i].className = "hole";
  }
}
