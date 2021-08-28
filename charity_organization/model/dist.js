const debug = require("debug")('charity-organization:model-dist');
const mongo = require("mongoose");

module.exports = db => {
    // create a schema
    let schema = new mongo.Schema({
        date: Date,
        username: String,
        country: String,
        city: String,
        street: String,
        number: String,
        done: Boolean
    }, { autoIndex: false });



    schema.statics.CREATE = async function(dist) {
        return this.create({
            date: dist[0],
            username: dist[1],
            country: dist[2],
            city: dist[3],
            street: dist[4],
            number: dist[5],
            done: dist[6]
        });
        // let j = {date:"2021-08-26T11:48:35.775Z", city:"test", street:"test",number:"test",food:true,medicine:true}
        // return this.create(j)
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
            let cursor, dist;
            try {
                cursor = await this.find(...args).cursor();
            } catch (err) { throw err; }
            try {
                while (null !== (dist = await cursor.next())) {
                    if (asynch) {
                        try {
                            await callback(dist);
                        } catch (err) { throw err; }
                    }
                    else {
                        callback(dist);
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


    db.model('Dist', schema); // if model name === collection name
    debug("Dist model created");
}
