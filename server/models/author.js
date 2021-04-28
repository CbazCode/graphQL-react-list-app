import mongoose from 'mongoose'

const authorSchema =  new mongoose.Schema({
    name:String,
    age:Number
});
const Author = mongoose.model("Author",authorSchema);

export default Author;