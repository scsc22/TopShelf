// GraphQL schema definition specifying input types, object types, and operations
const typeDefs = 
  // Input type for user data used in mutations and queries
  input userInput {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [bookInput]!
  }

   //Input type for book data used in mutations
  input bookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

   //Object type representing a User in the system
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

   //Object type representing a Book in the system
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  // Object type representing authentication information
  type Auth {
    token: ID!
    user: User
  }

  // Query type specifying available queries in the schema
  type Query {
    // Query to fetch user information based on input parameters
    me(input: userInput!): User
  }

   //Mutation type specifying available mutations in the schema
  type Mutation {
    // Mutation to add a new user with provided information
    addUser(username: String!, email: String!, password: String!): Auth

     //Mutation to authenticate and log in a user
    login(email: String!, password: String!): Auth

    // Mutation to save a new book to a user's collection
    saveBook(input: bookInput!): User

     //Mutation to remove a book from a user's collection
    removeBook(input: bookInput!): User
  }
;

// Export the GraphQL schema for use in the application
module.exports = typeDefs;
