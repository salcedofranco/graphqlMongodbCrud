module.exports = `
    type Query {
        user(_id: String!): User
        users(age: Int): [User]
    }

    type User {
        _id: String
        name: String
        last_name: String
        age: Int
        country: String
    }

    type Mutation {
        insertUser(name: String!, last_name: String!, age: Int!, country: String!): User
        updateUser(_id: String!, name: String, last_name: String, age: Int, country: String): User
        deleteUser(_id: String!): User
    }
`