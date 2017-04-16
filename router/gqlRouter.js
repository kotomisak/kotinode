var graphqlExpress = require('graphql-server-express').graphqlExpress;
var makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const schema = require('../app/graphql/schema').schema;
const resolvers = require('../app/graphql/resolvers').resolvers;

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers
});


exports.graphqlExpress = graphqlExpress((req) => {
    return {
        schema: executableSchema,
        context: {
            authorization: req.headers.authorization
        }
    }
})