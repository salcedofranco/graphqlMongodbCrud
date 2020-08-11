const objectID = require('mongodb').ObjectID;
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const userSchema = require('./schema');

module.exports = (app, db) => {
    const schema = buildSchema(userSchema);

    const getUser = async function (args) {
        try {
            return await db.db().collection('users').findOne({ _id: new objectID(args._id) })
        } catch(err) {
            console.log(err);
        }
    }

    const getUsers = async function (args) {
        try{
            if ( !args.age ){
                return await db.db().collection('users').find().toArray();
            }

            return await db.db().collection('users').find({ age: args.age }).toArray();
        } catch(err){
             console.log(err);
        }
    }
 
    const insertUser = function ({ name, last_name, age, country }) {
        const new_user = { name, last_name, age, country }
        try {
            db.db().collection('users').insertOne(new_user);
            return new_user;
        } catch (err) {
            console.log(err);
        }
    }

    
    const updateUser = function (args) {
        try { 
            const filter = { _id: new objectID(args._id) };
            let user_fields = {};

            Object.keys(args).forEach((arg) => {
                if (arg) {
                    if (arg != '_id') {
                        user_fields[arg] = args[arg];
                     }
                }
            });

            const user = { $set:user_fields };
            db.db().collection('users').updateOne(filter, user);
            return user_fields;

        } catch(err) {
            console.log(err)
        }

    }

    const deleteUser = function (args) {
        try {
            db.db().collection('users').deleteOne({ _id: new objectID(args._id) })
        } catch (err) {
            console.log(err);
        }
    }
 
    const root = {
        user: getUser,
        users: getUsers,
        insertUser: insertUser,
        updateUser: updateUser,
        deleteUser: deleteUser
    }

    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    
    }));
}