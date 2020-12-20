const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const administratorSchema = new Schema({
    userName : String , 
    password : String , 
    email : String , 
    profile : String ,
    role : String ,
    addedBy : String , 
    phoneNumber : String , 
    dateAdded : {
        type : Date , 
        default : Date.now()
    } ,  
    age : Number , 
    address : {
        country : String , 
        state : String , 
        province : String , 
        street : String , 
        zipCode : String
    } ,
    adminCode : String,
}) 

//The model 
module.exports = mongoose.model('taxadmin' , administratorSchema) 

//The account details for admins may not be necessary