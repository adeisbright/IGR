

import {selector , selectAll , sendData , createElement} from "./api.js" 
import {validateFullName ,validateEmail ,validateName , validateMobile ,  validatePassword} from "./validate.js" 

//Handling Blur Events on the input fields onst 

const blurScope = {
    email : "Please , provide a valid email" , 
    name : "Please  , ensure you provide a valid Nigerian Name" ,
    userName : "Username can be alphanumeric" , 
    password : "Password must be 8 characters or more" , 
    phone : "Provide a valid Nigerian Number"
}  

let userInfo = {} 
userInfo.isIndividual = true
let userIndicator = []

const validateInput = (target , cb , errorClass , successClass , message) => { 
    let {value , id , classList , nextElementSibling , parentNode} = target 
    if (cb(value).value !== null){ 
        userInfo[`${id}`] = value
        classList.contains(errorClass) ? classList.remove(errorClass) : null 
        classList.add(successClass) 
        if(nextElementSibling) nextElementSibling.remove()
    }else {
        if(nextElementSibling.tagName === "P") nextElementSibling.remove()
        let msg = document.createElement("p") 
        msg.className = "label" 
        let sibling = target.nextElementSibling 
        msg.textContent = message 
        classList.contains(errorClass) ? classList.remove(errorClass) : null 
        classList.toggle(errorClass) 
        parentNode.insertBefore(msg , sibling)
    }
}
const handleBlur = (targets) => {
    targets.map(target => {
        target.addEventListener("blur" , e => { 
            let {id , value} = target 
            let classList = target.classList 
            let nextSibling = target.nextElementSibling
            let parent = target.parentNode 
            let parentSibling = parent.nextElementSibling
            switch(id){
                case "individualName" : 
                  validateInput(target , validateFullName , "error" , "success" , blurScope.name) 
                  break;
                // case "individualTin" : 
                //   userInfo[`${id}`] = value
                //   break; 
                case "individualContactEmail" : 
                  validateInput(target , validateEmail , "error" , "success" , blurScope.email) 
                  break;
                case "individualPhone" : 
                  validateInput(target , validateMobile , "error" , "success" , blurScope.phone) 
                  break;
                case "userName" : 
                  validateInput(target , validateName, "error" , "success" , blurScope.userName) 
                  break; 
                case "userEmail" : 
                  validateInput(target , validateEmail, "error" , "success" , blurScope.email)
                  break;
                case "userPassword" : 
                  validateInput(target , validatePassword, "error" , "success" , blurScope.password) 
                  break;
                case "individualOffice" :
                    if(value != ''){
                        userInfo[`${id}`] = value
                        classList.contains("error") ? classList.remove("error") : null 
                        classList.add("success")
                        if(target.nextElementSibling) target.nextElementSibling.remove()
                    }else{
                        if(target.nextElementSibling) target.nextElementSibling.remove()
                        // let msg = createElement("p") 
                        // msg.className = "label"
                        // let sibling = parent.nextElementSibling
                        // msg.textContent = `Password does not match` 
                        // classList.contains("success") ? classList.remove("success") : null 
                        // classList.add("error") 
                        // target.parentNode.insertBefore(msg , target.nextElementSibling)
                    } 
                    break;
                case "street" :
                    if(value != ''){
                        userInfo[`${id}`] = value
                        classList.contains("error") ? classList.remove("error") : null 
                        classList.add("success")
                        if(target.nextElementSibling) target.nextElementSibling.remove()
                    }else{
                        if(target.nextElementSibling) target.nextElementSibling.remove()
                        // let msg = createElement("p") 
                        // msg.className = "label"
                        // let sibling = parent.nextElementSibling
                        // msg.textContent = `Password does not match` 
                        // classList.contains("success") ? classList.remove("success") : null 
                        // classList.add("error") 
                        // target.parentNode.insertBefore(msg , target.nextElementSibling)
                    } 
                    break;
                case "confirmPassword" : 
                    if (value === selector("#userPassword").value && value !== "") {
                        userInfo[`${id}`] = value
                        classList.contains("error") ? classList.remove("error") : null 
                        classList.add("success")
                        if(target.nextElementSibling) target.nextElementSibling.remove()
                    }else {
                        if(target.nextElementSibling) target.nextElementSibling.remove()
                        let msg = createElement("p") 
                        msg.className = "label"
                        let sibling = parent.nextElementSibling
                        msg.textContent = `Password does not match` 
                        classList.contains("success") ? classList.remove("success") : null 
                        classList.add("error") 
                        target.parentNode.insertBefore(msg , target.nextElementSibling)
                    }
                    break; 
                    
                default : 
                  target.classList.add("success")
                  userInfo[`${id}`] = value
            }
            
        })
    })
    
}
const blurInputs = Array.from(selectAll(".form-control") )
handleBlur(blurInputs)


//Handling Submit Events 
const handleSubmit = (target , inputs , dataToSend , url) => {
    target.addEventListener("click" , e => {
        e.preventDefault() 
        console.log(dataToSend)
        let alert = selector(".alert")
        alert.textContent = ""
        if(alert.classList.contains('d-none')){
            alert.classList.remove('d-none')
        }
        alert.setAttribute('role', 'alert')
        let span2 = createElement('span')
        span2.textContent = "Validating submitted data. This may take awhile..." 
        alert.append(span2)
        if (inputs.every(input => input.classList.contains("success"))){
            console.log(dataToSend)
            sendData(url , dataToSend) 
            .then(res => { 

                e.target.disabled = true
                alert.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade-in')
                span2.textContent = res.message

                if (res.ework){ 
                    setTimeout(() => {  
                        location.replace("/success")
                    } , 3000)
                }
            }) 
            .catch(err => {
                console.error(err)
                alert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade-in')
                span2.textContent = err.message
            })
            
        }else { 
            alert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade-in')
            span2.textContent = "Please fill in the right details."
        }
    })
} 
let submitTarget = selector("#userSubmit")
handleSubmit(submitTarget , blurInputs , userInfo , "/register") 

