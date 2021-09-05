const mongoose = require("mongoose");
const {Schema} = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');
var bookSchema = new Schema({

    title: {
        type: String,
        required: true,
        default: '',

    },
    author: {
        type: String,
        required: true,
        default: '',

    },
    copies:{
        required: true,
        type:Number,
        default: 0,
    },
    detail: {
        type:String
    },
    rating: {
        type:Number
    }


})
bookSchema.plugin(mongoosePaginate);
const Book = mongoose.model("Book", bookSchema);
module.exports = {Book};

