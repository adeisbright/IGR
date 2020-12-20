"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const ledgerSchema = new Schema({
    ledgerName : String , 
    ledgerCode : String , 
    ledgerDescription : String
}) 
/** Query Helpers  */ 
/** Virtual Properties */ 
/** Instance Methods */ 
/** Static Methods */ 
module.exports = mongoose.model('generalLedger' , ledgerSchema)
