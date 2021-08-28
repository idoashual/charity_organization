const Point = require('../model')("Point");
const debug = require('debug')('charity-organization:points');

var operationController={

    checksesssion(req, res, next){
        if (req.session === undefined || req.session.userId === undefined)
        res.redirect('/login');
    else
        next();
    } ,
    async getAddPointPage(req,res)
    {
        debug('request addpoint');
        try {
            res.render('addpoint', {title: 'Add Point', admin: req.session.admin //, users: await User.REQUEST()
                                });
        } catch (err) { 
           debug(`get Add Point failure: ${err}`); 
        }
    },
    async addPoint(req,res)
    {
        // try {
        //     await Point.CREATE([req.body.country, req.body.city, req.body.street,req.body.number,req.body.food !== undefined,req.body.medicine !== undefined]);
        // } catch (err) {
        //     debug("Error creating a point: " + err);
        // }

        let j = {country:"israel", city:"test", street:"test",number:"test",food:true,medicine:true}
        try {
            await Point.CREATE(j);
        } catch (err) {
            debug("Error creating a point: " + err);
        }
        res.redirect('/');
    },
    async getPointList(req,res){
        debug('request points list');
        try {
            res.json((await Point.REQUEST()).map(point =>
                ({country: point.country, city: point.city, street: point.street, number: point.number, food: point.food, medicine: point.medicine})));
        } catch (err) { debug(`get points failure: ${err}`); }
    },
    async getAssignPage(req,res)
    {
        debug('request getAssignPage');
        try {
            res.render('assign', {title: 'getAssignPage', admin: req.session.admin //, users: await User.REQUEST()
                                });
        } catch (err) { 
           debug(`getAssignPage failure: ${err}`); 
        }
    },
    async cluster(req,res)
    {
        res.status(200);
        res.send("ok");
    },
    async  addDist(req,res)
    {
        res.status(200);
        res.send("ok");
    }
}
module.exports = operationController;