const AccountNumberGenerator = require("./accountGenerator")
const sgMail                 = require('@sendgrid/mail') 
sgMail.setApiKey(process.env.SendGrid_Pass) 
const GeneralLedger = require('../model/generalLedger') 
const DetailAccount   = require("../model/accountDetail") 
const bcrypt    = require('bcryptjs') 
const Admin = require("../model/admin")
const Tax   = require("../model/tax") 
const LGA   = require("../model/lga") 
const Location  = require("../model/location") 
const Street = require("../model/street") 
const Payer = require("../model/payer") 
const Payee = require("../model/payee") 
const Penalty = require("../model/penalty") 
const TaxPayer = require("../model/taxpayer") 
const RevenueHead = require("../model/revenuehead") 
const Charge  = require("../model/charge") 
const Payment  = require("../model/payment") 
const Budget    = require("../model/budget")  
const Property  = require("../model/property") 
const Premise   = require("../model/premise") 
const FileHandler            = require("./file") 
const Paystack    =  require("paystack-node") 
const PaystackKey = process.env.PayStack_Pass 
const environment = process.env.NODE_ENV 

const paystack = new Paystack(PaystackKey , environment) 

class App {

    getAdminLogin = async (req , res) => {
        const admin = await Admin.find({})
        if (admin.length > 0){
            res.render("admin-login" , {
                appUser : "ADELEKE" ,  
                user : "Jon" ,  
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" ,
            }) 
        }else{
            res.redirect(303, '/admin/new')
        } 
    } 

    getAdminRegister = async (req , res) => {
        const admin = await Admin.find({})
        if (admin.length == 0){
            res.render("admin-register" , {
                appUser : "ADELEKE" ,  
                user : "Jon" ,  
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" ,
            }) 
        }else{
            res.redirect(303, '/admin')
        } 
    } 

    postAdmin = async (req , res , next) => { 
        try {
            let admin = await Admin.findOne({email: req.body.email})
            if(admin){
                let validAdmin = await bcrypt.compare(req.body.password , admin.password)
                if(validAdmin){
                    req.session.admin_email = admin.email
                    res.redirect('/admin/dashboard')
                }else{
                    res.render("admin-login" , {
                        appUser : "ADELEKE" ,  
                        user : "Jon" ,  
                        metaDescription : "A basic investment application" , 
                        metaKeyword : "Investment , Cash money , Make money" ,
                        error: 'Invalid login details'
                    }) 
                    return
                }
            }else{
                res.render("admin-login" , {
                    appUser : "ADELEKE" ,  
                    user : "Jon" ,  
                    metaDescription : "A basic investment application" , 
                    metaKeyword : "Investment , Cash money , Make money" ,
                    error: 'Invalid login details'
                })
                return 
            }  
        }catch(err){
            console.log(err)
            res.json({erorr : err.message})
        }
    }

    isLogin = async (req ,res  , next) => {
        try {
            if (req.session.admin_email){
                next()
            }else {
            res.redirect("/admin")
            }
        }catch(erorr){
            res.json({erorr : erorr.message})
        }
    }

    postNewAdmin = async (req , res , next) => { 
        try{
            const {email, password, username, mobile} = req.body
            
            const adminPass = await bcrypt.hash(password , 10)
            const admin = await new Admin({
                userName: username,
                email: email,
                password: adminPass,
                phoneNumber: mobile,
                role: 'superAdmin'
            })
            const saveAdmin = await admin.save()
            if ( saveAdmin ) { 
                res.json({
                    ework : true , 
                    message : `Hello , ${username} your registration was successful` 
                })
            }else{
                throw{
                    message : "Unable to save the admin"
                }
            }
        }catch(err){
            res.json({
                message : error.message
            })
        }
    }

    getAdminDashboard = async ( req , res) => {
        try {
            const admin = await Admin.findOne({email: req.session.admin_email})
            res.render("admin-dashboard" , {
                appUser : "ADELEKE" ,  
                user : "Jon" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" ,
                admin : admin,
                dash_active: 'active',
                title: 'Dashboard'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    handleLogout = (req ,res) => {
        delete req.session.admin_email
        res.redirect("/admin")
    }

    getAccountSetup =  async (req , res) => { 
        try {
            let ledgers = await GeneralLedger.find({}) || [] 
            let accountDetails = await DetailAccount.find({}) || []  
            console.log(ledgers) 
            //console.log(accountDetails)
            res.render("tax-accounts" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                ledgers : ledgers , 
                accounts : accountDetails,
                title: 'Account Setup'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    postLedgers = async (req, res, next) => {
        try{
            let generalLedger = await GeneralLedger.find()
            if(generalLedger.length > 1){
                res.render("ledger-status" , {
                    appUser : "ADELEKE" ,  
                    admin : "Ade" , 
                    metaDescription : "A basic investment application" , 
                    metaKeyword : "Investment , Cash money , Make money" , 
                    message : "General Ledger is already set-up and ready for used by cooperatives",
                    title: 'General Ledger'
                })
            }else{
                const g  = [{
                    ledgerName : "Liablilities" , 
                    ledgerCode : "L", 
                    ledgerDecription : "Depletor"
                } , {
                    ledgerName : "Expenses" , 
                    ledgerCode : "E", 
                    ledgerDecription : "Expenses"
                } , 
                {
                    ledgerName : "Reserve" , 
                    ledgerCode : "Q", 
                    ledgerDecription : "Bonds"
                } , 
                {
                    ledgerName : "Revenue" , 
                    ledgerCode : "R", 
                    ledgerDecription : "Income Generation"
                }   , 
                {
                    ledgerName : "Assets" , 
                    ledgerCode : "A", 
                    ledgerDecription : "On hand"
                }  
                ]
                GeneralLedger.insertMany(g , (err , docs) => {
                    if (err) {
                        throw new Error("Error")
                    }
                    res.render("ledger-status" , {
                        appUser : "ADELEKE" ,  
                        admin : "Ade" , 
                        metaDescription : "A basic investment application" , 
                        metaKeyword : "Investment , Cash money , Make money" , 
                        message : "General Ledger is already set-up and ready for used by cooperatives",
                        title: 'General Ledger'
                    })
                    return
                })
            }
        }catch(err){
            res.json({
                message : err.message
            })
        }
    } 

    handleCreateAccount = async (req , res) => {
        try {
            console.log(req.body , req.body.accountName) 
          
            const {accountName , accountNumber , openingBalance , ledgerCode} = req.body 
            let newAccount = await new DetailAccount({ 
                ledgerCode : ledgerCode , 
                accountName   : accountName ,
                accountNumber : accountNumber , 
                openingBalance : openingBalance
            })
            let saveAccount = await newAccount.save() 
            if (saveAccount) {
                res.redirect("/setup/accounts")
            }else {
                throw new Error()
            }
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getTaxSetup =  async (req , res) => {
        try { 
            let taxes = await Tax.find({}) || [] 
            res.render("tax-types" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                taxes : taxes,
                title: 'Taxes'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    handleCreateTax = async (req , res) => {
        try {
            console.log(req.body) 
            const {taxName , taxFrequency} = req.body 
            let newAccount = await new Tax({ 
                taxName : taxName , 
                frequency   : taxFrequency
            })
            let saveAccount = await newAccount.save() 
            if (saveAccount) {
                res.redirect("/setup/taxes")
            }else {
                throw new Error()
            } 
            // res.json({message : req.body})
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getLGASetup =  async (req , res) => {
        try { 
            let lgas = await LGA.find({}) || [] 
            res.render("tax-lgas" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                lgas : lgas,
                title: 'LGA'
            })  
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    handleCreateLGA = async (req , res) => {
        try {
            const {name} = req.body 
            let newLga = await new LGA({ 
                name : name
            })
            let saveLga= await newLga.save() 
            if (saveLga) {
                res.redirect("/setup/lgas")
            }else {
                throw new Error()
            } 
            // res.json({message : req.body})
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getStreetSetup =  async (req , res) => {
        try { 
            let locations = await Location.find({}) || []  
            let lgas = await LGA.find({}) || []  
            let streets  = await Street.find({}).populate("location") || [] 
            res.render("tax-streets" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                locations : locations , 
                lgas : lgas , 
                streets : streets,
                title: 'Streets'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    handleCreateStreet = async (req , res) => {
        try {
            const {name , location , lga} = req.body 
            console.log(req.body)
            let newStreet = await new Street({ 
                name : name , 
                location : location 
            })
            let saveStreet = await newStreet.save() 
            if (saveStreet) {
                res.redirect("/setup/streets")
            }else {
                throw new Error()
            } 
            // res.json({message : req.body})
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getLocationSetup =  async (req , res) => {
        try { 
            let locations = await Location.find({}).populate("lga")  || [] 
            let lgas      = await LGA.find({})
            res.render("tax-locations" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                locations : locations , 
                lgas : lgas,
                title: 'Locations'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    handleCreateLocation = async (req , res) => {
        try {
            const {name , lga} = req.body 
            let newLocation = await new Location({ 
                name : name , 
                lga : lga
            })
            let saveLocation = await newLocation.save() 
            if (saveLocation) {
                res.redirect("/setup/locations")
            }else {
                throw new Error()
            } 
            // res.json({message : req.body})
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getPayerSetup =  async (req , res) => {
        try { 
            let payers = await Payer.find({}) || []
            res.render("tax-payers" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                payers : payers,
                title: 'Tax Payers'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    handlePayer = async (req , res) => {
        try {
            const {name} = req.body 
            
            let newPayer = await new Payer({ 
                group : name
            })
            let savePayer = await newPayer.save() 
            if (savePayer) {
                res.redirect("/setup/payers")
            }else {
                throw new Error()
            } 
            // res.json({message : req.body})
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getPropertiesSetup =  async (req , res) => {
        try { 
            res.render("tax-properties" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                title: 'Properties'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    getPremise =  async (req , res) => {
        try { 
            let properties  =  await Property.find({}) 
            let payers      =  await  TaxPayer.find({}) 
            let streets      =  await  Street.find({}) 

            res.render("premise" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                properties : properties , 
                payers : payers , 
                properties : properties , 
                streets : streets,
                title: 'Premise'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    createProperty = async (req ,res) => {
        try {
            const {type , description , rate} = req.body 
            
            let property = await new Property({ 
                name  : type , 
                description : description ,
                chargeRate : Number(rate)
            })
            let isSaveProperty = await property.save() 
            if ( isSaveProperty) {
                res.redirect("/setup/properties")
            }else {
                throw new Error()
            } 
            // res.json({message : req.body})
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getPenaltiesSetup =  async (req , res) => {
        try { 
            let penalties = await Penalty.find({}) || []
            res.render("tax-penalties" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                penalties : penalties,
                title: 'Tax Penalties'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    handlePenalty = async (req , res) => {
        try {
            const {name , rate} = req.body 
            let newPenalty = await new Penalty({ 
                name : name , 
                rate : Number(rate)
            })
            let savePenalty = await newPenalty.save() 
            if (savePenalty) {
                res.redirect("/setup/penalties")
            }else {
                throw new Error()
            } 
            // res.json({message : req.body})
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    getPayers =  async (req , res) => {
        try { 
            let payers = await TaxPayer.find({}) || []
            res.render("payers" , {
                appUser : "ADELEKE" ,   
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                payers : payers,
                title: 'Payers'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
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

    handleCreateCorparate = async ( req ,res) => {
        try {
            const {companyName , companyEmail , companyAddress , 
            contactPerson , contactPhoneNumber , yearOne , incomeOne , 
            yearTwo , incomeTwo , yearThree , incomeThree} = req.body 
            if (req.file){ 
                let date = new Date().getDate()
                let fileName =   `${date}-${req.file.originalname}`  
                let payers = await TaxPayer.find({}) 
                let TIN = AccountGenerator(payers , "0000000001" , "payerIdentifier" , 1 , 10 ) 
                let corporate = await new TaxPayer({ 
                    payerIdentifier : TIN , 
                    payerGroup : "c" , 
                    companyName : companyName , 
                    email : companyEmail , 
                    homeAddress : companyAddress , 
                    contactPerson : contactPerson , 
                    contactNumber : contactPhoneNumber , 
                    avatar : fileName ,
                    lastTaxPaid : [
                        {year : yearOne , amount : Number(incomeOne)} , 
                        {year : yearTwo , amount : Number(incomeTwo)} , 
                        {year : yearThree , amount : Number(incomeThree)}
                    ]
                 })
                let saveCorporate = await corporate.save() 
                if (saveCorporate){
                    FileHandler.createDirectory("./public/avatars")  
                    FileHandler.moveFile(fileName , "./public/uploads" , "./public/avatars")
                    res.redirect("/payers") 
                res.json({m : req.body})
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

    handleCreateGovernment = async ( req ,res) => {
        try {
            const {companyName , companyEmail , companyAddress , 
            contactPerson , contactPhoneNumber , yearOne , incomeOne , 
            yearTwo , incomeTwo , yearThree , incomeThree} = req.body 
            if (req.file){ 
                let date = new Date().getDate()
                let fileName =   `${date}-${req.file.originalname}`  
                let payers = await TaxPayer.find({}) 
                let TIN = AccountGenerator(payers , "0000000001" , "payerIdentifier" , 1 , 10 ) 
                let corporate = await new TaxPayer({ 
                    payerIdentifier : TIN , 
                    payerGroup : "g" , 
                    companyName : companyName , 
                    email : companyEmail , 
                    homeAddress : companyAddress , 
                    contactPerson : contactPerson , 
                    contactNumber : contactPhoneNumber , 
                    avatar : fileName ,
                    lastTaxPaid : [
                        {year : yearOne , amount : Number(incomeOne)} , 
                        {year : yearTwo , amount : Number(incomeTwo)} , 
                        {year : yearThree , amount : Number(incomeThree)}
                    ]
                 })
                let saveCorporate = await corporate.save() 
                if (saveCorporate){
                    FileHandler.createDirectory("./public/avatars")  
                    FileHandler.moveFile(fileName , "./public/uploads" , "./public/avatars")
                    res.redirect("/payers") 
                res.json({m : req.body})
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

    getPaymentPage = async (req ,res) => {
        try { 
            let payers = await Payee.find({}) || [] 
            let revenueHead = await RevenueHead.find({}) || [] 
            let accountDetails = await DetailAccount.find({}) || []  
            res.render("pay" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" ,  
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                payers : payers , 
                revenues : revenueHead , 
                accounts : accountDetails,
                title: 'Payment'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    getRevenueHead = async (req , res) => {
        try { 
            let accountDetails = await DetailAccount.find({}) || []  
            let revenues = await RevenueHead.find({}) || []  
            res.render("revenue-head" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                accounts : accountDetails , 
                revenues : revenues,
                title: 'Revenue Head'
            }) 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 
     
    handleRevenueHead = async (req , res) => {
        try {
            const {name , account} = req.body  
            let revenueHead = await new RevenueHead({
                name : name ,
                account : account
            }) 
            let saveRevenue = await revenueHead.save() 
            if (saveRevenue){
               res.redirect(303, '/setup/revenue-head')
            } 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    getCharges = async (req , res) => {
        try {  
            let payers = await Payee.find({}) || [] 
            let revenueHead = await RevenueHead.find({}) || [] 
            let charges = await Charge.find({}).populate("payer") || [] 
            res.render("charges" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" , 
                payers : payers , 
                revenues : revenueHead , 
                charges : charges,
                title: 'Charges'
            })  
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 
    
    uploadCharges = async (req , res) => {
        try {
            let {names}  = req.body  
            let count = names.length 
            while ( count > 0){
                for( let payer of names){
                    let payee   =  await Payee.findOne({loginEmail : payer[4]})  
                    let revenueHead = await RevenueHead.findById("5fc8a98a124a5112802e8c4e")
                    let amount = payer[3] 
                    console.log(revenueHead)  
                    console.log(payee) 
                    if (payee && revenueHead){ 
                        
                        let charge = await new Charge({
                            amount : Number(amount)  , 
                            from : payer[5] , 
                            to : payer[6] ,  
                            payer : payee._id , 
                            revenueHead : revenueHead._id
                        }).save()
                    }     
                    count -= 1
                }
            }
            res.json({
                message : names
            })
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    handleCharge = async (req , res) => {
        try {
            console.log(req.body)
            const  {payerName , amount , from , to , revenue} = req.body
            let charge = await new Charge({
                amount : Number(amount)  , 
                balance : Number(amount) , 
                from : from , 
                to : to ,  
                payer : payerName , 
                revenueHead : revenue
            })
            let saveCharge = await charge.save() 
            if (saveCharge){
               res.json({
                   message : "Bill was raised successfully"
               })
            } 
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    getChargeDetail = async (req , res) => {
        try {
            const { data } = req.body
            let payer = await Payee.findById(data)
            let allBills = await Charge.find({payer : data , status : false})
            .populate("payer").populate("revenueHead")
            //console.log(allBills)
            let balance 
            if (allBills) {
                balance  = allBills.reduce((a , b) => a + b.balance, 0) 
            }else {
                balance  = 0
            }
            res.json({
                name : payer.name , 
                balance : balance , 
                bills : allBills
            })
        }catch(error){
            res.json({
                message : error.message
            })
        }
    } 

    savePayment = async (req , res) => {
        try {  
            console.log(req.body)
            const { amount , payerNumber ,  bank} = req.body 
            //let payer    = await TaxPayer.findById(payerNumber)
            //console.log(bank)
            let account = await DetailAccount.findById(bank) 
            console.log(account)
            let payments = await Payment.find({}) 
            //let allBills = await Charge.find({payer : data , status : false}) 
            let paymentCode =  AccountGenerator(payments, "0000000001" , "paymentCode" , 1 , 10) 
            // Insert Into Payment Header 
            if (account){
                let payment = await  new Payment({
                    amount  : Number(amount)  , 
                    payer   : payerNumber , 
                    account : account._id , 
                    paymentCode : paymentCode
                }) 
                await payment.save() 
                
            }
            // Update the charges collection depending on the amount paid by the customer 
            // and Create payment Details  
            let moneyTracker = Number(amount) 
            let i = 0 
            while ( moneyTracker !== 0){
                let outstandingBills = await Charge.find({
                    payer :  payerNumber  , 
                    status: false 
                }) 
                console.log(`The bill is ${outstandingBills}`)
                // let paying  
                if (outstandingBills.length === 0) break;
                let currentBill = outstandingBills[0] 
                
                // Insert the payment 
                let paying = currentBill.balance
                console.log(`paying is ${paying} while amount paid is ${currentBill.amountPaid}`)
                if (moneyTracker > paying) {
                    await Charge.findByIdAndUpdate(currentBill._id , {
                        status : true , 
                        amountPaid : currentBill.amountPaid + paying.toFixed(2) , 
                        balance : currentBill.balance - paying
                    } , {new : true , useFindAndModify : false}) 
                    moneyTracker = moneyTracker - paying

                }else if ( moneyTracker === paying){
                    await Charge.findByIdAndUpdate(currentBill._id , {
                        status : true , 
                        amountPaid : currentBill.amountPaid + paying.toFixed(2) , 
                        balance : currentBill.balance - paying
                    } , {new : true , useFindAndModify : false}) 
                    console.log("It happened here")
                    moneyTracker = 0
                }else {
                    await Charge.findByIdAndUpdate(currentBill._id , {
                        amountPaid : moneyTracker , 
                        balance : currentBill.balance - moneyTracker
                    } , {new : true , useFindAndModify : false}) 
                    moneyTracker = 0
                }
                continue
            }
            res.json({
                message  : "Payment was handled properly" , 
                object : savePayment
            })
            
        }catch(error){
            res.json(error.message)
        }
    }  

    // Redirect the user to the payment Page 
    proceedToPayment = async (req , res) => {
        try { 
            const { amount , payerNumber } = req.query 
            let payee = await Payee.findById(payerNumber) 
            if (payee) { 
                // res.json({
                //     email : payee.contactEmail , 
                //     amount : amount
                // })  
               //Initiating a transaction 
            const promise6 = paystack.initializeTransaction({
                amount: amount* 100,
                email: payee.contactEmail ,
            }) 
            promise6.then(function (response){
                if (response.body.status){ 
                    res.redirect(response.body.data.authorization_url)
                }else {
                    res.json({
                        message : "Unable to proceed with the request"
                    })
                }
            }).catch(function (error){
                console.error(error.message)
            })
            }else {
                throw new Error()
            }
            
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    getBudgets  = async (req , res) => {
        try { 
            let ledgers = await GeneralLedger.find({}) || [] 
            let accountDetails = await DetailAccount.find({}) || [] 
            let budgets = await Budget.find({}) || [] 
            let possibleAccounts 
            if (accountDetails.length > 0){
                possibleAccounts = accountDetails.filter(account => 
                   account.ledgerCode === "E" || account.ledgerCode === "R" 
                )
            }else {
                possibleAccounts = []
            }
            res.render("budgets" , {
                appUser : "ADELEKE" ,  
                admin : "Ade" , 
                metaDescription : "A basic investment application" , 
                metaKeyword : "Investment , Cash money , Make money" ,
                revenueHeads : possibleAccounts , 
                budgets : budgets,
                title: 'Budgets'
            })
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

    handleBudget = async ( req , res) => {
        try {
            const {account , year , monthlyAllocations} = req.body 
            let budget = new Budget({
              account :account , 
              year : year ,
              monthlyAllocations : monthlyAllocations
            })
            let saveBudget = await budget.save() 
            if (saveBudget){
                res.json({
                    message : `Budget for ${year} was successfully created`
                 })
            }else {
                throw new Error()
            }
        }catch(error){
           res.json({
               message : error.message
           })
        }
    } 

    getSingleBudget = async (req , res) => {
        try { 
            let budgetCode = req.params.budgetCode 
            let budget = await Budget.findById(budgetCode)
            if (budget){
                res.render("single-budget" , {
                    appUser : "ADELEKE" ,  
                    admin : "Ade" , 
                    metaDescription : "A basic investment application" , 
                    metaKeyword : "Investment , Cash money , Make money" ,
                    budget : budget,
                    title: 'Budget'
                })
            }else {
                throw new Error()
            }
        }catch(error){
            res.json({
                message : error.message
            })
        }
    }

}

module.exports = new App()

