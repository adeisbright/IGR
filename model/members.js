const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const memberSchema = new Schema({
	companyIdentifier : {
        type : Schema.Types.ObjectId , 
        ref : "companies"
    } , 
    userName : String , 
    cooperativeNumber : String, 
    password : String,
    firstName : String , 
    lastName : String , 
    phoneNumber : String , 
    email : String , 
    gender : String , 
    dateOfBirth : Date,
    accountStatus : {type : String , default : "pending" , 
    enum : ["approved" , "pending"  , "declined" , "suspended" , "blocked"]} ,
    address : {
        country : {type : String, default : "Nigeria"}, 
        state : String , 
        contactAddress : String
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
    logins : [] , 
    uploads : [{
        name : String , 
        category : String , 
        dateUploaded : { type : Date , default : Date.now() }, 
        _id : false
    }] , 
    profilePicture : String , 
    verified : {type : Boolean, default : false},
    dateRegistered : Date,
    token : String , 
    accountBalance : {
        type : Number , 
        default : 0
    }
}) 
//The model 
module.exports = mongoose.model('members' , memberSchema)