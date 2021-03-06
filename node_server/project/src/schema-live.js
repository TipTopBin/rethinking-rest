const graphql = require('graphql');
const knex = require('../db');

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: () => {
        return {
            id: {
                type: graphql.GraphQLID,
                resolve(user) {
                    return user.id;
                }
            },
            username: {
                type: graphql.GraphQLString,
                resolve(user) {
                    return user.username;
                }
            },
            booksRead: {
                type: graphql.GraphQLList(HasReadType),
                resolve(user) {
                    return knex('hasRead').where('userId', user.id);
                }
            }
        }
    }
});


const BookType = new graphql.GraphQLObjectType({
    name: 'Book',
    fields : {
        id: {
            type: graphql.GraphQLID,
            resolve(book) {
                return book.id;
            }
        },
        title: {
            type: graphql.GraphQLString,
            resolve(book) {
                return book.title;
            }
        },
        author: {
            type: graphql.GraphQLString,
            resolve(book) {
                return book.author;
            }
        }
    }
});

const HasReadType = new graphql.GraphQLObjectType({
    name: 'HasRead',
    fields: {
        rating: {
            type: graphql.GraphQLInt,
            resolve(hasRead) {
                return hasRead.rating;
            }
        },
        book: {
            type: BookType,
            resolve(hasRead) {
                return knex('book').where('id', hasRead.bookId).first();
            }
        }
    }
});

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: {
        users: {
            type: new graphql.GraphQLList(UserType),
            resolve() {
                return knex('user');
            }
        },
        books: {
            type: new graphql.GraphQLList(BookType),
            resolve() {
                return knex('book');
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({query: queryType});

module.exports = schema;