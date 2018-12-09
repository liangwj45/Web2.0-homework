let sum = 0;
let action = false;

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

function asyncTask(i) {
  return new Promise(resolve => {
    $(id(i))
      .html("···")
      .show();
    $.ajax({
      url: "/api/random",
      cache: false,
      success: number => {
        if (!action) return;
        $(id(i)).html(number);
        sum += parseInt(number);
        disable(id(i, false));
        resolve();
      }
    });
  });
}

$(document).ready(function() {
  $("#button").mouseleave(() => {
    action = false;
    sum = 0;
    $("#total-box span")
      .html(0)
      .hide();
    disable("#total-box");
    for (let i = 1; i <= 5; ++i) {
      enable(id(i, false));
      $(id(i))
        .html(0)
        .hide();
    }
  });

  $("#total-box").addClass("disable");
  for (let i = 1; i <= 5; ++i) {
    $(id(i, false)).addClass("enable");
  }

  $("#apb").click(() => {
    if (action) return;
    action = true;
    Promise.all([
      asyncTask(1),
      asyncTask(2),
      asyncTask(3),
      asyncTask(4),
      asyncTask(5)
    ]).then(() => {
      $("#total-box span")
        .html(sum)
        .show();
    });
  });
});
