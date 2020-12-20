/** 
  * Design the schema and the model for the course document 
*/
  
const mongoose = require('mongoose') 
const Schema   = mongoose.Schema 
/**
  * Design the schema for the exam 
  
*/

const ProductSchema = new Schema({
    productName : String ,   
    processingType : String , 
    description : String , 
    productType : String , 
    productCode : String , 
    interestRate : Number , 
    company : {
      type : Schema.Types.ObjectId , 
      ref  : 'Company'
    } 
})

/**
 * Export the model that will be used for creating Examiner document 
*/ 

module.exports = mongoose.model('Product' , ProductSchema)
 