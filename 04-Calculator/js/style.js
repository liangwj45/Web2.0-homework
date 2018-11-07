class Calculator {
  constructor() {
    this.display = null;
    this.inputed = false;
    this.init = this.init.bind(this);
    this.onClick = this.onClick.bind(this);

    window.onload = this.init;
    document.addEventListener("click", this.onClick);
  }

  init() {
    this.display = document.getElementById("display");
    this.display.value = "0";
  }

  onClick(e) {
    var target = e.target;
    var className = target.className;
    var val = target.value;

    if (!target.matches("button") || this.checkSameOperator(className, val)) {
      return;
    }

    if (target.id == "remove") {
      this.remove();
      return;
    }

    if (target.id == "clean") {
      this.clean();
      return;
    }

    if (target.id == "equal") {
      this.calculate();
      return;
    }

    if (this.checkOutOfRange() == true) {
      alert("式子过长。");
      return;
    }

    if (this.inputed == true) {
      this.display.value += val;
      return;
    }

    this.inputed = true;

    if (val == ".") {
      this.display.value = "0.";
      return;
    }

    if (
      className == "digit" ||
      className == "bracket" ||
      this.display.value == "0"
    ) {
      this.display.value = val;
    } else {
      this.display.value += val;
    }
  }

  remove() {
    if (this.display.value.length == 1) {
      this.clean();
    } else {
      this.display.value = this.display.value.substr(
        0,
        this.display.value.length - 1
      );
    }
  }

  clean() {
    this.display.value = "0";
    this.inputed = false;
  }

  calculate() {
    if (this.inputed == false) {
      return;
    }
    this.inputed = false;

    var times = String.fromCharCode(215);
    var divide = String.fromCharCode(247);
    var expression = this.display.value
      .split(times)
      .join("*")
      .split(divide)
      .join("/");

    try {
      var result = eval(expression);
      this.display.value = this.roundFun(result, 6).toString();
    } catch (err) {
      alert("检查一下你的输入是否有误: " + this.display.value);
      this.clean();
    }
  }

  getLastChar() {
    return this.display.value.charAt(this.display.value.length - 1);
  }

  checkOutOfRange() {
    return this.display.value.length >= 12;
  }

  checkSameOperator(className, val) {
    return className == "oper" && this.getLastChar() == val;
  }

  roundFun(value, n) {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
  }
}

new Calculator();
