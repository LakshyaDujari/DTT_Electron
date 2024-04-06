import { selection_opt } from './selopt.js';
import { result_class } from './result_class.js';

const { ipcRenderer } = require('electron');
const path = require('path');
const mammoth = require('mammoth');
const fs = require('fs');
const { each } = require('jquery');
// Class declaration
// class selection_opt{
//     constructor(){
//         this.lang = '';
//         this.time = '';
//         this.exam = '';
//         this.ex_font = '';
//         this.file_path = '';
//     }
// }
// class result_class{
//     constructor(lang,tst_time,time_taken,quest_txt_send,ans_txt_arr,ans_arr,wrong_arr,wrong_count,right_count,word_count){
//         this.lang = lang;
//         this.tst_time = tst_time;
//         this.time_taken = time_taken;
//         this.quest_txt_send = quest_txt_send;
//         this.ans_txt_arr = ans_txt_arr;
//         this.ans_arr = ans_arr;
//         this.wrong_arr = wrong_arr;
//         this.wrong_count = wrong_count;
//         this.right_count = right_count;
//         this.word_count = word_count;
//     }   
// }
// HTML Object declaration
const ans_txt = document.getElementById("text_cont");
const font_txt = document.getElementById("cur_font");
const timer_txt = document.getElementById("time_id");
const sound_chkbox = document.getElementById("sound");
const setting = document.querySelector(".settings-container");
const sub_btn = document.getElementById('submit_btn');
const back_radios = document.querySelectorAll(['input[type = "radio"][name = "backspace_set"']);
// Regular expression to match the file extension
const extensionRegex = /\.([0-9a-z]+)(?:[\?#]|$)/i;


// Variable Declaration
let ques_arr = [];
let ans_arr = [];
let wrong_arr = [];
let final_ans = [];
let wrong_count = 0.0;
let word_count = 0;
let right_arr = [];
let back_setting = 0;
let fontSize = 28.0;
let final_ques = "";
let sel_obj = new selection_opt();
let duration = 0;

// Listining to messgage from main class
ipcRenderer.on('load-page', (event, data) => {
    sel_obj.lang = data.lang;
    sel_obj.time = parseInt(data.time);
    sel_obj.exam = data.exam;
    sel_obj.ex_font = data.ex_font;
    sel_obj.file_path = data.file_path;
    // backspace radio Trigger
    back_radios.forEach(radio=>{
        radio.checked = true;
        radio.addEventListener('change', (e) =>{
            back_setting = e.target.value;
        });
    });
   // Use the regex to extract the file extension
    const match = sel_obj.file_path.match(extensionRegex); 
    // check for file extension
    if (match) {
        const extension = match[1]; // The extracted file extension
        console.log(`File extension: ${extension}`);
        if(extension == 'docx'){
            const buffer = fs.readFileSync(sel_obj.file_path); 
            // Convert the .docx to plain text
            mammoth.extractRawText({ buffer: buffer })
            .then((result) => {
                final_ques = result.value;
                ques_arr = final_ques.split(" ");
                console.log(ques_arr);
            })
            .catch((err) => {
                console.error("Error extracting text from .docx:", err);
            });
        }else if(extension == 'txt'){
            fetch(sel_obj.file_path)
            .then(response => response.text())
            .then(text => {
                final_ques = text;
                ques_arr = final_ques.split(" ");
                console.log(ques_arr);
            })
            .catch(error => console.log(error));
        }
        else{
            // Assuming you have an HTML file named "example.html" in the same directory
            fs.readFile(sel_obj.file_path, 'utf8', (err, html) => {
                if (err) {
                console.error('Error:', err);
                return;
                }
                console.log(html); // The content of the HTML file
            });
        }

    } else {
        console.log("File extension not found.");
    }
    if(sel_obj.lang == "Hindi_Exercise"){
        ans_txt.style.fontFamily = "\"Kruti Dev 010\"";
    }
    else{
        ans_txt.style.fontFamily = sel_obj.ex_font;
    }
    // Setting up the timmer once the window is loaded
    duration = sel_obj.time * 60; // minutes in seconds
    
    let intervalId = setInterval(function() {
      duration--;
      let minutes = Math.floor(duration / 60);
      let seconds = duration % 60;
      timer_txt.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
      
      if (duration === 0) {
        clearInterval(intervalId);
        let quest_txt_send = ques_arr.slice(0,word_count);
        const temp = ans_txt.value;
        const temp_arr = temp.split(' ');
        var result_obj = new result_class(sel_obj.lang,sel_obj.time,sel_obj.time,quest_txt_send,temp_arr,final_ans.join(' '),wrong_arr,wrong_count,right_arr.length,word_count);
        ipcRenderer.send("test_result",result_obj);
        // window.close();
      }
    }, 1000);
});
function resultSend(){
    let quest_txt_send = ques_arr.slice(0,word_count);
    var result_obj = new result_class(sel_obj.lang,sel_obj.exam,sel_obj.time,timer_txt.value,quest_txt_send,final_ans,wrong_arr,right_arr,backspce_count);
    ipcRenderer.send("test_result",result_obj);
}

sub_btn.addEventListener('click',async (e)=>{
    if(sel_obj.lang == 'Hindi_Exercise'){
        await hindi_checking();
    }else{
        await english_checking();
    }
    resultSend();
});

function hindi_checking(){
    ans_arr = ans_txt.value.split(' ');
    let ques_index = 0;
    ans_arr.forEach((ele)=>{
        ele = ele.replace(/[\r\n\n]+/g, '');
        ques_arr[ques_index] = ques_arr[ques_index].replace(/[\r\n\n]+/g,'');
        word_count += 1;
        if(ele == ques_arr[ques_index]){
            right_arr.push(ele);
            final_ans.push(ele);
        }
        else{
            let break_chk_a = false;
            // checking for extra space
            if(ele == ' '){
                wrong_arr.push(ele);
                let str = ele + "\\{extra space\\}";
                final_ans.push(str);
                ques_index -= 1;
                wrong_count += .5; 
            }
            else{
                // checking for Ang ki matra substitution
                if(charExistsInString(ques_arr[ques_index],'a')){
                    let n = ques_arr[ques_index].length;
                    let ques_char = ques_arr[ques_index];
                    let combination = ques_char;
                    for(let i=0;i<n-1;i++){
                        if(ques_char[i] == 'a'){
                            let substitue = sub_char_hindi(ques_char,i);
                            if(substitue[1] == ele){
                                right_arr.push(ele);
                                final_ans.push(ele); 
                                break_chk_a = true;
                            }
                            else{
                                combination = replaceCharAtIndex(combination,i,substitue[0]);
                            }
                            if(break_chk_a){
                                break;
                            }
                        } 
                    }
                    if(combination == ele){
                        right_arr.push(ele);
                        final_ans.push(ele); 
                        break_chk_a = true; 
                    }
                }
                if(charExistsInString(ele,'a')){
                    // checking combinations with ans
                    let n = ele.length;
                    let ans_char = ele;
                    let combination = ans_char;
                    if(!break_chk_a){
                        for(let i=0;i<n-1;i++){
                            if(ans_char[i] == 'a'){
                                let substitue = sub_char_hindi(ans_char,i); 
                                if(substitue[1] == ques_arr[ques_index]){
                                    right_arr.push(ele);
                                    final_ans.push(ele); 
                                    break_chk_a = true;
                                }
                                else{
                                    combination = replaceCharAtIndex(combination,i,substitue[0]);
                                }
                                if(break_chk_a){
                                    break;
                                }
                            }
                        }
                        if(combination == ques_arr[ques_index]){
                            right_arr.push(ele);
                            final_ans.push(ele); 
                            break_chk_a = true;  
                        }
                    }
                }
                // else full char is wrong
                if(!break_chk_a){
                    wrong_arr.push(ele);
                    let str = ele + "\\{" + ques_arr[ques_index] + "\\}";
                    final_ans.push(str);
                    wrong_count += 1;
                }
            }
        }
        ques_index += 1;
    });
}
function english_checking(){
    let ques_index = 0;
    ans_arr = ans_txt.value.split(' ');
    ans_arr.forEach((ele,index)=>{
        word_count += 1;
        if(ele == ques_arr[ques_index]){
            right_arr.push(ele);
            final_ans.push(ele);
            ques_index++;
        }
        // Name : Lakshya Dujari 
        // Added condition to for skipping multiple lines in checking
        // Date : 03.09.2023
        else if(ele == ques_arr[index]){
            wrong_count = wrong_count + index-ques_index;
            ques_index = index;
            right_arr.push(ele);
            final_ans.push(ele);
            ques_index++; 
        }
        else{
            wrong_arr.push(ele);
            let str = ele + "\\{" + ques_arr[index] + "\\}";
            final_ans.push(str);
            word_count += 1;
        }
    });
}
function charExistsInString(char, str) {
    return char.indexOf(str) !== -1;
}
function sub_char_hindi(char_str,index){
    // Don't change the char sequence of the mapping
    // these are the reference arrays
    // const panch_replace = ['M~','¥~','.','.k~','U','u~','E','e~']; 
    //                     //  ड्    ¥    u    ण्    n   न्    m   म्
    // const varn_mala = ['d','[k','x','?k','M+','p','N','t','>','¥','V','B','M','<+','.k','r','Fk','n','/k','u','i','Q','c','Hk','e']; 
    //                 //  क   ख   ग    घ   ड़    च   छ   ज   झ   ञ  ट    ठ   ड   ढ़     ण   त   थ    द   ध    न   प   फ   ब   भ    म
    const matra = ['k','f','h','q','w','s','S','ks','kS'];
                //  ा     ि    ी     ु    ू    े     ै     ो     ौ 
    let matra_s = false;
    let matra_check = false;
    let chk_index = index+1;
    let return_ans = [];
    // let index = char_str.indexOf('a');
    let aft_index = char_str[index+1];
    if(aft_index == 'k'){
        let combine = char_str[index+2];
        if(combine == 's' || combine == 'S'){
            matra_s = true;
        }
        else{
            matra_s = false;
        }
        matra_check = true;
    }
    else{
        let matraIndex = matra.indexOf(aft_index);
        if(matraIndex !== -1){
            matra_check = true;
        }
        else{
            matra_check = false;
        }
    }
    if(matra_check){
        if(matra_s){
            chk_index = index+2;
        }else{
            chk_index = index+1
        }
    }
    let chk_char = char_str[chk_index];
    let replace_char = '';
    // checking for next char for panch word rule
    // here creating a full char before checking 
    if(chk_char == '[' || chk_char == '?' || chk_char == 'M' || chk_char == '<' || chk_char == '.' || chk_char == 'F' || chk_char == '/' || chk_char == 'H'){
        let next_char = char_str[chk_index+1];
        if(next_char == '+' || next_char == 'k'){
            chk_char = chk_char + next_char;
        }
    }
    switch(chk_char){
        case 'd':
        case '[k':
        case 'x':
        case '?k':
        case 'M+':
            replace_char = 'M~';
            break;
        case 'p':
        case 'N':
        case 't':
        case '>':
        case '¥':
            replace_char = '¥~';
            break;
        case 'V':
        case 'B':
        case 'M':
        case '<+':
        case '.k':
            replace_char = '.';
            break;
        case 'r':
        case 'Fk':
        case 'n':
        case '/k':
        case 'u':
            replace_char = 'U';
            break;
        case 'i':
        case 'Q':
        case 'c':
        case 'Hk':
        case 'e':
            replace_char = 'E';
            break;
        default:
            replace_char = '';
    }
    return_ans.push(replace_char);
    return_ans.push(replaceCharAtIndex(char_str,index,replace_char));
    return return_ans;
}
// To replace char at particular index
function replaceCharAtIndex(inputString, index, replacementChar) {
    if (index < 0 || index >= inputString.length) {
        // Index out of bounds, return the original string
        return inputString;
    }

    // Convert the string to an array to make replacements easier
    const stringArray = inputString.split('');
    
    // Replace the character at the specified index with the replacementChar
    stringArray[index] = replacementChar;

    // Convert the array back to a string~~~
    const resultString = stringArray.join('');

    return resultString;
}