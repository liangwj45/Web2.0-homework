const usernameRegex = /^[a-zA-Z]\w{5,17}$/;
const stuIdRegex = /^[1-9]\d{7}$/;
const telRegex = /^[1-9]\d{10}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

window.onload = function() {
  document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();
    onSubmit();
  });

  for (let i = 0; i < 4; ++i) {
    let input_id = $("input")[i].id;
    let hins_id = "hins-" + input_id;
    $("#" + hins_id).hide();
    $("#" + input_id).on("blur", validCheck);
  }
};

function validCheck(e) {
  const tar = e.type == "blur" ? e.target : e;
  let value = tar.value;
  if (value.length == 0 && e.type == "blur") {
    return false;
  }
  switch (tar.id) {
    case "username":
      if (!usernameRegex.test(value)) {
        $("#hins-username")
          .html(
            "The username must contain only letters, numbers and underscores within 6 to 18 characters."
          )
          .show();
        return false;
      }
      $("#hins-username").hide();
      break;
    case "sid":
      if (!stuIdRegex.test(value)) {
        $("#hins-sid")
          .html("The student id must be eight digits.")
          .show();
        return false;
      }
      $("#hins-sid").hide();
      break;
    case "tel":
      if (!telRegex.test(value)) {
        $("#hins-tel")
          .html("Invalid telephone number.")
          .show();
        return false;
      }
      $("#hins-tel").hide();
      break;
    case "email":
      if (!emailRegex.test(value)) {
        $("#hins-email")
          .html("Invalid email address.")
          .show();
        return false;
      }
      $("#hins-email").hide();
      break;
  }
  return true;
}

function reset() {
  $("#username")[0].value = "";
  $("#sid")[0].value = "";
  $("#tel")[0].value = "";
  $("#email")[0].value = "";
  $("p").hide();
}

function onSubmit() {
  let flag = true;
  for (let i = 0; i < 4; ++i) {
    if (!validCheck($("input")[i])) {
      flag = false;
    }
  }
  if (!flag) return;
  const formData = $("#form").serializeArray();
  let userData = {};
  for (let data of formData) userData[data.name] = data.value;
  fetch("http://127.0.0.1:8000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })
    .then(res => res.json())
    .then(res => {
      if (res.code === 200) {
        window.location.href = "?username=" + userData.username;
        return;
      }

      if (res.code == 409) {
        const hins = {
          username: "Username is used.",
          sid: "Student id is used.",
          tel: "Telephone number is used.",
          email: "Email address is used."
        };
        let errid = res.field;
        $("#hins-" + errid).html(hins[errid]);
        $("#hins-" + errid).show();
      }
    })
    .catch(err => alert(err));
}
