// import path from 'path'
import { selection_opt } from './selopt.js';
import { user_data } from './user_data.js';

const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const fontList = require('font-list');

const about = document.getElementById("aboutus");
const learn = document.getElementById("learn");
const practice = document.getElementById("practice");
const profile = document.getElementById("profile");
const exdrop = document.getElementById("sheet_val");
const fontdrop = document.getElementById("font_val");
const timedrop = document.getElementById("time_val");
const lang_radio = document.querySelectorAll(['input[type = "radio"][name = "lang"']);
const exam_types = document.querySelectorAll(['input[type = "radio"][name = "exam_type"']);
const home_btn = document.querySelector(".logo");
const test_btn = document.getElementById("test_btn");
const learn_btn = document.getElementById("learn_btn");
const textbox = document.getElementById("txtarea");
// const fileBrowser = document.getElementById('fileInput');
// Changes added on 31.08.2023
const audio_ctrl = document.getElementById("audio_ctrl");
const audioPlayer = document.getElementById('audioPlayer');
const vol_up = document.getElementById('vol_up');
const vol_down = document.getElementById('vol_down');
const speedLabel = document.getElementById('speedLabel');
// changes complete

// Variable declaration
var sel_lang = "Hindi_Exercise";
var sel_time = 1;
var sel_exam = "ex1";
var sel_font = "\"Kruti Dev 010\"";
var sel_exr = "";
var ex_loc = "";
textbox.style.fontFamily = "\"Kruti Dev 010\"";
//joining path of directory
var directoryPath = path.join(__dirname, "Paragraphs/English");

let usr_data = new user_data();

// Getting information from backend
ipcRenderer.on('info',(Event,data)=>{
    usr_data = data;
    if(usr_data.mode == 'learning'){
        ex_loc = "Exercise/" + sel_lang;
    }
    else if(usr_data.mode == 'practice'){
        if(sel_lang == "English_Exercise"){
            ex_loc = "Paragraphs/English";
        }else{
            ex_loc = "Paragraphs/Hindi";
        }
    }
    remove_opt();
    directoryPath = path.join(__dirname, ex_loc);
    file_dir_scan(directoryPath);
});
// function to load script
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
        reject(new Error(`Failed to load script ${url}`));
        };
        document.head.appendChild(script);
    });
}
async function run() {
    try {
        const class_script_js = path.join(__dirname, 'src/selopt.js');
        await loadScript(class_script_js);
    } catch (error) {
      console.error(error);
    }
}
run();
// Directory scanning function
function file_dir_scan(path){
    // passsing directoryPath and callback function
    fs.readdir(path, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            const optionElement = document.createElement('option');
            optionElement.value = file;
            optionElement.text = file;
            exdrop.appendChild(optionElement);
        });
    });
}

// function to remove all the current select option from the menu
function remove_opt(){
    // Remove all existing options
    while (exdrop.firstChild) {
        exdrop.removeChild(exdrop.firstChild);
    }
    const optionElement = document.createElement('option');
    optionElement.text = "Select option";
    exdrop.appendChild(optionElement);
}

// function to fetch list of fonts
fontList.getFonts()
  .then(fonts => {
    fonts.forEach( function (font) {
        const optionElement = document.createElement('option');
        optionElement.value = font;
        optionElement.text = font;
        fontdrop.appendChild(optionElement);
    });
    fontdrop.value ="\"Kruti Dev 010\"";
  })
  .catch(err => {
    console.log(err)
  })

file_dir_scan(directoryPath);
// Name: Lakshya Dujari
// Date: 04.09.2023
// Comment: Adding correct logic for navigation 

home_btn.addEventListener('click',() =>{
    window.location.href = "index.html";
});
about.addEventListener('click',() =>{
    // window.location.href = "AboutUs.html";
    ipcRenderer.send('home_sel','about_us');
});
learn.addEventListener('click',() =>{
    // window.location.href = "learning.html";
    ipcRenderer.send('home_sel','learning');
});
practice.addEventListener('click',() =>{
    // window.location.href = "learning.html";
    ipcRenderer.send('home_sel','practice');
});
profile.addEventListener('click',() =>{
    // window.location.href = "Profile.html";
    ipcRenderer.send('home_sel','profile');
});

// file browser code
document.getElementById('browser_btn').addEventListener('click', ()=>{
    document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', function(event) {
    const selectedFile = event.target.files[0];
    if(selectedFile){
        let filePath = selectedFile.path;
        const numLines = 40;
        sel_exr = filePath;
        fetch(filePath).then(response =>{
            const contentType = response.headers.get('content-type');
            const charsetMatch = /charset=([a-zA-Z0-9-]+)/.exec(`'utf-8'`);
            const charset = charsetMatch ? charsetMatch[1] : 'utf-8';
            return response.text();
        }).then(text =>{
            const lines = text.split("\n").slice(0, numLines);
            const textbox = document.getElementById("txtarea");
            textbox.value = lines.join("\n");
        }).catch(error => console.error(error));
    }else{
        console.error("No File Selected");
    }
});

//selecting time
timedrop.addEventListener('change',(e) =>{
    sel_time = e.target.value;
});
// Adding playback speed logic
// Changes Added on 31.08.2023 Comment -> playback logic
vol_up.addEventListener('click',(e) =>{
    if(audioPlayer.playbackRate<=2){
        audioPlayer.playbackRate = Math.min(audioPlayer.playbackRate + 0.05, 2)
        speedLabel.textContent = audioPlayer.playbackRate.toFixed(2);
    }
    // console.log(playbackSpeed);
});

vol_down.addEventListener('click',(e) =>{
    if(audioPlayer.playbackRate>.5){
        audioPlayer.playbackRate = Math.min(audioPlayer.playbackRate - 0.05, 2)
        speedLabel.textContent = audioPlayer.playbackRate.toFixed(2);
    }
    // console.log(playbackSpeed);
});
// Adding selected text file in to the textbox
exdrop.addEventListener('change',(e) =>{
    // Changes added on 31.08.2023
    // changes to play the selected file audio for stano also the if condition is also added today
    if(sel_exam == 'ex7'){
        const selitem = e.target.value;
        const file_path = path.join(__dirname, 'Exercise/Stano/DTC Steno Recording/DTC Steno Recording', selitem);
        audioPlayer.src = file_path; // Set the audio source to the file path
        audioPlayer.play();
        // Replace ".mp3" with ".docx"
        const modifiedSelitem = selitem.replace(/\.mp3$/, ".docx");
        sel_exr = path.join(__dirname, 'Exercise/Stano/DTC Steno Word file', modifiedSelitem);
    }
    // changes Complete 31.08.2023
    else{
        const selitem = e.target.value;
        let filePath = '';
        if(usr_data.mode == 'learning'){
            filePath = path.join(__dirname, 'Exercise/', sel_lang);
        }else if(usr_data.mode == 'practice'){
            if(sel_lang == "English_Exercise"){
                filePath = path.join(__dirname,"Paragraphs/English");
            }else{
                filePath = path.join(__dirname,"Paragraphs/Hindi");
            }
        }
        const url = filePath.concat("/",selitem);
        const numLines = 40 ; // change to the desired number of lines
        sel_exr = url;
        fetch(url,{
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
              }
        })
        .then(response => response.text())
        .then(text => {
            const lines = text.split("\n").slice(0, numLines);
            const textbox = document.getElementById("txtarea");
            textbox.value = lines.join("\n");
        })
        .catch(error => console.log(error));
    }
});

// Setting up the font of text area
fontdrop.addEventListener('change', (e) =>{
    const selitem = e.target.value;
    sel_font = selitem;
    textbox.style.fontFamily = selitem;
});

// setting listner for language selector
lang_radio.forEach( lang_btn =>{
    lang_btn.addEventListener('change', (e) => {
        sel_lang = e.target.value;
        if(usr_data.mode == 'learning'){
            ex_loc = "Exercise/" + sel_lang;
            directoryPath = "";
            directoryPath = path.join(__dirname, 'Exercise/', sel_lang);
        }
        else if(usr_data.mode == 'practice'){
            directoryPath = "";
            if(sel_lang == "English_Exercise"){
                ex_loc = "Paragraphs/English";
            }else{
                ex_loc = "Paragraphs/Hindi";
            }
            directoryPath = path.join(__dirname, ex_loc);
        }
        remove_opt();
        if(sel_lang == "English_Exercise"){
            fontdrop.value = "Arial";
            sel_font = "Arial";
            textbox.style.fontFamily = "Arial";
            textbox.value = null;
        } else {
            fontdrop.value ="\"Kruti Dev 010\"";
            sel_font = "\"Kruti Dev 010\"";
            textbox.style.fontFamily = "\"Kruti Dev 010\"";
            textbox.value = null;
        }
        file_dir_scan(directoryPath);
    });
});

// Exam type listner
exam_types.forEach( exam_type =>{
    exam_type.addEventListener('change', (e) =>{
        sel_exam = e.target.value;
        // Added on 29.08.2022 to add event on click of stano btn 
        sel_lang = '';
        lang_radio.forEach(function(temp) {
            if (temp.checked) {
              sel_lang = temp.value;
            }
        });
        if(sel_exam == 'ex7'){
            remove_opt();
            audio_ctrl.style.display = 'flex';
            if(sel_lang == "English_Exercise"){
                textbox.style.fontFamily = "Arial";
                textbox.value = null;
            } else {
                textbox.style.fontFamily = "Kruti Dev 011";
                textbox.value = null;
            }
            fontdrop.style.display = 'none';
            directoryPath = "";
            directoryPath = path.join(__dirname,'Exercise/Stano/DTC Steno Recording/DTC Steno Recording');
            file_dir_scan(directoryPath);
        }else{
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            audio_ctrl.style.display = 'none';
            fontdrop.style.display = 'block';
            directoryPath = "";
            if(usr_data.mode == 'learning'){
                ex_loc = "Exercise/" + sel_lang;
                directoryPath = "";
                directoryPath = path.join(__dirname, 'Exercise/', sel_lang);
            }
            else if(usr_data.mode == 'practice'){
                directoryPath = "";
                if(sel_lang == "English_Exercise"){
                    ex_loc = "Paragraphs/English";
                }else{
                    ex_loc = "Paragraphs/Hindi";
                }
                directoryPath = path.join(__dirname, ex_loc);
            }
            remove_opt();
            if(sel_lang == "English_Exercise"){
                textbox.style.fontFamily = "Arial";
                textbox.value = null;
            } else {
                textbox.style.fontFamily = "Kruti Dev 011";
                textbox.value = null;
            }
            file_dir_scan(directoryPath);
        }
        // changes complete 29.08.2022
    });
});

test_btn.addEventListener('click',(e) =>{
    let sel_learn = '';
    if(sel_exam == 'ex7'){
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        if(sel_exam == "" || sel_exr == "" ||sel_lang == "" ||sel_time == ""){
            console.log("Please Select all nesseary options");
            return;
        }
        if(sel_lang == "English_Exercise"){
            sel_font = "Arial Rounded MT Bold";
        }
        else if(sel_lang = "Hindi_Exercise"){
            sel_font = "Kruti Dev 010";
        }
        sel_learn = 'stano';
    }else{
        if(sel_exam == "" || sel_exr == "" || sel_font == "" ||sel_lang == "" ||sel_time == ""){
            console.log("Please Select all nesseary options");
            return;
        }
        sel_learn = 'test';
    }
    // Create an object of the class
    let test_obj = new selection_opt(sel_lang,sel_time,sel_exam,sel_font,sel_exr);
    // // Send a message to the main process
    // let learn_count = null;
    // let learn_txt = null;
    // let learn_char_count = null;
    // ipcRenderer.send('selection-renderer', sel_lang,sel_time,sel_exam,sel_font,sel_exr,sel_learn,learn_count,learn_txt,learn_char_count); 
    let learn_count = null;
    let learn_txt = null;
    let learn_char_count = null;
    ipcRenderer.send('selection-renderer', sel_lang,sel_time,sel_exam,sel_font,sel_exr,sel_learn,learn_count,learn_txt,learn_char_count);
    // window.location.href = "testscr.html";
});

learn_btn.addEventListener('click',(e) =>{
    if(sel_exam == 'ex7'){
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
        if(sel_exam == "" || sel_exr == "" ||sel_lang == "" ||sel_time == ""){
            console.log("Please Select all nesseary options");
            return;
        }
        if(sel_lang == "English_Exercise"){
            sel_font = "'Arial Rounded MT Bold'";
        }
        else if(sel_lang = "Hindi_Exercise"){
            sel_font = "'Kruti Dev 010'";
        }
    }else{
        if(sel_exam == "" || sel_exr == "" || sel_font == "" ||sel_lang == "" ||sel_time == ""){
            console.log("Please Select all nesseary options");
            return;
        }
    }
    let sel_learn = 'learn';
    // Create an object of the class
    let test_obj = new selection_opt(sel_lang,sel_time,sel_exam,sel_font,sel_exr);
    ipcRenderer.send('selection-renderer', sel_lang,sel_time,sel_exam,sel_font,sel_exr,sel_learn); 
    // console.log("language : " + test_obj.lang, "Time: " + test_obj.time,"Exam Type: "+test_obj.exam, "Font: "+test_obj.ex_font,"File Path: "+test_obj.file_path);
});
ipcRenderer.on('db_callback',(event, response) =>{  
    if (response === 200) {
        ipcRenderer.send('show-info-dialog', 'Activation Successful');
      } else {
        ipcRenderer.send('show-info-dialog', 'Please Provide Activation License');
      }
});