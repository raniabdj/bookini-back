const mongoose = require("mongoose");
const {Schema} = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
const mongoosePaginate = require('mongoose-paginate-v2');
var reservationSchema = new Schema({

    date: {
        type: Date,
        default: Date.now(),
    },
    userId: {
        type: ObjectId,
        required: true,
    },
    bookId:{
        required: true,
        type:ObjectId,
    },


})
reservationSchema.plugin(mongoosePaginate);
const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = {Reservation};

