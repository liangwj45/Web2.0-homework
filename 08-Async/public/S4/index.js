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
    sum = 0;
    now = 0;
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
    $("#rank").hide();
  });

  $("#total-box").addClass("disable");
  for (let i = 1; i <= 5; ++i) {
    $(id(i, false)).addClass("enable");
  }

  let rank = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
  let cbs = [];
  for (let i = 1; i <= 5; ++i) {
    cbs[i] = i => {
      if (i != now) return;
      $(id(i))
        .html("···")
        .show();
      for (let j = 1; j <= 5; ++j) {
        if (i == j) continue;
        disable(id(j, false));
      }
      $.ajax({
        url: "/api/random",
        success: number => {
          if (i != now) return;
          $(id(i)).html(number);
          sum += parseInt(number);
          for (let j = 1; j <= 5; ++j) {
            if (i == j || $(id(j)).html() != 0) continue;
            enable(id(j, false));
          }
          disable(id(i, false));
          if (i != now) return;
          let j = 0;
          while (rank[j] != now) ++j;
          now = rank[j + 1];
          if (j < 4) {
            cbs[j + 1](now);
          } else {
            enable("#total-box");
            $("#total-box span")
              .html(sum)
              .show();
            disable("#total-box");
          }
        }
      });
    };
  }

  $("#apb").click(() => {
    if (now != 0) return;
    rank = rank.sort(() => Math.random() - 0.5);
    let r = [];
    for (let i = 0; i < 5; ++i) {
      r.push(String.fromCharCode(rank[i] + 64));
    }
    $("#rank")
      .html(r)
      .show();
    now = rank[0];
    cbs[1](rank[0]);
  });
});
