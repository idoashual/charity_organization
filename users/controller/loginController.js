const User = require('../model')("User");
const debug = require('debug')('charity-organization:login');


var loginController={
  async  getLoginPage(req,res){
    if (req.session.userId === undefined) {
        req.session.referer = req.get('Referer');
        if (req.session.referer === undefined)
            req.session.referer = '/';
        res.render("login", {title: "Login", problem: req.session.badLogin});
    }
    else
        res.redirect('/');
  },
  async login(req,res)
  {
    var session = req.session;
    let user;
    try {
        user = await User.findOne({username: req.body.user}).exec();
    } catch (err) {
        debug(`Login error: ${err}`);
        session.badLogin = "Login error";
        res.redirect(req.session.referer);
        return;
    }
    if (user === null || user.password !== req.body.password) {
        debug(`Login no user: ${req.body.user}`);
        session.badLogin = `User '${req.body.user}' or its password aren't correct`;
        res.redirect(req.session.referer);
        return;
    }
    debug(`Logged to: ${user.username}`);
    delete session.badLogin;
    session.userId = user.id;
    session.admin = user.admin;
    session.userName = user.name;
    session.count = 0;
    res.redirect('/');
  }
}
module.exports = loginController;