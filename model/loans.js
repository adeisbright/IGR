"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const loanSchema = new Schema({
    companyIdentifier : {
        type : Schema.Types.ObjectId , 
        ref : "companies"
    } , 
    productName : String , 
    productCode : String  , 
    processingType : String , 
    description : String , 
    interestAccount : {
        type : Schema.Types.ObjectId , 
        ref : "generalAccount"
    } , 
    principalAccount : {
        type : Schema.Types.ObjectId , 
        ref : "generalAccount"
    } , 
    minimumAmount : Number , 
    maximumAmount : Number , 
    minimumPeriod : Number , 
    maximumMPeriod : Number , 
    productStart : Date , 
    productEnd : Date , 
    currency : String , 
    interestRate : Number , 
    penalty : {
        penaltyType : String , 
        penaltyRate : Number
    }
}) 
/** Query Helpers  */ 
/** Virtual Properties */ 
/** Instance Methods */ 
/** Static Methods */ 
module.exports = mongoose.model('companyloan' , loanSchema)