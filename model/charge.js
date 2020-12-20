"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const chargeSchema = new Schema({ 
    amount : Number  , 
    balance : Number , 
    covers : String ,  
    amountPaid : {
        type : Number , 
        default : 0
    } , 
    payer : {
        type : Schema.Types.ObjectId , 
        ref : "payee"
    } ,  
    revenueHead : {
        type : Schema.Types.ObjectId , 
        ref : "revenuehead"
    } , 
    status : {
        type : Boolean , 
        default : false
    } , 
    dateGenerated : {
        type : Date , 
        default : Date.now()
    } , 
    periodDate : Date , 
    dateCreated : {
        type : Date , 
        default : Date.now()
    } , 
    from : Date , 
    to  : Date , 
}) 
module.exports = mongoose.model('charge' , chargeSchema)