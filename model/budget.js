"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const budgetSchema = new Schema({ 
    name : String , 
    account : {
        type : Schema.Types.ObjectId , 
        ref : "generalAccount"
    }  , 
    year : String , 
    monthlyAllocations : []
}) 

//! Export our model as a module to other functionalities   
module.exports = mongoose.model('budget' , budgetSchema)