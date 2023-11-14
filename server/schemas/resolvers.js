// Importing the User model and authentication-related utilities
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

// GraphQL resolvers defining the operations for queries and mutations
const resolvers = {
  Query: {
    // Resolver for the 'me' query, fetching a user by their ID
    me: async (parent, args) => {
      try {
        // Attempt to find a user by their ID
        const user = await User.findById(args.userId);

        // If no user is found, throw an error
        if (!user) {
          throw new Error("User not found");
        }

        // Return the found user
        return user;
      } catch (error) {
        // If an error occurs during the process, throw a detailed error message
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },
  },

  Mutation: {
    // Resolver for the 'addUser' mutation, creating a new user and generating a token
    addUser: async (parent, { username, email, password }) => {
      // Create a new user with the provided information
      const user = await User.create({ username, email, password });

      // Generate a token for the newly created user
      const token = signToken(user);

      // Return the generated token and the user
      return { token, user };
    },

    // Resolver for the 'login' mutation, handling user login and token generation
    login: async (parent, { email, password }) => {
      // Find a user by their email address
      const user = await User.findOne({ email });

      // If no user is found, throw an authentication error
      if (!user) {
        throw AuthenticationError;
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, throw an authentication error
      if (!correctPw) {
        throw AuthenticationError;
      }

      // Generate a token for the authenticated user
      const token = signToken(user);

      // Return the generated token and the user
      return { token, user };
    },

    // Resolver for the 'saveBook' mutation, adding a book to a user's saved books
    saveBook: async (parent, { user, bookInput }) => {
      // Validate input parameters
      if (!user || !user._id || !bookInput || !bookInput.bookId) {
        throw new Error("Invalid input. Please provide user._id and bookInput with bookId.");
      }

      // Find the existing user by their ID
      const existingUser = await User.findById(user._id);

      // If no user is found, throw an error
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Create a new book object based on the provided input
      const newBook = { ...bookInput };

      // Add the new book to the user's savedBooks array
      existingUser.savedBooks.push(newBook);

      // Update the bookCount property in the user object
      existingUser.bookCount = existingUser.savedBooks.length;

      // Save the updated user object
      const updatedUser = await existingUser.save();

      // Return the updated user object
      return updatedUser;
    },

    // Resolver for the 'removeBook' mutation, removing a book from a user's saved books
    removeBook: async (parent, args) => {
      // Find and delete a book by its bookId from the user's savedBooks
      return User.savedBooks.findOneAndDelete({ bookId: args.bookId });
    },
  },
};

// Export the resolvers for use in the GraphQL schema
module.exports = resolvers;
