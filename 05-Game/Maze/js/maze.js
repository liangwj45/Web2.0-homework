class Maze {
  constructor() {
    this.begin = false;
    this.cheated = false;
    this.init = this.init.bind(this);
    this.startOfGame = this.startOfGame.bind(this);
    this.endOfGame = this.endOfGame.bind(this);
    this.outOfMaze = this.outOfMaze.bind(this);
    this.lose = this.lose.bind(this);

    window.onload = this.init;
  }

  init() {
    $("#maze").bind("mouseleave", this.outOfMaze);
    $("#start").bind("mouseenter", this.startOfGame);
    $("#end").bind("mouseenter", this.endOfGame);
    $(".wall").bind("mouseenter", this.lose);
  }

  outOfMaze() {
    if (this.begin) this.cheated = true;
    else this.clean();
  }

  startOfGame() {
    this.cheated = false;
    this.begin = true;
    this.clean();
  }

  endOfGame() {
    if (this.begin) {
      if (this.cheated) {
        this.cheat();
      } else {
        this.win();
      }
      this.begin = false;
      this.cheated = false;
    }
  }

  lose() {
    if (this.begin) {
      $("#display")
        .text("You Lose")
        .removeClass("hide")
        .addClass("show");
      $(".wall")
        .removeClass("wall")
        .addClass("red");
      this.begin = false;
      this.cheated = false;
    }
  }

  clean() {
    $(".red")
      .removeClass("red")
      .addClass("wall");
    $("#display")
      .removeClass("show")
      .addClass("hide");
  }

  cheat() {
    $("#display")
      .text(
        "Don't cheat, you should start from the 'S'\
        and move to the 'E' inside the maze!"
      )
      .removeClass("hide")
      .addClass("show");
  }

  win() {
    $("#display")
      .text("You Win")
      .removeClass("hide")
      .addClass("show");
  }
}

new Maze();
