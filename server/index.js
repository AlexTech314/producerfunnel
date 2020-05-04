const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

require('dotenv').config();

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String
});

const typeDefs = `
  type Query {
    hello(name: String): String!
  }

  type UserSchema {
    id: ID!
    text1: String!
    text2: String!
    text3: String!
  }

  type Mutation {
    createUserSchema(text1: String!, text2: String!, text3: String!): UserSchema
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },

  Mutation: {
    createUserSchema: async (_, { text1, text2, text3 }) => {
    const user = new UserSchema({text1, text2, text3});
    await user.save();
    return user;
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

const uri = process.env.ATLAS_URI; mongoose.connect(uri, {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log("we on the goose.");
  server.start(() => console.log('Server is running on localhost:4000'));
  // we're connected!
});

