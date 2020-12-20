const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const employeeSchema = new Schema({
	companyIdentifier : {
        type : Schema.Types.ObjectId , 
        ref : "companies"
    } , 
    userName : String , 
    cooperativeNumber : String , 
    firstName : String , 
    lastName : String , 
    phoneNumber : String , 
    email : String , 
    gender : String , 
    address : {
        country : String , 
        state : String , 
        location : String
    } , 
    maritalStatus : String , 
    workProfile : {
        occupation : String , 
        ministry : String , 
        agency : String , 
        currentSalary : String , 
        workAddress : String
    } , 
    nextOfKin : {
        firstName : String , 
        lastName : String , 
        email : String , 
        phoneNumber : String , 
        address : {
            country : String , 
            state : String , 
            location : String
        } , 
        relationShip : String , 
        profilePicture : String
    } , 
    contributionAmount : Number , 
    memberId : String , 
    medicalStatus : String , 
    controlAccount : {
        type : Schema.Types.ObjectId , 
        ref : "generalAccount"
    } , 
    bankDetail : {
        bankName : String , 
        accountNumber : String , 
        bvn : String
    } , 
    lastLoginIP : String , 
    uploads : [{
        name : String , 
        category : String , 
        dateUploaded : Date , 
        _id : false
    }] , 
    verification : {
        type : String , 
        verifcationNumber : String , 
        status : String
    } , 
    dateRegistered : Date , 
    role : String ,
}) 
//The model 
module.exports = mongoose.model('employee' , employeeSchema)