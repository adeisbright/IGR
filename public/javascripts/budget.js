
// require module for fetch API
import {sendData , getData , selector , selectAll , createElement } from "./api.js" 
/**
 * 
 * @param {*} method 
 * @param {*} value 
 */
const displayResult = (method , value) => method(value) 

/**
 * 
 * @param {*} field 
 */

const parseToNumber = (field) => {
    let {value} = field 
    let validPattern = /^(\d+)$/ 
    try { 
        value = value.trim()
        if (value.match(validPattern)) return Number(value) 
        throw new Error("Wrong value submitted")
    }catch(error){ 
        let message = error.message 
        return message
    }
} 

let distributeButton = selector("#distribute") 
distributeButton.addEventListener("click" , event => { 
    let target = event.target 
    if (target.id === "distribute") {
        try { 
            let value = parseToNumber(selector("#totalBudget")) 
            if ( typeof value === "number" ) {
                displayResult(console.log , value)  
                let months = Array.from(selectAll(".budgetAmount")) 
                let monthlyAllocation = (value/months.length).toFixed(2) 
                let totalCell = selector("#totalCell") 
                totalCell.value = value
                months.map(month => month.value = monthlyAllocation ) 

                return 
            } 
            throw new Error("Please , provide a valid number")
        }catch(error){
            displayResult(console.log , error.message) 
        } 
    }
}) 

// Handling Change Event 
let months = Array.from(selectAll(".budgetAmount")) 
months.map(month => {
    month.addEventListener("change" , event => { 
    try { 
            let value = parseToNumber(month) 
            if ( typeof value === "number") {
                month.value = value  
                let totalAllocation = months.reduce((a , b) => a + Number(b.value) , 0).toFixed(2) 
                let totalCell = selector("#totalCell") 
                let totalBudgetField = selector("#totalBudget") 
                totalCell.value = totalAllocation 
                totalBudgetField.value = totalAllocation 
                return 
            } 
            throw new Error("Unsupported number")
        }catch(error){ 
            month.value = error.message
        } 
    })
}) 

// Handling Save Event 
let saveButton = selector("#save") 
saveButton.addEventListener("click" , event => {
    let revenueHead = selector("#revenueHead").value 
    let year        = selector("#year").value
    let monthBudgets = [] 
    let months = Array.from(selectAll(".budgetAmount")) 
    months.map((month , i) => {
        let {id , value} = month 
        monthBudgets.push({
            i : i + 1 , 
            name : id , 
            amount : Number(value) , 
            actual : 0 , 
            variance : Number(value)
        })
    }) 
    let dataToSend = {
        bill : revenueHead , 
        year : year , 
        overview : monthBudgets
    } 
    console.log(dataToSend) 
    sendData("/budgets" , {
        account : revenueHead , 
        year : year  , 
        totalAmount : monthBudgets.reduce((a , b) => a + b.amount , 0) ,
        monthlyAllocations : monthBudgets
    }).then(res => {
        console.log(res.message)
    }).catch(error => console.error(error))
})