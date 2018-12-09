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

  let cbs = [];
  cbs[0] = () => {
    enable("#total-box");
    $("#total-box span")
      .html(sum)
      .show();
    disable("#total-box");
  };
  for (let k = 0; k < 5; ++k) {
    cbs[k + 1] = i => {
      $(id(i))
        .html("···")
        .show();
      for (let j = 1; j <= 5; ++j) {
        if (i == j) continue;
        disable(id(j, false));
      }
      fetch("http://localhost:3000/api/random")
        .then(obj => obj.text())
        .then(number => {
          if (!action) return;
          $(id(i)).html(number);
          sum += parseInt(number);
          for (let j = 1; j <= 5; ++j) {
            if (i == j || $(id(j)).html() != 0) continue;
            enable(id(j, false));
          }
          disable(id(i, false));
          cbs[(i + 1) % 6](i + 1);
        });
    };
  }

  $("#apb").click(
    () =>
      new Promise(function(resolve, reject) {
        if (action) return;
        action = true;
        cbs[1](1);
      })
  );
});
