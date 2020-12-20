"use strict"

import {selector , createElement , sendData } from "./api.js"    

let submitButton = selector("#submit") 
submitButton.addEventListener("click" , e => {
    e.preventDefault() 
    let alert = selector(".alert")
    alert.textContent = ""
    if(alert.classList.contains('d-none')){
        alert.classList.remove('d-none')
    }
    alert.setAttribute('role', 'alert')
    let span2 = createElement('span')
    span2.textContent = "Validating submitted data. This may take awhile..." 
    alert.append(span2)
    let data = {
        email : selector("#email").value.trim() , 
        password : selector("#password").value.trim() , 
    }
    sendData("/login" , { data }) 
        .then(res => {
            if (res.efine){
                alert.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade-in')
                span2.textContent = "Validation was ok. Redirecting to dashboard" 
                setTimeout(() => {
                    location.replace("/dashboard")
                } , 1500)
            }else {
                alert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade-in')
                span2.textContent = "Incorrect details provided" 
            }
        }).catch(err => {
            console.error(err)
            alert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade-in')
            span2.textContent = err.message
        })
})