"use strict"
/**
 * companySchema - A schema that describes the schema structure for our companies model
 * Require important library 
 */ 
const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const taxPayerSchema = new Schema({ 
    surName : String , 
    firstName : String , 
    middleName : String , 
    mobileNumber : String , 
    email : String , 
    homeAddress : String , 
    birthDate : String , 
    gender : String , 
    taxIdentificationNumber : String , 
    nationality : String , 
    avatar : String , 
    lastTaxPaid : [{
        year : String , 
        amount : Number 
    }] ,
    businessType : String , 
    payerIdentifier : String , 
    payerGroup : String , 
    companyName : String , 
    companyEmail : String , 
    contactPerson : String , 
    contactNumber : String 
}) 

module.exports = mongoose.model('taxpayer' , taxPayerSchema)