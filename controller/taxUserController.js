const sgMail = require('@sendgrid/mail') 
sgMail.setApiKey(process.env.SendGrid_Pass) 
const LGA   = require("../model/lga") 
const { v4: uuidv4 }  = require('uuid'); 
const Payee = require("../model/payee") 
const TaxPayer = require("../model/taxpayer")  
const Street = require("../model/street") 
const AccountNumberGenerator = require("../controller/accountGenerator") 
const bcrypt    = require('bcryptjs') 
const FileHandler = require("./file") 
const Paystack    =  require("paystack-node"); 
const Charge = require('../model/charge');
const PaystackKey = process.env.PayStack_Pass 
const environment = process.env.NODE_ENV 

const metaDescription = "The description" 
const siteUrl = "https://igr.com" 
const siteTagline = "Automating tax process" 
const siteName = "IGR"
const paystack = new Paystack(PaystackKey , environment)  


class App {

    getIndex = async (req , res) => {
        try {  
            req.session.ip = req.ip 

            res.render("index" , {
                appUser : "ADELEKE" , 
                metaDescription : "Tax Revenue Portal" , 
                metaKeyword : "Tax acceptance , tax avoidance"  
            })
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getRegistration = async (req , res) => {
        try {  
            //req.session.ip = req.ip 
            let streets = await Street.find({}) || []   
            let lgas = await LGA.find({}) || []  
            res.render("register" , {
                title : "IGR : Register" , 
                metaDescription : "IGR is an automated Internal Revenue Management System for handling the operations of the IGR department for any organization" , 
                metaKeyword : "IGR , Revenue , Bills , Taxes" ,
                streets : streets , 
                lgas : lgas
            })
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    handleCreatePayee = async (req , res) => {
        try { 
            if (req.body.isIndividual){ 
                const {
                    individualContactEmail , individualPhone , userName , 
                    userEmail , houseNumber , street ,
                    individualIdentity , individualName , 
                    userIncomeSource , userPassword , identityNumber 
                } = req.body 

                let isPayee = await Payee.find({ 
                    $or : [{
                        contactEmail : individualContactEmail , 
                        contactPhoneNumber : individualPhone , 
                        loginDetails : {
                            userName : userName , 
                            email : userEmail
                        }
                    }]
                }) 
                if(isPayee.length == 0){ 
                    let pass = await bcrypt.hash(userPassword , 10) 
                    let date = new Date() 
                    date.setHours(date.getHours() + 24) 
                    let tokenWillExpire = date  
                    let theToken = uuidv4() 
                    let payees = await Payee.find({})
                    let localTin = AccountNumberGenerator(payees,  "000000000001" ,  "stateTin" , 1 , 12 ) 
                    // Create the payee
                    let payee  =  await new Payee({
                        name : individualName , 
                        stateTin : localTin , 
                        registrationToken :  theToken , 
                        tokenExpires : tokenWillExpire.getTime() , 
                        contactEmail : individualContactEmail , 
                        contactPhoneNumber : individualPhone , 
                        houseNumber : houseNumber , 
                        street : street , 
                        identification : {
                            identificationMeans : individualIdentity , 
                            identificationNumber  :identityNumber , 
                            incomeSource : userIncomeSource
                        } , 
                        loginDetails : {
                            userName : userName , 
                            email : userEmail , 
                            password : pass
                        } , 
                        loginEmail : userEmail , 
                        isIndividual : true
                    }) 
                    let savePayee = await payee.save() 
                    if (savePayee){ 
                        const message = name => {
                            let m  = 
                            `   <body style="font-family:sans-serif;font-size:16px;">
                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:seperate;
                                width:100%;">
                                    <tr style="padding:3rem;vertical-align:top;background:#f2f2f2;margin-bottom:2.8rem;text-align:center;font-size:1.4rem">
                                        <td style="padding:40px;text-align:center;border;none;margin-bottom:30px">IGR</td>
                                    </tr>
                                    <tr style="padding:0.85rem';margin-bottom:50px">
                                        <td style="line-height:1.6;font-size:1rem"> Welcome to IGR @${name}!</td> 
                                        
                                    </tr>
                                    <tr style="padding:0.85rem';margin-bottom:2.85rem">
                                       <td style="line-height:1.6;font-size:1rem">
                                           Thank you for registering. IGR will help you to make fast , 
                                           and timely clearances for your tax
                                       </td>
                                    </tr>
                                    
                                    <tr style="padding:0.85rem';margin-bottom:.85rem;>
                                        <td style="margin-bottom:1rem;border:8px solid black">
                                            <p style="margin-bottom:0.5rem">
                                                <a href="http://localhost:4500/verification?email=${userEmail}&token=${theToken}&expires=${tokenWillExpire.getTime()}" style="color:#339;text-decoration:none;font-size:0.75rem;">
                                                  Verify your account 
                                                </a>
                                            </p>
                                           
                                    </tr>
                                    <tr style="background:#f2f2f2;text-align:center">
                                        <td style="margin-bottom:1rem">
                                           <p> Email Preference</p> 
                                           <p style="margin-bottom:0.7rem"> 
                                              <a href="#" style="text-decoration:none;color:blue;margin-right:3px">Terms</a>
                                              <a href="#" style="text-decoration:none;color:blue;margin-right:3px">Privacy Policy</a>
                                              <a href="#" style="text-decoration:none;color:blue;margin-right:3px">Unsubscribe</a>
                                              <a href="https://bigjara.com/login" style="text-decoration:none;color:blue;"> Login</a>
                                            </p>
                                           <p> Bigjara , 36 Doyin Omololu Street , Alapere-Ketu , Lagos</p>
                                    </tr>
                               ` 
                            return m 
                        }
                        const options = {
                            to : userEmail, 
                            from: 'IGR<recruitment@aceafrica.net>',
                            subject : "Welcome to Bigjara" , 
                            html : message(userName)
                        }
                        sgMail.send(options) 
                        res.json({
                            ework : true , 
                            message : `Hello , ${userName} your registration was successful` 
                        })
                    }else {
                        throw new Error()
                    }
                }else {
                    res.json({
                        message : "Part of the information you provide already belongs to an existing account. Try changing your username , and other unique data "
                    })
                }
            }else if (req.body.isCorporate){
                res.json({
                    message : "You are trying to register a corporate body"
                }) 
            }
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    getVerification = async (req , res) => {
        res.render("verification" , {
            appUser : "ADELEKE" , 
            metaDescription : "Tax Revenue Portal" , 
            metaKeyword : "Tax acceptance , tax avoidance",
            title: "Verify your account"
        })
    }

    getEmailConfirmation = async (req  , res) => {
        try {
            if (req.query.email){ 
                let {email , token , expires} = req.query
                let payee = await Payee.findOne({
                    registrationToken : token
                }) 
                let date = new Date() 
                console.log(payee)
                if (payee && token &&  date.getTime() <= expires ){ 
                    await Payee.findByIdAndUpdate(payee._id , 
                        {isValidated : true} , {
                            useFindAndModify : false , new : true
                    })
                    req.session.user = payee.loginEmail
                    res.render("email-confirmation" , {
                        title : "Bigjara : Confirm Email" , 
                        metaDescription : metaDescription, 
                        metaKeywords : "Bigjara , software development , computing firm in Lagos , digital skills" , 
                        siteUrl : siteUrl , 
                        siteTagline :  siteTagline , 
                        siteName : siteName , 
                        ogDescription : siteTagline, 
                        ogImage : "/images/logo.png"
                    })
                }else {
                    res.render("email-confirmation" , {
                        title : "Bigjara : Confirm Email" , 
                        message : "Please contact the admin for help" , 
                        metaDescription : metaDescription, 
                        metaKeywords : "Bigjara , software development , computing firm in Lagos , digital skills" , 
                        siteUrl : siteUrl , 
                        siteTagline :  siteTagline , 
                        siteName : siteName , 
                        ogDescription : siteTagline, 
                        ogImage : "/images/logo.png"
                    })
                }
            }
        }catch(error){
            res.json({
                message  : error.message 
            })
        }
    }
    getLogin = async (req ,res) => {
        try {  
            res.render("user-login" , {
                title : "User Login" , 
                appUser : "ADELEKE" , 
                metaDescription : "Tax Revenue Portal" , 
                metaKeyword : "Tax acceptance , tax avoidance"
            })
        }catch(error){
            res.json({
                message : error.message
            })
        } 
    } 

    isLogin = async (req ,res  , next) => {
        try {
            if (req.session.user_email){
                next()
            }else {
            res.redirect("/login")
            }
        }catch(erorr){
            res.json({erorr : erorr.message})
        }
    }
    
    handleLogin = async (req , res) => { 
        try { 
            const {email , password} = req.body.data 
            console.log(email , password)
            const payee = await Payee.findOne({ loginEmail : email})
            if(payee){ 
                console.log(payee.loginDetails.password)
                let isValidPayee = await bcrypt.compare(password , payee.loginDetails.password)
                if (isValidPayee){ 
                    req.session.user_email = email
                    res.json({
                       efine : true
                    })
                }else {
                    throw new Error()
                }
            }else {
               throw new Error("Provide valid credentials") 
            }
        
        }catch(error) {
            res.json({error : error.message})
        }
    }
    
    handleLogout = (req ,res) => {
       delete req.session.user_email
       res.redirect("/login")
    }

    handleCreateIndividual = async (req ,res) => {
        try {
            const {surName , firstName , middleName , phone , email , 
                address , dob , gender , payerId , 
                nationality , businessType , submit , rate} = req.body 
            if (req.file){ 
                let date = new Date().getDate()
                let fileName =   `${date}-${req.file.originalname}`  
                let payers = await TaxPayer.find({}) 
                let TIN = AccountGenerator(payers , "0000000001" , "payerIdentifier" , 1 , 10 ) 
                // A unique Tax Identification Number needs to be created , and sent to the user 
                let individual = await new TaxPayer({ 
                    surName : surName , 
                    firstName : firstName , 
                    middleName : middleName , 
                    mobileNumber : phone , 
                    email : email , 
                    payerGroup : "i" , 
                    payerIdentifier : TIN , 
                    homeAddress : address , 
                    birthDate : dob , 
                    gender : gender , 
                    avatar : fileName , 
                    })
                let saveIndividual = await individual.save() 
                if (saveIndividual){
                    FileHandler.createDirectory("./public/avatars")  
                    FileHandler.moveFile(fileName , "./public/uploads" , "./public/avatars")
                    // res.json({
                    //     message : `Upload success` , 
                    //     details : req.body
                    // })
                    res.redirect("/payers")
                }else {
                    throw new Error()
                }
            }else {
                throw new Error()
            }
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getUserDashbaord = async (req , res) => {
        try { 
            const payee = await Payee.findOne({ loginEmail : req.session.user_email}) 
            let invoices = await  Charge.find({payer : payee._id}).populate("revenueHead") 
            console.log(invoices)
            res.render("user-dashboard" , {
                appUser : "ADELEKE" ,  
                user : payee , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" ,  
                invoices : invoices,
                title: 'Dashboard'
            }) 
        }catch(error){
            res.json({message : "Wahala dey"})
        }
    }

    getUserProfile = async (req , res) => {
        try { 
            const payee = await Payee.findOne({ loginEmail : req.session.user_email}) 
            res.render("user-profile" , {
                title : "User Profile Page"  , 
                user : payee 
            })
        }catch(error){

        }
    }
}

module.exports = new App() 

