const express = require("express")
const router = express.Router() 
const TaxedUserController = require("../controller/taxUserController") 
const FileController = require("../controller/fileController")

router.get("/" , TaxedUserController.getIndex) 
router.get("/register" , TaxedUserController.getRegistration) 
router.post("/register" , TaxedUserController.handleCreatePayee) 
router.get("/success" , TaxedUserController.getVerification)
router.get("/login" , TaxedUserController.getLogin )
router.post("/login" , TaxedUserController.handleLogin )
router.get("/dashboard" , TaxedUserController.isLogin , TaxedUserController.getUserDashbaord) 
router.get("/logout" , TaxedUserController.handleLogout) 
router.get("/dashboard/profile" , TaxedUserController.getUserProfile) 

module.exports = router 
