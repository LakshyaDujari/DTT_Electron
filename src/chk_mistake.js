const { table } = require('console');
const { ipcRenderer } = require('electron');
const path = require('path');

let lang = '';
let wrong_arr = [];
let action_btn;
const wrong_table = document.getElementById('wrong_table');

ipcRenderer.on('load-page',(event, response) =>{
    let count = 1;
    lang = response.lang;
    wrong_arr = response.wrong_arr;
    wrong_arr.forEach(element => {
        let newRow = wrong_table.insertRow(-1);
        if(lang == "Hindi_Exercise"){
            wrong_table.style.fontFamily = '\"Kruti Dev 010\"';
            const thead = wrong_table.getElementsByTagName('thead')[0];
            thead.style.fontFamily = '\"Kruti Dev 010\"';
        }else{
            wrong_table.style.fontFamily = "Calibri";
        }
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);
        // if(lang == "Hindi_Exercise"){
        //     cell1.innerHTML = count;
        //     cell2.innerHTML.style.fontFamily =  "\"Kruti Dev 010\"";
        //     cell2.innerHTML = element[0] + '<span style="background-color: yellow; width:fit-content; font-family:Arial;">{'+ element[1]+'}</span>';
        //     cell3.innerHTML.style.fontFamily =  "\"Kruti Dev 010\"";
        //     cell3.innerHTML = element[0];
        //     cell4.innerHTML.style.fontFamily =  "\"Kruti Dev 010\"";
        //     cell4.innerHTML = element[1];
        //     cell5.innerHTML.style.fontFamily =  "\"Kruti Dev 010\"";
        //     cell5.innerHTML = "<button class='action_btn' data-row ="+ count +">Action</button>";
        // }else{
        //     wrong_table.style.fontFamily = 'Calibri';
        //     cell1.innerHTML = count;
        //     cell2.innerHTML = element[0] + '<span style="background-color: yellow; width:fit-content; font-family:Arial;">{'+ element[1]+'}</span>';
        //     cell3.innerHTML = element[0];
        //     cell4.innerHTML = element[1];
        //     cell5.innerHTML = "<button class='action_btn' data-row ="+ count +">Action</button>";
        // }
        cell1.innerHTML = count;
        cell2.innerHTML = element[0] + '<span style="background-color: yellow; width:fit-content;"><span style="font-family:Arial;">{</span>'+ element[1]+'<span style="font-family:Arial;">}</span></span>';
        cell3.innerHTML = element[0];
        cell4.innerHTML = element[1];
        cell5.innerHTML = "<button class='action_btn' style='font-family:Arial;' data-row ="+ count +">Action</button>";
        count++;
    });
    action_btn = document.querySelectorAll('.action_btn');
    action_btn.forEach(button =>{
        button.addEventListener('click',(obj)=>{
            let arr_index = obj.target.getAttribute('data-row');
            let request = {
                lang: lang,
                wrong_arr: wrong_arr[arr_index-1]
            }
            ipcRenderer.send('mistake_popup',request);
        })
    });
});
function addRow(data){
    let tbody = wrong_table.querySelector('table_body');
    let row = document.createElement("tr");
    let col1 = document.createElement("td");
    col1.style.fontFamily
}