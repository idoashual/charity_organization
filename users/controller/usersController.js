const User = require('../model')("User");
const debug = require('debug')('charity-organization:users');

var usersController={
    checksesssion(req, res, next){
        if (req.session === undefined || req.session.userId === undefined)
        res.redirect('/login');
    else
        next();
    } ,
     async getUsersListPage(req,res){
        debug('request users');
        try {
            res.render('users', {title: 'User List', admin: req.session.admin //, users: await User.REQUEST()
                                });
        } catch (err) { 
            debug(`get users failure: ${err}`); 
        }
    } ,
    async getEditPage(req,res){
        debug('edit user');
        try {
            res.render('edituser', {title: 'Edit User', admin: req.session.admin //, users: await User.REQUEST()
                                });
        } catch (err) { 
            debug(`get Edit user failure: ${err}`); 
        }
    } 
     ,
    async getUsersList(req,res){
        debug('request user list');
        try {
            res.json((await User.REQUEST({admin: false})).map(user =>
                ({name: user.name, username: user.username, password: user.password, admin: user.admin, email: user.email, phone: user.phone})));
        } catch (err) { debug(`get users failure: ${err}`); }
    },
    async getAddUserPage(req,res)
    {
        debug('add user page');
        if (!req.session.admin) {
            debug("Must be admin to add a user!!!");
            res.redirect('/users');
        } else
            res.render('adduser', {title: 'Add user', admin: req.session.admin});
    },
    async addUser(req,res)
    {
    //     debug('add user');
    // if (!req.session.admin)
    //     debug("Must be admin to add a user!!!");
    // else if (req.body.user === undefined || req.body.user === null || req.body.user === "")
    //     debug("Missing user to add!!!");
    // else if (req.body.password === undefined || req.body.password === null || req.body.password === "")
    //     debug("Missing password for user to add!!!");
    // else if (req.body.name === undefined || req.body.name === null || req.body.name === "")
    //     debug("Missing name for  userto add!!!");
    // else {
    //     let user;
    //     try {
    //         user = await User.findOne({username: req.body.user}).exec();
    //     } catch (err) {
    //         debug(`get user for adding failure: ${err}`);
    //     }
    //     if (user === null)
    //         try {
    //             await User.CREATE([req.body.name, req.body.user, req.body.password, req.body.admin !== undefined,req.body.email,req.body.phone]);
    //             debug('User created:' + user);
    //         } catch (err) {
    //             debug("Error creating a user: " + err);
    //         }
    //     else
    //         debug('User to be added already exists or checkin user existence failure!');
    // }
    let j = {name:"test", username:"ido", password:"123",admin:true,email:"test",phone:"test"}
        let user;
        try {
            user = await User.findOne({username: j.username}).exec();
        } catch (err) {
            debug(`get user for adding failure: ${err}`);
        }
        if (user === null)
            try {
                await User.CREATE(j);
                debug('User created:' + user);
            } catch (err) {
                debug("Error creating a user: " + err);
            }
        else{
            debug('User to be added already exists or checkin user existence failure!');
        }
    res.redirect('/users');
    },
    async deleteUser(req,res)
    {
        let username = req.params.name;
    debug(`delete user: ${username}`);
    if (!req.session.admin)
        debug("Must be admin to delete a user or can't delete THE ADMIN!!!");
    else {
        let user;
        try {
            user = await User.findOne({username: username}).exec();
        } catch (err) {
            debug(`get user for deleting failure: ${err}`);
        }
        if (user === null || user === undefined)
            debug('User to be deleted does not exist or failure checking user!');
        else {
            debug("REMOVING");
            try {
                await user.remove();
                debug('User successfully deleted!');
            } catch (err) {
                debug(`Failed deleting user: ${err}`);
            }
        }
    }
    res.send();
    //res.redirect('/users');
    },
    async editUser(req,res)
    {
        // let username = req.body.user;
        // console.log(username)
        // debug(`edit user: ${username}`);
        // if (!req.session.admin)
        //     debug("Must be admin to edit a user or can't edit THE ADMIN!!!");
        // else {
        //     let user;
        //     try {
        //         user = await User.findOne({username: username}).exec();
        //     } catch (err) {
        //         debug(`get user for editing failure: ${err}`);
        //         res.redirect('/users');
        //     }
        //     if (user === null || user === undefined)
        //         debug('User to be edited does not exist or failure checking user!');
        //     else {
        //         debug("EDITING");
        //         try {
                    
        //            // let username = req.params.name;
        //             found =  await User.EDIT([req.body.name, req.body.user, req.body.password, req.body.admin !== undefined,req.body.email,req.body.phone])
        //             // found =  await User.EDIT(user)
        //              res.redirect('/users');
        //           }
        //          catch (err) {console.log(err); res.sendStatus(400); res.redirect('/users');}
        //     }
        // }
        let j = {name:"test", username:"ido", password:"123",admin:true,email:"123",phone:"test"}
        let username = j.username;
        console.log(username)
        debug(`edit user: ${username}`);
        if (!req.session.admin)
            debug("Must be admin to edit a user or can't edit THE ADMIN!!!");
        else {
            let user;
            try {
                user = await User.findOne({username: username}).exec();
            } catch (err) {
                debug(`get user for editing failure: ${err}`);
                res.redirect('/users');
            }
            if (user === null || user === undefined)
                debug('User to be edited does not exist or failure checking user!');
            else {
                debug("EDITING");
                try {
                    
                   // let username = req.params.name;
                    found =  await User.EDIT(j)
                    // found =  await User.EDIT(user)
                     res.redirect('/users');
                  }
                 catch (err) {console.log(err); res.sendStatus(400); res.redirect('/users');}
            }
        }
        res.send();
        //res.redirect('/users');
    }
}
module.exports = usersController;