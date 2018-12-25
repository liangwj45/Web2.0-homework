const indexPage = require("../routers/indexPage");
const loginPage = require("../routers/loginPage");
const registPage = require("../routers/registPage");
const profilePage = require("../routers/profilePage");

const login = require("../routers/login");
const register = require("../routers/register");
const logout = require("../routers/logout");

module.exports = {
  indexPage,
  loginPage,
  registPage,
  profilePage,

  login,
  register,
  logout
};
