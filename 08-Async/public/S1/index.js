let flag = false;
let calculating;
let sum = 0;
let now = 0;

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

$(document).ready(function() {
  $("#button").mouseleave(() => {
    now = 0;
    calculating = false;
    flag = false;
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

  $("#total-box")
    .addClass("disable")
    .click(() => {
      if (!flag) return;
      $("#total-box span")
        .html(sum)
        .show();
      disable("#total-box");
    });

  for (let i = 1; i <= 5; ++i) {
    $(id(i, false))
      .addClass("enable")
      .click(() => {
        now = i;
        if (calculating || $(id(i)).html() != 0) return;
        $(id(i))
          .html("···")
          .show();
        calculating = true;
        for (let j = 1; j <= 5; ++j) {
          if (i == j) continue;
          disable(id(j, false));
        }
        fetch("http://localhost:3000/api/random")
          .then(obj => obj.text())
          .then(number => {
            if (now != i) return;
            $(id(i)).html(number);
            sum += parseInt(number);
            calculating = false;
            flag = true;
            for (let j = 1; j <= 5; ++j) {
              if (i == j || $(id(j)).html() != 0) continue;
              enable(id(j, false));
              flag = false;
            }
            disable(id(i, false));
            if (flag) enable("#total-box");
          });
      });
  }
});
