"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const lgaSchema = new Schema({ 
    name : String , 
}) 
module.exports = mongoose.model('lga' , lgaSchema)