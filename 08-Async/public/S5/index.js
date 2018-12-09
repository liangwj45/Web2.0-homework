function id(i, sp = true) {
  return `#control-ring li:nth-child(${i})` + (sp ? " span:nth-child(2)" : "");
}

function disable(e) {
  $(e)
    .removeClass("enable")
    .addClass("disable");
}

function enable(e) {
  $(e)
    .removeClass("disable")
    .addClass("enable");
}

function init() {
  $("#button").mouseleave(() => {
    $("#total-box span")
      .html("")
      .show();
    disable("#total-box");
    for (let i = 1; i <= 5; ++i) {
      enable(id(i, false));
      $(id(i))
        .html(0)
        .hide();
    }
    $("#rank").html("");
  });
  $("#total-box")
    .addClass("disable")
    .show();
  for (let i = 1; i <= 5; ++i) {
    $(id(i, false)).addClass("enable");
  }
}

function handlerHelper(i) {
  return new Promise(function(resolve, reject) {
    let rank = $("#rank").html();
    $(id(i))
      .html("···")
      .show();
    for (let j = 1; j <= 5; ++j) {
      if (i == j) continue;
      disable(id(j, false));
    }
    $.ajax({
      url: "/api/random",
      success: num => {
        if ($("#rank").html() != rank) return;
        for (let j = 1; j <= 5; ++j) {
          if (i == j || $(id(j)).html() != 0) continue;
          enable(id(j, false));
        }
        disable(id(i, false));
        if ($("#rank").html() != rank) return;
        resolve(num);
      },
      error: err => reject(err)
    });
  });
}

function aHandler(sum, resolve, reject) {
  handlerHelper(1).then(num => {
    $("#total-box span").html("这是个天大的秘密");
    if (Math.random() < 0.9) {
      $(id(1)).html(num);
      resolve(parseInt(sum) + parseInt(num));
    } else {
      $(id(1)).html(0);
      reject({ msg: "这不是秘密", currentSum: sum });
    }
  });
}
function bHandler(sum, resolve, reject) {
  $("#total-box span").html("我不知道");
  handlerHelper(2).then(num => {
    if (Math.random() < 0.9) {
      $(id(2)).html(num);
      resolve(parseInt(sum) + parseInt(num));
    } else {
      $(id(2)).html(0);
      reject({ msg: "我知道", currentSum: sum });
    }
  });
}
function cHandler(sum, resolve, reject) {
  $("#total-box span").html("你不知道");
  handlerHelper(3).then(num => {
    if (Math.random() < 0.9) {
      $(id(3)).html(num);
      resolve(parseInt(sum) + parseInt(num));
    } else {
      $(id(3)).html(0);
      reject({ msg: "你知道", currentSum: sum });
    }
  });
}
function dHandler(sum, resolve, reject) {
  $("#total-box span").html("他不知道");
  handlerHelper(4).then(num => {
    if (Math.random() < 0.9) {
      $(id(4)).html(num);
      resolve(parseInt(sum) + parseInt(num));
    } else {
      $(id(4)).html(0);
      reject({ msg: "他知道", currentSum: sum });
    }
  });
}
function eHandler(sum, resolve, reject) {
  $("#total-box span").html("才怪");
  handlerHelper(5).then(num => {
    if (Math.random() < 0.9) {
      $(id(5)).html(num);
      resolve(parseInt(sum) + parseInt(num));
    } else {
      $(id(5)).html(0);
      reject({ msg: "真的怪", currentSum: sum });
    }
  });
}
function bubbleHandler(sum, num, resolve, reject) {
  $("#total-box span").html("楼主异步调用战斗力感人，目测不超过" + sum);
}

function robot(handlers, now, sum) {
  $("#total-box span").show();
  if (now > handlers.length) return;
  handlers[now - 1](
    sum,
    function(nextSum) {
      robot(handlers, now + 1, nextSum);
    },
    function(err) {
      console.log(err);
      $("#total-box span").html(err.msg);
    }
  );
}

$(document).ready(function() {
  init();
  const handlers = [
    aHandler,
    bHandler,
    cHandler,
    dHandler,
    eHandler,
    bubbleHandler
  ];

  $("#apb").click(() => {
    if ($("#rank").html() != "") return;
    let rank = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
    rank.push(0);
    let r = [];
    let rhandlers = [];
    for (let i = 0; i < 5; ++i) {
      r.push(String.fromCharCode(rank[i] + 64));
      rhandlers.push(handlers[rank[i] - 1]);
    }
    rhandlers.push(bubbleHandler);
    $("#rank").html(r);
    robot(rhandlers, 1, 0);
  });
});
