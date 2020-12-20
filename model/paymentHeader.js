"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const paymentHeaderSchema = new Schema({
    receiptNumber     : String , 
    paymentDate       : Number , 
    payDate : Date , 
    customerIdentifier : {
        type : Schema.Types.ObjectId , 
        ref : "members"
    } , 
    companyIdentifier : {
        type : Schema.Types.ObjectId , 
        ref : "companies"
    } ,
    fundAccount : {
        type : Schema.Types.ObjectId ,  
        ref : "generalAccount"
    } ,  
    categoryAccount : {
        type : Schema.Types.ObjectId , 
        ref : "categoryaccount"
    } , 
    paymode : String , 
    branchOffice : String , 
    applicationNumber : String,
    
    paymentDetail   : String, 
    transactionAmount       : Number , 
    amount : Number  , 
    journalCode : String
})
module.exports = mongoose.model("paymentHeader" , paymentHeaderSchema)