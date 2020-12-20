"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const accountSchema = new Schema({
    ledgerCode : String , 
    accountName : String , 
    accountNumber : String ,  
    availableBalance : Number , 
    previousBalance : Number, 
    openingBalance : Number , 
    debitValue : Number , 
    creditValue : Number , 
    accountStatus : String , 
    accountReceivable : {
        type : Boolean , 
        default : false
    } , 
    bank : {
        type : Boolean , 
        default : false
    } ,
    userGroup : String
}) 
/** Query Helpers  */ 
/** Virtual Properties */ 
/** Instance Methods */ 
/** Static Methods */ 
module.exports = mongoose.model('generalAccount' , accountSchema)