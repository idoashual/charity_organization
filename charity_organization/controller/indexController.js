const debug = require('debug')('charity-organization:index');


var indexController={

    checksesssion(req, res, next){
        if (req.session === undefined || req.session.userId === undefined)
        res.redirect('/login');
    else
        next();
    } ,
    async getHomePage(req,res)
    {
        if(req.session.admin){
        debug('requested');
        req.session.count++;
        res.render('indexadmin', { title: 'ברוך הבא',
                              count: req.session.count,
                              userName: req.session.userName });
        }
        else
        {
            debug('requested');
        req.session.count++;
        res.render('indexdistribute', { title: 'ברוך הבא',
                              count: req.session.count,
                              userName: req.session.userName });
        }
    },
    async logout(req,res)
    {
        debug('logging out');
        req.session.regenerate(() => {
            debug('logged out');
            res.redirect('/');
        });
    }
}
module.exports = indexController;