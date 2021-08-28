const debug = require("debug")('charity-organization:model-user');
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        name: String,
        username: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        admin: Boolean,
        email: String,
        phone: String
    }, { autoIndex: false });



    schema.statics.CREATE = async function(user) {
        // return this.create({
        //     name: user[0],
        //     username: user[1],
        //     password: user[2],
        //     admin: user[3],
        //     email: user[4],
        //     phone: user[5]
        // });
         return this.create(user)
    };

    // schema.statics.UPDATE = async function(username)
    // { 
    //     return this.findOneAndUpdate( {username: username},{name: "blah"}).exec(); 
    // };

    schema.statics.EDIT = async function(u) { //return this.findOneAndUpdate( {username: u[1]},{name: u[0], email: u[4],phone: u[5]}).exec(); 
        return this.findOneAndUpdate( {username: u.username},{name: u.name, email: u.email,phone: u.phone}).exec();
    };

    // on every save, add the date
    // schema.pre('save', function(next) {
    //     // get the current date
    //     let currentDate = new Date();
    //     // change the updated_at field to current date
    //     this.updated_at = currentDate;
    //     // if created_at doesn't exist, add to that field
    //     if (!this.created_at)
    //         this.created_at = currentDate;
    //     next();
    // });


    schema.statics.REQUEST = async function() {
        // no arguments - bring all at once
        const args = Array.from(arguments);
        if (args.length === 0) {
            debug("request: no arguments - bring all at once");
            return this.find({}).exec();
        }

        // perhaps last argument is a callback for every single document
        let callback = arguments[arguments.length - 1];
        if (callback instanceof Function) {
            let asynch = callback.constructor.name === 'AsyncFunction';
            debug(`request: with ${asynch?'async':'sync'} callback`);
            args.pop();
            let cursor, user;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (user = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(user);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(user);
                    }
                }
            } catch (err) { throw err; }
            return;
        }

        // request by id as a hexadecimal string
        if (args.length === 1 && typeof args[0] === "string") {
            debug("request: by ID");
            return this.findById(args[0]).exec();
        }

        // There is no callback - bring requested at once
        debug(`request: without callback: ${JSON.stringify(args)}`);
        return this.find(...args).exec();
    }

    // the schema is useless so far
    // we need to create a model using it
    // db.model('User', schema, 'User'); // (model, schema, collection)
    db.model('User', schema); // if model name === collection name
    debug("User model created");
}
