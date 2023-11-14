// Import necessary modules and dependencies
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

// Create an Express application
const app = express();

// Set the port for the server to the environment variable or default to 3001
const PORT = process.env.PORT || 3001;

// Create an Apollo Server instance with defined typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Asynchronous function to start the Apollo Server
const startApolloServer = async () => {
  // Start the Apollo Server
  await server.start();

  // Set up middleware to handle URL-encoded and JSON data
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Set up middleware for handling GraphQL requests with authentication
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Serve static assets if in production (for React client)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Route for any other paths to serve the React client's index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Once the database connection is open, start the Express server
  db.once('open', () => {
    app.listen(PORT, () => {
      // Log server information to the console upon successful start
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the function to start the Apollo Server
startApolloServer();
