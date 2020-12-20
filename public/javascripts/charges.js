
import {sendData , getData , selector , selectAll , createElement } from "./api.js"  
let submitButton = selector("#save") 
//Check if the selected user has being charged for the current period under review 
console.log("Yes")
let form = selector("#chargeForm") 
form.style.position = "relative"
submitButton.addEventListener("click" , e => { 
    e.preventDefault() 
    let target = e.target
    let data = {}
    Array.from(selectAll(".field")).map(field => {
        data[field.id] = field.value
    }) 
    //console.log(data)
    
    sendData("/revenue/charges" , data)
    .then(res => {
        let response = createElement("div") 
        response.style.cssText += `;background:dodgerblue;color:#fff;border-radius:5px;padding:10px;position:relative`
        response.innerHTML = 
        ` 
            <span  style="color:red;font-size:2rem;position:absolute;top:0;right:10px">*</span>
            <div>
              <p>Payment was successfully distributed</p>
            </div>
       `
    form.insertBefore(response , form.firstElementChild) 
    setTimeout(() => {
        response.remove()
    } , 2000)
    }).catch(err => console.err(err))
}) 
