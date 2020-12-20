"use strict"

const mongoose = require("mongoose") 
const Schema = mongoose.Schema 
const propertySchema = new Schema({
    name     : String , 
    description : String , 
    chargeRate : Number
}) 
module.exports = mongoose.model("property" , propertySchema)