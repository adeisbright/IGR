"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const streetSchema = new Schema({
    name     : String , 
    
    location: {
        type : Schema.Types.ObjectId , 
        ref : "location"
    } 
}) 
module.exports = mongoose.model("street" , streetSchema)