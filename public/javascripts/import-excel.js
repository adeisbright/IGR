//import readXlsxFile from 'read-excel-file' 

import {createElement, selector, sendData} from "./api.js"
//Handling only one excel file
var input = document.getElementById('file') 
let values =  []
input.addEventListener('change', function() {    
    readXlsxFile(input.files[0], { dateFormat: 'MM/DD/YY' }).then(function(data) { 
      let students  = data.filter((f , i , a) => a.indexOf(f) !== 0) 
      values = students
      console.log(students) 
      let app = selector("#app") 
      let table = createElement("table") 
      table.setAttribute("class" , "table table-bordered")
      table.innerHTML = 
      ` 
        <thead>
            <tr>
                <th>S/N</th> 
                <th>Customer Name</th>
                <th>State TIN</th>
                <th>Revenue Head</th>
                <th>Amount Charged</th>
                <th>Email</th>
                <th>From</th>
                <th>To</th>
            </tr>
      `  
      let tbody = createElement("tbody") 
      students.map((student , i) => {
        let tr = createElement("tr")  
        let td = createElement("td") 
        td.textContent = i + 1
        tr.append(td)
        for (let key of Object.values(student)){
            let td = createElement("td") 
            td.textContent = key 
            tr.append(td)
        }
        tbody.append(tr)
      }) 
      table.append(tbody)
      app.append(table)
      sendData("/charges-upload" , {names : students} )
      .then(res => {
        console.log(res) 
        setTimeout(() => {
          location.replace("/revenue/charges")
        } , 10)
      })
      .catch(err => console.log(err))
    }, function (error) {
        console.error(error)
        alert("Error while parsing Excel file. See console output for the error stack trace.")
    })
})