const debug = require("debug")('charity-organization:model-point');
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        country: String,
        city: String,
        street: String,
        number: String,
        food: Boolean,
        medicine: Boolean
    }, { autoIndex: false });



    schema.statics.CREATE = async function(point) {
        // return this.create({
        //     country: point[0],
        //     city: point[1],
        //     street: point[2],
        //     number: point[3],
        //     food: point[4],
        //     medicine: point[5]
        // });
        return this.create(point)
    };

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
            let cursor, point;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (point = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(point);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(point);
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


    db.model('Point', schema); // if model name === collection name
    debug("Point model created");
}
