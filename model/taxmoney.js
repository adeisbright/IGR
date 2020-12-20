"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const paymentSchema = new Schema({ 
    amount : Number  , 
    covers : String ,  
    payer : {
        type : Schema.Types.ObjectId , 
        ref : "taxpayer"
    } , 
    revenueHead : {
        type : Schema.Types.ObjectId , 
        ref : "revenuehead"
    } , 
    account : {
        type : Schema.Types.ObjectId , 
        ref : "generalAccount"
    } ,  
    paymentWay : {
        type : String , 
        default : "F"
    } , 
    status : {
        type : Boolean , 
        default : false
    } , 
    datePaid : {
        type : Date , 
        default : Date.now()
    } , 
    paymentCode : String ,
    receipt : String 
}) 
module.exports = mongoose.model('taxmoney' , paymentSchema)