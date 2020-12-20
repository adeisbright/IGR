/**
 * @description accountNumberGenerator generates unique account numbers for 
 *              different users of our application 
 * @param {Array}  collection   An array of user objects returned from our query
 * @param {String} currentValue Original Value of the property used to define our users 
 * @param {String} property     The field to use as our searching criteria for increment
 * @param {Number} increment    Determines the magnitude of successive increase/decrease to current value 
 * @param {Number} padLength    Acceptable length for our accounts 
 * @return { String} newAccountNumber The newly created account Number 
 */ 
const accountNumberGenerator  =  (collection , currentValue , property , increment , padLength ) => {
    try {
        let newAccountNumber
        if (Array.isArray(collection)){
            if (collection.length !== 0){
                let lastRecord =  collection[collection.length - 1][property] 
                let charAtZero = lastRecord.charAt(0) 
                if (typeof charAtZero === "string") {
                    lastRecord = Number(lastRecord.slice(1 , lastRecord.length))
                } 
                newAccountNumber = (String(lastRecord + increment)).padStart(padLength, "0")
                return newAccountNumber
            }else {
                newAccountNumber = currentValue 
                return newAccountNumber
            }
        }else {
            throw new Error("Provide an array of records")
        }
    }catch(error){
        return error
    }
} 
module.exports = accountNumberGenerator