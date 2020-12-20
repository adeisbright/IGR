/** 
  * Design the schema and the model for the course document 
*/
  
const mongoose = require('mongoose') 
const Schema   = mongoose.Schema 
/**
  * Design the schema for the exam 
  
*/

const LoanApplicationSchema = new Schema({
    applicationNumber      : String ,   
    productCode            : String , 
    productIdentifier : {
      type : Schema.Types.ObjectId , 
      ref  : 'companyloan'
    } , 
    applicantCode          : String , 
    applicantIdentifier : {
      type : Schema.Types.ObjectId , 
      ref  : 'members'
    } , 
    dateApplied            : {type : Date , default : Date.now()} ,
    amountApplying         : Number ,  
    duration               : Number , 
    repaymentStartDate     : Date , 
    amountApproved         : Number , 
    dateApproved           : Date , 
    approvedBy             : String , 
    totalDisbursed         : Number , 
    disbursedBby           : String , 
    repaymentEndDate       : Date ,  
    repayMentStarted       : Date , 
    accountNumber          : String,
    applicantAccountNumber : String,
    status                 : {type : Boolean , default : false},
    decline                : {type : Boolean , default : false},
	  companyIdentifier       : {
		                           type : Schema.Types.ObjectId , 
		                           ref  : 'Company'
                              } ,
    interestDue             : Number , 
    totalReceivable         : Number , 
    monthlyReceivable       : Number  , 
    totalPrincipalAlreadyPaid     : Number , 
    totalInterestAlreadyPaid       : Number ,
})

/**
 * Export the model that will be used for creating Examiner document 
*/ 

module.exports = mongoose.model('LoanRequest' , LoanApplicationSchema)
 