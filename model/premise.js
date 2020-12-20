"use strict"

const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const premiseSchema = new Schema({
    premiseNumber     : Number ,  
    propertyIdentifier : {
        type : Schema.Types.ObjectId , 
        ref : "property"
    } , 
    ownerIdentifier : {
        type : Schema.Types.ObjectId , 
        ref : "taxpayer"
    }
}) 
module.exports = mongoose.model("premise" , premiseSchema)