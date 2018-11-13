const raw_pos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const pic_acount = 9;
blank_lpos = 15;
blank_rpos = 15;
begin = false;
p2 = false;
p2_build = false;
pic_id = 1;

window.onload = function() {
  if (window.innerHeight) winHeight = window.innerHeight;
  else if (document.body && document.body.clientHeight)
    winHeight = document.body.clientHeight;
  if (winHeight < 871) {
    setTimeout(() => {
      alert("同学你屏幕太小啦，页面的按钮在底下，缩放页面大小方可查看~");
    }, 200);
  }

  buildBlock("#left-block", "l-");

  document.onkeydown = event => {
    let e = event || window.event || arguments.callee.caller.arguments[0];
    if (!p2 || !e || !begin) return;
    var tar_pos = blank_rpos;
    switch (e.keyCode) {
      case 37: // left
        tar_pos += 1;
        break;
      case 38: // up
        tar_pos += 4;
        break;
      case 39: // right
        tar_pos -= 1;
        break;
      case 40: // down
        tar_pos -= 4;
        break;
      default:
        return;
    }
    let dif = Math.abs((tar_pos % 4) - (blank_rpos % 4));
    if (tar_pos > 15 || tar_pos < 0 || dif == 3) return;
    $(".image-keyboard").hide();
    let id = $(`[pos='${tar_pos}']:last`)[0].id;
    setPosition("#" + id, blank_rpos);
    blank_rpos = tar_pos;
    check("r-");
  };
};

function buildBlock(par, id) {
  let div = $("<div></div>").addClass("game-block");
  for (let i = 0; i < 15; ++i) {
    let pic = $("<div></div>")
      .addClass("pic")
      .attr({ id: id + i, pos: i })
      .css({
        backgroundImage: `url(images/${pic_id}.png`,
        backgroundPositionX: ((i % 4) / 3) * 100 + "%",
        backgroundPositionY: (Math.floor(i / 4) / 3) * 100 + "%",
        left: ((i % 4) / 4) * 100 + "%",
        top: (Math.floor(i / 4) / 4) * 100 + "%"
      });
    pic.click(() => {
      let pos = pic.attr("pos");
      let dif = Math.abs(pos - blank_lpos);
      let dif3 = Math.abs((pos % 4) - (blank_lpos % 4));
      if (!begin) return;
      if (dif == 4 || (dif == 1 && dif3 != 3)) {
        $(".image-mouse").hide();
        setPosition("#" + pic.attr("id"), blank_lpos);
        blank_lpos = pos;
        check(id);
      }
    });
    div.append(pic);
  }
  $(par).append(div);
}

function start(flag) {
  begin = flag;
  blank_lpos = 15;
  blank_rpos = 15;
  let now = flag
    ? rationalize(raw_pos.slice().sort(() => Math.random() - 0.5))
    : raw_pos;
  for (let i = 0; i < 15; ++i) {
    setPosition("#l-" + i, now[i]);
    if (p2) {
      setPosition("#r-" + i, now[i]);
    }
  }
}

function check(e) {
  for (let i = 0; i < 15; ++i) {
    if ($("#" + e + i).attr("pos") != i) return;
  }
  begin = false;
  let id = e == "l-" ? "#left-block" : "#right-block";
  $(id)
    .animate({ opacity: 0 }, "slow")
    .animate({ opacity: 1 }, "slow");
}

function shink() {
  $("body")
    .animate({ opacity: 0 }, "slow")
    .animate({ opacity: 1 }, "slow");
}

function changePic() {
  pic_id = (pic_id % pic_acount) + 1;
  for (let i = 0; i < 15; ++i) {
    $("#l-" + i).css({ backgroundImage: `url(images/${pic_id}.png` });
    if (p2_build) {
      $("#r-" + i).css({ backgroundImage: `url(images/${pic_id}.png` });
    }
  }
  $("#pic-block").css({ backgroundImage: `url(images/${pic_id}.png` });
  start(false);
}

function setPosition(id, i) {
  $(id).animate(
    {
      left: ((i % 4) / 4) * 100 + "%",
      top: (Math.floor(i / 4) / 4) * 100 + "%"
    },
    0
  );
  $(id).attr({ pos: i });
}

function addPlayer() {
  p2 = !p2;
  if (!p2) {
    $("#pic-block").show();
    $("#p2").hide();
    start(false);
    return;
  }
  $("#pic-block").hide();
  if (p2_build) {
    $("#p2").show();
    start(false);
    $(".image-keyboard").show();
    $(".image-mouse").show();
    return;
  }
  start(false);
  p2_build = true;
  let div = $("<div></div>")
    .addClass("game-block")
    .attr({ id: "p2" });
  for (let i = 0; i < 15; ++i) {
    let pic = $("<div></div>")
      .addClass("pic")
      .attr({ id: "r-" + i, pos: i })
      .css({
        backgroundImage: `url(images/${pic_id}.png)`,
        backgroundPositionX: ((i % 4) / 3) * 100 + "%",
        backgroundPositionY: (Math.floor(i / 4) / 3) * 100 + "%",
        left: ((i % 4) / 4) * 100 + "%",
        top: (Math.floor(i / 4) / 4) * 100 + "%"
      });
    div.append(pic);
  }
  let key = $("<div></div>").addClass("image-keyboard");
  div.append(key);
  $("#right-block").append(div);
  let mouse = $("<div></div>").addClass("image-mouse");
  $("#left-block .game-block").append(mouse);
}

function rationalize(arr) {
  let cover_count = 0;
  for (let i = 0; i < 15; ++i) {
    for (let j = i + 1; j < 15; ++j) {
      if (arr[i] > arr[j]) ++cover_count;
    }
  }
  if (cover_count & 1) {
    [arr[13], arr[14]] = [arr[14], arr[13]];
  }
  return arr;
}
