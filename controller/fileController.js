// File management Module 
const fs        = require("fs")
const multer    = require("multer") 
const path      = require("path") 
const currentPath       = __dirname 
const directoryName     = path.dirname(currentPath) 
// Handling Upload for admin 
let adminStorage = multer.diskStorage({
    destination : function(req , file , cb) {
		cb(null ,  path.join(directoryName, '/public/uploads/'))
	} , 
	filename : function(req , file , cb) {  
		let date = new Date().getDate() 
	    let fileName =   `${req.session.userName}-${date}-${file.originalname}`  
		cb(null , fileName) 
	}
}) 
let userStorage = multer.diskStorage({
    destination : function(req , file , cb) {
		cb(null ,  path.join(directoryName, '/public/uploads/'))
	} , 
	filename : function(req , file , cb) {  
		let date = new Date().getDate() 
	    let fileName =   `${req.session.email}-${date}-${file.originalname}`  
		cb(null , fileName) 
	}
}) 
let categoryStorage = multer.diskStorage({
    destination : function(req , file , cb) {
		cb(null ,  path.join(directoryName, '/public/uploads/'))
	} , 
	filename : function(req , file , cb) {    
		let date = new Date().getDate() 
	    let fileName =   `${req.session.userName}-${date}-${file.originalname}`  
		cb(null , fileName) 
	}
}) 
let generatorStorage = multer.diskStorage({
    destination : function(req , file , cb) {
		cb(null ,  path.join(directoryName, '/public/uploads/'))
	} , 
	filename : function(req , file , cb) {  
		let date = new Date().getDate() 
	    let fileName =   `${date}-${file.originalname}`  
		cb(null , fileName) 
	}
}) 
exports.upload      = multer({storage : adminStorage }) 
exports.userUpload  = multer({storage : userStorage})
exports.categoryUpload  = multer({storage : categoryStorage}) 
exports.generatorUpload = multer({storage : generatorStorage})