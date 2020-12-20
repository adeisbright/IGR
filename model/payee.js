const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const taxPayerSchema = new Schema({ 
    name : String , 
    stateTin: String , 
    federalTin : String , 
    contactEmail: String , 
    contactPhoneNumber : String , 
    houseNumber : String , 
    street : {
        type : Schema.Types.ObjectId , 
        ref : "street"
    }  , 
    residentialAddress : String ,  
    identification : {
        identificationMeans : String , 
        identificationNumber  :String ,  
        incomeSource : String
    } , 
    loginDetails : {
        userName : String , 
        email : String , 
        password : String
    } , 
    businessInformation : {
        registrationNumber : String , 
        businessSector : String , 
        commencementDate : Date , 
        yearlyTurnover : Number
    } , 
    isIndividual : Boolean , 
    isValidated : {
        type : Boolean  , 
        default : false
    } , 
    isApproved : {
        type : Boolean  , 
        default : false
    } , 
    registrationToken : String , 
    tokenExpires : Date  , 
    loginEmail : String
}) 

module.exports = mongoose.model('payee' , taxPayerSchema)