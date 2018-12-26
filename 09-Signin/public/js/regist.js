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

const infoId = {
  username: "#txtUsername",
  password: "#txtPassword",
  stuId: "#txtStudentID",
  tel: "#txtPhone",
  email: "#txtEmail"
};

$(document).ready(() => {
  for (let key of Object.keys(infoId)) {
    $(infoId[key]).on("blur", () => {
      if (!regexs[key].test($(infoId[key]).val())) {
        $(msgId[key])
          .html(errMsg[400][key])
          .show();
      } else {
        $(msgId[key]).hide();
      }
    });
  }

  $("#txtConfirmPassword").on("blur", () => {
    if (txtConfirmPassword.value !== txtPassword.value) {
      $("#errConfirmPwd")
        .html("password is not the same")
        .show();
    } else {
      $("#errConfirmPwd").hide();
    }
  });

  btnReset.onclick = () => {
    txtUsername.value = "";
    txtPassword.value = "";
    txtConfirmPassword.value = "";
    txtStudentID.value = "";
    txtPhone.value = "";
    txtEmail.value = "";
    for (let key of Object.keys(msgId)) {
      $(msgId[key]).hide();
    }
  };

  btnSubmit.onclick = () => {
    let query = {
      username: txtUsername.value,
      password: txtPassword.value,
      stuId: txtStudentID.value,
      tel: txtPhone.value,
      email: txtEmail.value
    };

    for (let key of Object.keys(query)) {
      if (!regexs[key].test(query[key])) return;
    }

    let password = txtPassword.value;
    if (txtConfirmPassword.value != password) return;
    sha256(password).then(encryptedPwd => {
      query.password = encryptedPwd;

      let formData = new FormData();
      for (let key in Object.keys(query)) {
        formData.append(key, query[key]);
      }

      let status;

      fetch("http://127.0.0.1:8000/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(query)
      })
        .then(res => {
          status = res.status;
          if (status == 200) {
            window.location.href = "/user/profile";
          } else return res.json();
        })
        .then(data => {
          if (!data) return;
          if (status == 409 || staus == 400) {
            $(msgId[data.field])
              .html(errMsg[status][data.field])
              .show();
          } else {
            console.error(data.msg);
          }
        })
        .catch(err => {
          console.error("服务器故障");
        });
    });
  };
});
