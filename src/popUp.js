const { count } = require('console');
const { ipcRenderer } = require('electron');
const { event } = require('jquery');
const path = require('path');
const wrong_table = document.getElementById('wrong_table');

ipcRenderer.on('load-page',(event,response)=>{
    if(response.lang == "Hindi_Exercise"){
        wrong_table.style.fontFamily = "\"Kruti Dev 010\"";
    }else{
        wrong_table.style.fontFamily = "Calibri";
    }
    let right_word_arr = response.wrong_arr[1].split("");
    let wrong_word_arr = response.wrong_arr[0].split("");
    let newRow = wrong_table.insertRow(-1);
    let head_cell = newRow.insertCell(0);
    head_cell.innerHTML = '<span style="font-family:Arial;">Right Word:</span>';
    right_word_arr.forEach(element => {
        let cell = newRow.insertCell(-1);
        cell.innerHTML = element;
    });
    newRow = wrong_table.insertRow(-1);
    head_cell = newRow.insertCell(0);
    head_cell.innerHTML = '<span style="font-family:Arial;">Wrong Word:</span>';
    wrong_word_arr.forEach(element =>{
        let cell = newRow.insertCell(-1);
        cell.innerHTML = element;
    });
});