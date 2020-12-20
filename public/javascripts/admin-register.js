import {selector, sendData, selectAll, createElement} from './api.js'
import {validateUserName, validatePassword, validateEmail, validateMobile} from './validate.js'

const blurScope = {
    email : "Please , provide a valid email" , 
    userName : "Username can be alphanumeric" , 
    password : "Password must be 8 characters or more" , 
    phone : "Provide a valid Nigerian Number"
} 
let userInfo = {} 

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
            let parent = target.parentNode 
            switch(id){
                case "username" : 
                  validateInput(target , validateUserName , "error" , "success" , blurScope.username) 
                  break;
                case "email" : 
                  validateInput(target , validateEmail , "error" , "success" , blurScope.email) 
                  break;
                case "phoneNumber" : 
                  validateInput(target , validateMobile , "error" , "success" , blurScope.phone) 
                  break; 
                case "password" : 
                  validateInput(target , validatePassword, "error" , "success" , blurScope.password) 
                  break;
                case "confirmPassword" : 
                    if (value === selector("#password").value && value !== "") {
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
        span2.textContent = "Please wait...." 
        alert.append(span2)
        if (inputs.every(input => input.classList.contains("success"))){
            console.log(dataToSend)
            sendData(url , dataToSend) 
            .then(res => { 
                e.target.disabled = true
                alert.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade-in')
                span2.textContent = "Account was created successfully. You are now in charge of this app." 
                
                if (res.ework){ 
                    setTimeout(() => {  
                        location.replace("/admin")
                    } , 2000)
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
let submitTarget = selector("#submit")
handleSubmit(submitTarget , blurInputs , userInfo , "/admin/new") 