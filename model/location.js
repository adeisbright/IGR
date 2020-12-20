"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const locationSchema = new Schema({ 
    name : String ,  
    lga : {
        type : Schema.Types.ObjectId , 
        ref : "lga"
    }
}) 
module.exports = mongoose.model('location' , locationSchema)