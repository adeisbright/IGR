
// require module for fetch API
import {sendData , getData , selector , selectAll , createElement } from "./api.js" 
let  payerNumber     = selector("#payersNumber")
let  payerName       = selector("#payerName")
let  disbursementBox    = selector("#chargeBalance") 
let  amount = selector("#amount") 
let  period = selector("#period") 
let remainingBalance

/**
 * 
 * @description Creates a new element of tag {tag} and attaches it to parent * with the given text
 * @param {String} parent The parent element within the DOM
 * @param {String} tag 
 * @param {String} text 
 * @return {String} parent 
 */

const createAndAttach = (parent , tag , text) => {
  let element = createElement(tag) 
  element.textContent = text 
  parent.append(element) 
  return parent
} 

window.addEventListener("DOMContentLoaded" , event => {
    disbursementBox.style.display = "none"
}) 

let globalCustomerName  
let total 
payerNumber.addEventListener("change" , event => { 
    if (event.target.id === "payersNumber"){   
        let loader = createElement("p") 
        let content = createElement("p")
        content.textContent = "Fetching Loan details ..."
        loader.setAttribute("class" , "loader")
        event.target.parentNode.append(loader , content)
        // Send a request to the backend to retrieve information about the user
        // const dataToSend = {
        //     applicationNumber : event.target.value.trim() ,  
        // } 
        sendData("/charge-detail" , {data : event.target.value.trim()})
        .then(res => {
            content.remove() 
            loader.remove()
            globalCustomerName       = `${res.name} `
            //applicantName.selected   = res.memberName 
            //applicantName.disabled   = true
            payerName.value      = `${res.name}`

            disbursementBox.style.display = "block" 
            disbursementBox.innerHTML = "" //This is an inefficient property. Remove as fast
            let disbursementMessage  = createElement("h2") ,
            approvedAmount           = createElement("h3") 
            // disbursementMessage.textContent = 
            approvedAmount.textContent      = "Net Due : " + res.balance.toLocaleString() + ".00" 
            total = res.balance
            approvedAmount.setAttribute("class" , "loan-balance center-text") 
            let table = createElement("table") 
            table.setAttribute("class" , "table table-with-border m-b-2")
            let tbody = createElement("tbody") 
            let thead = createElement("thead") 
            let caption = createElement("caption") 
            caption.textContent = "Charges Summary" 
            caption.setAttribute("class" , "font-2 ")
            thead.innerHTML = 
            `
                <tr>
                  <th>S/N</th>
                  <th>Description</th>
                  <th>Period Covered</th>
                  <th>Amount &#8358;</th>
                  <th>Paid &#8358;</th>
                  <th>Balance &#8358;</th> 
                </tr>
            ` 
            let accounts = []
            res.bills.map((bill , i) => { 
                let {amount , balance , revenueHead  ,from , to} = bill  
                let duration = `${from} to ${to}`
                accounts.push({
                    name : bill.revenueHead.name , 
                    value : bill.revenueHead._id
                })
                let amountPaid =  amount - balance 
                let tr = createElement("tr") 
                createAndAttach(tr , "td" , i + 1)
                createAndAttach(tr , "td" , revenueHead.name)
                createAndAttach(tr , "td" , duration)
                createAndAttach(tr , "td" , amount)
                createAndAttach(tr , "td" , amountPaid) 
                createAndAttach(tr , "td" , balance)
                tbody.append(tr)
            })
            table.append(caption , thead , tbody)
            disbursementBox.append(table , approvedAmount ) 
           
        })
        .catch(err => {
            console.error(err)
        })
    }
}) 
// Handling deduction of cash paid by the customer
amount.addEventListener("blur" , event => {
    let target = event.target 
    let balance = selector("#balance")
    if (target.value !== "" && total >=  target.value){
       balance.value = total  - target.value
    }
}) 

//Checking account balance 
// const View =  {
//     amountField : selector("#transferAmount") , 
//     addElement(parent , elem){
//         parent.append(elem)
//     } , 
//    addValue(elem , value){
//        elem.value = value 
//        return elem 
//    }
// } 
// const Model = {
//     validMessage : "Proceed" , 
//     noBalance    : "Insufficient Balance"
// }
// const Controller = {
//     init(){ 
//         View.amountField.addEventListener("blur" , this.handleBlur)
//     } , 
//     handleBlur(event){
//         if (event.target.id){
//             View.addValue(event.target , event.target.value) 
//             getData(`/company/fetch-with-query?amountToTransfer=${event.target.value}&&accountNumber=${selector("#fundAccount").value}`)
//             .then(res => { 
//                 if (res.message){
//                     //You can allow form submission 
//                     /*if (event.target.nextSibling.tagName === "P"){
//                         event.target.nextSibling.remove()
//                     }*/
//                     let p = createElement("p") 
//                     p.textContent = Model.validMessage
//                     View.addElement(event.target.parentNode , p)
//                     selector("#controlButton").style.display = "block"
//                 }else { 
//                     /*if (event.target.nextSibling.tagName === "P"){
//                         event.target.nextSibling.remove()
//                     }
//                     selector("#controlButton").style.display = "none"
//                     */
//                    let p = createElement("p") 
//                     p.textContent = Model.noBalance
//                     View.addElement(event.target.parentNode , p)
//                 }
//             }).catch(err => console.error(err))
//         }else {
//             console.log("It did not occur")
//         }
//     } 
// }
// Controller.init() 

// window.addEventListener("click"  , event => {
//     if (event.target.id === "reset") {
//         location.replace("/payments")
//     }
//     if (event.target.id === "close") {
//         location.replace("/admin") 
//     }
// })

//-------------------- Saving Record to the database 

const logError = error => console.error(error)
 
const displayResponse = (msg , format , ...args) => {}

/**
 * 
 * @param {Object} target element to listen to 
 * @param {Event} e event to listen to
 * @param {Object} record to be sent to the server
 */
const recordSaver = (target , action  , url ,  record) => {
    target.addEventListener(action , e => {
        e.preventDefault() 
        sendData(url , record)
        .then(res => {
            display(res)
        })
        .catch(err => log(err)) 
    })  
} 

  

let saveRecord  = selector("#save") 
saveRecord.addEventListener("click" , event => {  
    event.preventDefault() 
    if(true){//if (Array.from(selectAll(".status-button")).some(button => button.checked)){
        //updateRecord contains the record to update on the server 
        //periodCovered : selector("#period").value.trim() , 
        const updateRecord = {
            amount        : Number(selector("#amount").value.trim()) ,
            payerNumber   : payerNumber.value.trim() , 
           
            revenueHead   : selector("#revenue").value.trim()
        } 
        console.log(updateRecord)
        // Send a request to the backend service 
        let loader = createElement("p")
        loader.setAttribute("class" , "loader")
        event.target.parentNode.append(loader) 
        location.replace(`/charge-payee?amount=${Number(selector("#amount").value.trim())}&&payerNumber=${payerNumber.value.trim() }`)
        // sendData("/make-payment" , {
        //     amount        : Number(selector("#amount").value.trim()) ,
        //     payerNumber   : payerNumber.value.trim() , 
        //     // periodCovered : selector("#period").value.trim() , 
        //     bank   : selector("#revenue").value.trim()
        // })
        // .then(res =>{   
        //     console.log(res)
        //     loader.remove()
        //     let message = createElement("h2")
        //     message.textContent = res.message //"Payment was successful. Your receipt is in mail box"
        //     event.target.parentNode.append(message)
        // })
        // .catch(err => {
        //     console.error(err)
        // }) 
    }
    // }else { 
    //     let errorElement = createElement("span") 
    //     let targetParent = event.target.parentNode 
    //     let  targetPreviousSibling    = event.target.parentNode.previousElementSibling
    //     if (targetPreviousSibling.tagName === "SPAN"){
    //         targetPreviousSibling.remove()
    //     }
    //     //console.log(event.target.parentNode.previousElementSibling)
    //     let targetGrandParent = event.target.parentNode.parentNode 
    //     errorElement.textContent = "Please , check a button to confirm or void the application"
    //     targetGrandParent.insertBefore(errorElement , targetParent )
    // }

    
}) 
