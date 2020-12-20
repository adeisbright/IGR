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

const journalSchema = new Schema({
    companyCode : {
        type : Schema.Types.ObjectId , 
        ref : "Company"
    } ,  
    journalCode : String , 
    description : String 
})
//! Export our model as a module to other functionalities   
module.exports = mongoose.model('journal' , journalSchema) 
