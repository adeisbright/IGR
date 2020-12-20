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

const typeSchema = new Schema({
    typeName : String , 
    typeCode: String , 
    typeDescription : String 
})
//! Export our model as a module to other functionalities   
module.exports = mongoose.model('accountType' , typeSchema)
