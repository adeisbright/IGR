'use strict' 
/**
  *Module dependencies 
**/ 

const mongoose = require('mongoose') 
const Schema   = mongoose.Schema 
/**
 *
 * userSchema describes how user documents 
*/

const periodSchema = new Schema({
    companyCode : {
        type : Schema.Types.ObjectId , 
        ref : "companies"
    } , 
    periodNumber : Number ,
    periodStart : Date , 
    periodEnd : Date
})
//! Export our model as a module to other functionalities   
module.exports = mongoose.model('period' , periodSchema)