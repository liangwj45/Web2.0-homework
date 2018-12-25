const regexs = {
  username: /^[a-zA-Z]\w{5,17}$/,
  password: /^[a-zA-Z0-9_\-]{6,12}$/,
  stuId: /^[1-9]\d{7}$/,
  tel: /^[1-9]\d{10}$/,
  email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
};

const errMsg = {
  400: {
    username: "invalid username",
    password: "invalid password",
    stuId: "invalid student id",
    tel: "invalid phone number",
    email: "invalid email address"
  },
  409: {
    username: "username conflict",
    stuId: "student id conflict",
    tel: "phone number conflict",
    email: "email address conflict"
  }
};

const msgId = {
  username: "#errUsername",
  password: "#errPassword",
  stuId: "#errStudentID",
  tel: "#errPhone",
  email: "#errEmail"
};

$(document).ready(() => {
  btnSubmit.onclick = () => {
    let password = txtPassword.value;
    let query = {
      username: txtUsername.value,
      password: password
    };

    if (!regexs.username.test(query.username)) {
      $("#errUsername")
        .html("invalid username")
        .show();
      return false;
    } else {
      $("#errUsername").hide();
    }

    if (!password) {
      $("#errPassword")
        .html("password can not be blank")
        .show();
      return false;
    } else {
      $("#errPassword").hide();
    }

    sha256(password).then(encryptedPwd => {
      query.password = encryptedPwd;
      fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(query)
      })
        .then(res => res.json())
        .then(obj => {
          if (obj.type == "success") {
            window.location.href = "http://127.0.0.1:8000/user/profile";
          } else if (obj.type == "not_found") {
            $("#errUsername")
              .html("user is not exist")
              .show();
          } else if (obj.type == "wrong_password") {
            $("#errPassword")
              .html("password is wrong")
              .show();
          } else {
            console.error(obj);
          }
        })
        .catch(err => {
          console.error("服务器故障");
        });
    });
  };
});
