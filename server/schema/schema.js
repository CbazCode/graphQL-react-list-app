import graphql from 'graphql'
import _ from 'lodash'
import Author from '../models/author.js'
import Book from '../models/book.js'


const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLInt, 
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql


//1. Define types
const BookType = new GraphQLObjectType({
    name: 'Book',
    //Inside the function because avoid errors for the AuthorType's declaration after of this (Author typw is not defined)
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        //2. Define relationship between each type
        author:{ 
            type: AuthorType,
            resolve(parent, args){
                //parent = { name: '....', genre: '...', id: '..', authorId: '..' } (objeto del id definido a la hora de llamar a un libro por id)
                //return _.find(authors, {id:parent.authorId})
                return Author.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books:{
            //list of books of one author
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return _.filter(books,{authorId: parent.id})
                return Book.find({authorId: parent.id})
            }
        }
    })
})

//3. Define routes queries: how we describe that a user can initially jump into the graph and grab data
const RootQuery =  new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book:{ //name of the query
            type: BookType,
            //Parameters the are passed in query
            args:{ id: { type: GraphQLID } },
            resolve(parent, args){
                //code to get data from db / other source
                //return _.find(books,{ id: args.id })
                return Book.findById(args.id)
            }
        },
        /* 
            Ex query:
            book (id:'123'){
                name
                genre
            } 
        */
        author:{ //name of the query
            type: AuthorType,
            //Parameters the are passed in query
            args:{ id: { type: GraphQLID } },
            resolve(parent, args){
                //code to get data from db / other source
                //return _.find(authors,{ id: args.id })
                return Author.findById(args.id)
            }
        },

        books:{ 
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return books' data
                //return books
                return Book.find()
            }
        
        },
        /**
         * How we set and relationship between author and book we also do 
         * {
                books{
                    name
                    author{
                    name 
                    age
                    }
                }
            }
         */
        authors:{ 
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find()
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{ 
        addAuthor: {
            type: AuthorType,
            //Data sended from the frontend
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args){
                let author = new Author({
					name: args.name,
					age: args.age,
				});
				return author.save();
            }
        },
        addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args) {
				let book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId,
				});
				return book.save();
			},
		},

        /**
         * called mutation from graphiql
         * mutation{
         *  addAuthor(name:"Shaun", age:30){
         *      name
         *      age
         *  }
         * }
         */
    }
})

export default new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
