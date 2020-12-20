"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const paymentDetailSchema = new Schema({
    referenceNumber   : String , 
    receiptNumber    : String , 
    paymentDetail   : String,  
    amount : Number 
})
module.exports = mongoose.model("paymentDetail" , paymentDetailSchema)