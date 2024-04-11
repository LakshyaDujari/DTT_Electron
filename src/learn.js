import { selection_opt } from './selopt.js';
// import { textHighlight } from './texthighlighter.js';

// text highlight class
class textHighlight {

    constructor(font,ques_arr,htmlElement,color){
        if(font == "Hindi_Exercise"){
            this.fontFamily = '\"Kruti Dev 010\"';
        }else{
            this.fontFamily = 'Calibri';
        }
        this.ele = htmlElement;
        this.highlight_color = color;
        this.ques_arr = ques_arr.slice();
        this.question_txt = ques_arr.join(' ');
        this.question_txt = this.question_txt.replace(/</g, "&lt;").replace(/>/g,"&gt;");
        this.ele.innerHTML = this.question_txt;
        this.ele.style.fontFamily = this.fontFamily;
    }
    changeColor(color){
        this.highlight_color = color;
    }
    markText(cur_char_index,word_count) { 
        let temp_arr = this.ques_arr.slice();
        let originalString = temp_arr[word_count];
        let mark = originalString.substring(0, cur_char_index).replace(/</g, "&lt;").replace(/>/g,"&gt;") 
            + `<span style="color: ${this.highlight_color};">${originalString[cur_char_index].replace(/</g, "&lt;").replace(/>/g,"&gt;")}</span>` 
            + originalString.substring(cur_char_index+1).replace(/</g, "&lt;").replace(/>/g,"&gt;");
        temp_arr[word_count] = mark;
        for (let i = 0; i < temp_arr.length; i++) {
            if (i !== word_count) {
                temp_arr[i] = temp_arr[i].replace(/</g, "&lt;").replace(/>/g,"&gt;");
            }
        }
        this.ele.innerHTML = temp_arr.join(' ');
    }
}

// constant declaration
const { ipcRenderer } = require('electron');
const path = require('path');
const question_txt = document.getElementById("ques_txt");
const ans_txt = document.getElementById("text_cont");
const alt_tet_handle = document.getElementById("alt_text");
const h1_fin1 = document.getElementById('Lh1');
const h1_fin2 = document.getElementById('Lh2');
const h1_fin3 = document.getElementById('Lh3');
const h1_fin4 = document.getElementById('Lh4');
const h1_fin5 = document.getElementById('Lh5');
const h2_fin1 = document.getElementById('Rh1');
const h2_fin2 = document.getElementById('Rh2');
const h2_fin3 = document.getElementById('Rh3');
const h2_fin4 = document.getElementById('Rh4');
const h2_fin5 = document.getElementById('Rh5');
const highlight_chk = true;
// keyboard const declaration
const LR1_1 = document.getElementById('LR1_1_2');
const LR1_2 = document.getElementById('LR1_2_2');
const LR1_3 = document.getElementById('LR1_3_2');
const LR1_4 = document.getElementById('LR1_4_2');
const LR1_5 = document.getElementById('LR1_5_2');
const LR1_6 = document.getElementById('LR1_6_2');
const LR1_7 = document.getElementById('LR1_7_2');
const LR1_8 = document.getElementById('LR1_8_2');
const LR1_9 = document.getElementById('LR1_9_2');
const LR1_10 = document.getElementById('LR1_10_2');
const LR1_11 = document.getElementById('LR1_11_2');
const LR1_12 = document.getElementById('LR1_12_2');
const LR1_13 = document.getElementById('LR1_13_2');
const LR1_14 = document.getElementById('LR1_14_2');
const LR2_1 = document.getElementById('LR2_1_2');
const LR2_2 = document.getElementById('LR2_2_2');
const LR2_3 = document.getElementById('LR2_3_2');
const LR2_4 = document.getElementById('LR2_4_2');
const LR2_5 = document.getElementById('LR2_5_2');
const LR2_6 = document.getElementById('LR2_6_2');
const LR2_7 = document.getElementById('LR2_7_2');
const LR2_8 = document.getElementById('LR2_8_2');
const LR2_9 = document.getElementById('LR2_9_2');
const LR2_10 = document.getElementById('LR2_10_2');
const LR2_11 = document.getElementById('LR2_11_2');
const LR2_12 = document.getElementById('LR2_12_2');
const LR2_13 = document.getElementById('LR2_13_2');
const LR2_14 = document.getElementById('LR2_14_2');
const LR3_1 = document.getElementById('LR3_1_2');
const LR3_2 = document.getElementById('LR3_2_2');
const LR3_3 = document.getElementById('LR3_3_2');
const LR3_4 = document.getElementById('LR3_4_2');
const LR3_5 = document.getElementById('LR3_5_2');
const LR3_6 = document.getElementById('LR3_6_2');
const LR3_7 = document.getElementById('LR3_7_2');
const LR3_8 = document.getElementById('LR3_8_2');
const LR3_9 = document.getElementById('LR3_9_2');
const LR3_10 = document.getElementById('LR3_10_2');
const LR3_11 = document.getElementById('LR3_11_2');
const LR3_12 = document.getElementById('LR3_12_2');
const LR3_13 = document.getElementById('LR3_13_2');
const LR4_1 = document.getElementById('LR4_1_2');
const LR4_2 = document.getElementById('LR4_2_2');
const LR4_3 = document.getElementById('LR4_3_2');
const LR4_4 = document.getElementById('LR4_4_2');
const LR4_5 = document.getElementById('LR4_5_2');
const LR4_6 = document.getElementById('LR4_6_2');
const LR4_7 = document.getElementById('LR4_7_2');
const LR4_8 = document.getElementById('LR4_8_2');
const LR4_9 = document.getElementById('LR4_9_2');
const LR4_10 = document.getElementById('LR4_10_2');
const LR4_11 = document.getElementById('LR4_11_2');
const LR4_12 = document.getElementById('LR4_12_2');
const LR5_1 = document.getElementById('LR5_1_2');
const LR5_2 = document.getElementById('LR5_2_2');
const LR5_3 = document.getElementById('LR5_3_2');
const LR5_4 = document.getElementById('LR5_4_2');
const LR5_5 = document.getElementById('LR5_5_2');
const LR5_6 = document.getElementById('LR5_6_2');
const LR5_7 = document.getElementById('LR5_7_2');
const LR5_8 = document.getElementById('LR5_8_2');
const LR5_9_1 = document.getElementById('LR5_9_1_2');
const LR5_9_2 = document.getElementById('LR5_9_2_2');
const LR5_10 = document.getElementById('LR5_10_2');
const RR1_1 = document.getElementById('RR1_1_2');
const RR1_2 = document.getElementById('RR1_2_2');
const RR1_3 = document.getElementById('RR1_3_2');
const RR1_4 = document.getElementById('RR1_4_2');
const RR2_1 = document.getElementById('RR2_1_2');
const RR2_2 = document.getElementById('RR2_2_2');
const RR2_3 = document.getElementById('RR2_3_2');
const RR3_1 = document.getElementById('RR3_1_2');
const RR3_2 = document.getElementById('RR3_2_2');
const RR3_3 = document.getElementById('RR3_3_2');
const RR4_1 = document.getElementById('RR4_1_2');
const RR4_2 = document.getElementById('RR4_2_2');
const RR4_3 = document.getElementById('RR4_3_2');
const RR5_1 = document.getElementById('RR5_1_2');
const RR5_2 = document.getElementById('RR5_2_2');
const RC1 = document.getElementById('RC1_2');
const RC2 = document.getElementById('RC2_2');


// Variable Declaration
// let higlight_back = null;
let ques_arr = [];
let ques_arr2= [];
let ans_arr = [];
let wrong_arr = [];
let final_ans = [];
let wrong_count = 0.0;
let word_count = 0;
let right_arr = [];
let ques_len = 10;
let back_setting = 0;
let fontSize = 28.0;
let final_ques = "";
let keysPressed = {};
let sel_obj = new selection_opt();
let duration = 0;
let avg_word_len = 5;
let firstKeyPress = true;
let curr_char = '';
let curr_word = '';
let cur_char_index = 0;
let len_ofword = 0;
let curr_word_index = 0;
let instance;
let prev_light_key;
let alt_key = [];
let space_check = false;
let alt_handle = [false,null];
let r_switch_key;
let l_switch_key;
let key_color = '#ff3c5f';

// important functions 
// Adjusting question length based on time
function exam_length(ex_type,word_file){
    let word_file_temp = word_file.trim();
    let word_file_arr = word_file_temp.split(' ');
    let total_words = word_file_arr.length;
    let repeat_bool = false;
    if(ex_type == 'ex1'){
        let total_char = 0;
        word_file_arr.forEach((word)=>{
            total_char = total_char+word.length;
        });
        avg_word_len = total_char/total_words;
        ques_len = (500 * parseInt(sel_obj.time))/avg_word_len;
        if(ques_len > total_words){
            ques_len = ques_len/total_words;
            repeat_bool = true;
        }
    }else{
        ques_len = (100 * parseInt(sel_obj.time))/total_words;
        if(ques_len>1){
            repeat_bool = true;            
        }else{
            ques_len = 100*parseInt(sel_obj.time);
            repeat_bool = false;            
        }
    }
    if(Number.isInteger(ques_len)){
        if(repeat_bool){
            final_ques = word_file.repeat(ques_len);
        }else{
            let str_arr = word_file_arr.splice(0,ques_len);
            final_ques = str_arr.join(' ');
        }
    }else{
        let abs_value = parseInt(ques_len);
        let dec_val = parseInt((ques_len-abs_value)*10);
        let str = '';
        if(repeat_bool){
            final_ques = word_file.repeat(abs_value);
            if(dec_val<word_file_arr[0].length){
                for(let i = 0;i<dec_val;i++){
                    str = str + word_file_arr[0][i];
                }
            }else{
                let temp_val = dec_val;
                for(let i = 0;i<dec_val;i++){
                    if(temp_val>word_file_arr[i].length){
                        final_ques = final_ques + word_file_arr[i] + " ";
                        temp_val = temp_val-word_file_arr[i].length;
                    }else{
                        str = word_file_arr[i].substring(0,temp_val);
                        break;
                    }
                }
            }
        }
        else{
            let str_arr = word_file_arr.splice(0,abs_value);
            final_ques = str_arr.join(' ');
            str = word_file_arr[abs_value+1];
        }
        final_ques = final_ques + str;
    }
    ques_arr = final_ques.split(" ");
    ques_arr2 = final_ques.split(" ");
    question_txt.innerText = final_ques;
}
function highlight_text(){
    if(!space_check){
        instance.markText(cur_char_index,word_count);
    }else{
        instance.markText(0,word_count+1);
    }
}
function resultSend(){
    window.location.href = "learning.html";
}

// function to updateCharcheck
function updateCharcheck(){
    curr_word = ques_arr2[curr_word_index];
    curr_char = curr_word[0];
    cur_char_index = 0;
    len_ofword = curr_word.length;
    mapFingure(curr_char);
}
function moveToNextFing(){
    cur_char_index++;
    curr_char = curr_word[cur_char_index];
    if (typeof curr_char === 'undefined') {
        curr_char = " ";
    }
    mapFingure(curr_char);
}
// function for timer of the exam
function examTimer(){
    // Setting up the timmer once the key is pressed
    duration = sel_obj.time * 60; // minutes in seconds

    let intervalId = setInterval(function() {
        duration--;
        let minutes = Math.floor(duration / 60);
        let seconds = duration % 60;
        // timer_txt.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        if (duration === 0) {
        clearInterval(intervalId);
        resultSend();
        // window.close();
        }
    }, 1000);
}
// function to light up the respective funtion 
function finLight(fin='',cap_chk=false){
    switch(fin){
        case 'lh1':
            h1_fin1.style.display = 'block';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'lh2':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'block';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'lh3':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'block';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'lh4':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'block';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'lh5':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'block';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'Rh1':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'block';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'Rh2':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'block';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'Rh3':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'block';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
        case 'Rh4':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'block';
            h2_fin5.style.display = 'none';
            break;
        case 'Rh5':
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'block';
            break;
        default:
            h1_fin1.style.display = 'none';
            h1_fin2.style.display = 'none';
            h1_fin3.style.display = 'none';
            h1_fin4.style.display = 'none';
            h1_fin5.style.display = 'none';
            h2_fin1.style.display = 'none';
            h2_fin2.style.display = 'none';
            h2_fin3.style.display = 'none';
            h2_fin4.style.display = 'none';
            h2_fin5.style.display = 'none';
            break;
    }
    if(cap_chk){
        h1_fin4.style.display = 'block';
    }
}

// function to map keys and fingure tips
function mapFingure(char){
    let charCode = char.charCodeAt(0);
    // ALT case
    if(charCode > 126){
        altMap(char,true);
        return;
    }
    charCode = charCode + 32;
    let comparison = String.fromCharCode(charCode);
    if(char == " "){
        finLight();
        LR5_5.style.fill = key_color;
        h2_fin5.style.display = 'block';
        return;
    }else{
        LR5_5.style.fill = 'gainsboro';
    }
    if(LR4_1.getAttribute('fill') == key_color){
        LR4_1.style.fill = 'gainsboro';
    }
    if(LR4_12.getAttribute('fill') == key_color){
        LR4_12.style.fill = 'gainsboro';
    }
    if(comparison === char.toLowerCase()) {
        //activate switch
        try{
            if(char == 'Q' || char == 'W' || char == 'E' || char == 'R' || char == 'T' || char == 'A' || char == 'S' || char == 'D' || char == 'F' || char == 'G' || char == 'Z' || char == 'X' ||char == 'C' || char == 'V' || char == 'B' || char == '!' ||char == '~' || char == '@' || char == '#' || char == '$' ||char == '%'){
                LR4_12.style.fill = key_color;
            }else{
                LR4_1.style.fill = key_color;
            }
        }catch(e){
            
        }
        h1_fin4.style.display = 'block';
    }else{
        h1_fin4.style.display = 'none';
    }
    try{
        prev_light_key.style.fill = 'gainsboro';
    }catch(e){
        prev_light_key = LR3_2;
    }
    switch(char.toLowerCase()){
        case 'a':
            LR3_2.style.fill = key_color;
            prev_light_key = LR3_2;
            finLight('lh4');
            break;
        case 'b':
            LR4_6.style.fill = key_color;
            prev_light_key = LR4_6;
            finLight('lh1');
            break;
        case 'c':
            LR4_4.style.fill = key_color;
            prev_light_key = LR4_4;
            finLight('lh2');
            break;
        case 'd':
            LR3_4.style.fill = key_color;
            prev_light_key = LR3_4;
            finLight('lh2');
            break;
        case 'e':
            LR2_4.style.fill = key_color;
            prev_light_key = LR2_4;
            finLight('lh3');
            break;
        case 'f':
            LR3_5.style.fill = key_color;
            prev_light_key = LR3_5;
            finLight('lh1');
            break;
        case 'g':
            LR3_6.style.fill = key_color;
            prev_light_key = LR3_6;
            finLight('lh1');
            break;
        case 'h':
            LR3_7.style.fill = key_color;
            prev_light_key = LR3_7;
            finLight('Rh1');
            break;
        case 'i':
            LR2_9.style.fill = key_color;
            prev_light_key = LR2_9;
            finLight('Rh2');
            break;
        case 'j':
            LR3_8.style.fill = key_color;
            prev_light_key = LR3_8;
            finLight('Rh1');
            break;
        case 'k':
            LR3_9.style.fill = key_color;
            prev_light_key = LR3_9;
            finLight('Rh2');
            break;
        case 'l':
            LR3_10.style.fill = key_color;
            prev_light_key = LR3_10;
            finLight('Rh3');
            break;
        case 'm':
            LR4_8.style.fill = key_color;
            prev_light_key = LR4_8;
            finLight('Rh1');
            break;
        case 'n':
            LR4_7.style.fill = key_color;
            prev_light_key = LR4_7;
            finLight('Rh1');
            break;
        case 'o':
            LR2_10.style.fill = key_color;
            prev_light_key = LR2_10;
            finLight('Rh3');
            break;
        case 'p':
            LR2_11.style.fill = key_color;
            prev_light_key = LR2_11;
            finLight('Rh4');
            break;
        case 'q':
            LR2_2.style.fill = key_color;
            prev_light_key = LR2_2;
            finLight('lh4');
            break;
        case 'r':
            LR2_5.style.fill = key_color;
            prev_light_key = LR2_5;
            finLight('lh1');
            break;
        case 's':
            LR3_3.style.fill = key_color;
            prev_light_key = LR3_3;
            finLight('lh3');
            break;
        case 't':
            LR2_6.style.fill = key_color;
            prev_light_key = LR2_6;
            finLight('lh1');
            break;
        case 'u':
            LR2_8.style.fill = key_color;
            prev_light_key = LR2_8;
            finLight('Rh1');
            break;
        case 'v':
            LR4_5.style.fill = key_color;
            prev_light_key = LR4_5;
            finLight('lh1');
            break;
        case 'w':
            LR2_3.style.fill = key_color;
            prev_light_key = LR2_3;
            finLight('lh3');
            break;
        case 'x':
            LR4_3.style.fill = key_color;
            prev_light_key = LR4_3;
            finLight('lh3');
            break;
        case 'y':
            LR2_7.style.fill = key_color;
            prev_light_key = LR2_7;
            finLight('Rh1');
            break;
        case 'z':
            LR4_2.style.fill = key_color;
            prev_light_key = LR4_2;
            finLight('lh4');
            break;
        case '{':
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_12;
            LR2_12.style.fill = key_color;
            prev_light_key = LR2_12;
            finLight('Rh4');
            // finLight('');
            break;
        case '[':
            LR2_12.style.fill = key_color;
            prev_light_key = LR2_12;
            finLight('Rh4');
            break;
        case '}':
            LR4_12.style.fill = key_color;
            LR2_13.style.fill = key_color;
            prev_light_key = LR2_13;
            r_switch_key = LR4_12;
            finLight('Rh4');
            break;
        case ']':
            LR2_13.style.fill = key_color;
            finLight('Rh4');
            break;
        case '|':
            LR4_12.style.fill = key_color;
            LR2_14.style.fill = key_color;
            prev_light_key = LR2_14;
            r_switch_key = LR4_12;
            finLight('Rh4');
            break;
        case "'\'":
            LR2_14.style.fill = key_color;
            prev_light_key = LR2_14;
            finLight('Rh4');
            break;
        case "<":
            LR4_1.style.fill = key_color;
            LR4_9.style.fill = key_color;
            prev_light_key = LR4_9;
            l_switch_key = LR4_1;
            finLight('lh4');
            finLight('Rh2');
            break;
        case ">":
            LR4_1.style.fill = key_color;
            LR4_10.style.fill = key_color;
            prev_light_key = LR4_10;
            l_switch_key = LR4_1;
            finLight('lh4');
            finLight('Rh3');
            break;
        case ':':
            LR4_1.style.fill = key_color;
            LR3_11.style.fill = key_color;
            prev_light_key = LR3_11;
            l_switch_key = LR4_1;
            finLight('Rh4');
            finLight('lh4');
            break;
        case ';':
            LR3_11.style.fill = key_color;
            prev_light_key = LR3_11;
            finLight('Rh4');
            finLight('Rh4');
            break;
        case '"':
            LR4_12.style.fill = key_color;
            LR3_12.style.fill = key_color;
            prev_light_key = LR3_12;
            r_switch_key = LR4_12;
            finLight('Rh4');
            break;
        case "'":
            LR3_12.style.fill = key_color;
            prev_light_key = LR3_12;
            break;
        case '?':
            LR4_12.style.fill = key_color;
            LR4_11.style.fill = key_color;
            r_switch_key = LR4_12;
            finLight('Rh4');
            break;
        case '/':
            LR4_11.style.fill = key_color;
            prev_light_key = LR4_11;
            finLight('Rh4');
            break;
        case '.':
            LR4_10.style.fill = key_color;
            prev_light_key = LR4_10;
            finLight('Rh3');
            break
        case '':
            LR4_12.style.fill = key_color;
            LR4_9.style.fill = key_color;
            prev_light_key = LR4_9;
            r_switch_key = LR4_12;
            break;
        case ',':
            LR4_9.style.fill = key_color;
            prev_light_key = LR4_9;
            finLight('Rh2');
            break
        case '`':
            LR1_1.style.fill = key_color;
            prev_light_key = LR1_1;
            finLight('lh4');
            break;
        
        case '1':
            LR1_2.style.fill = key_color;
            prev_light_key = LR1_2;
            finLight('lh4');
            break;
        
        case '2':
            LR1_3.style.fill = key_color;
            prev_light_key = LR1_3;
            finLight('lh3');
            break;
        
        case '3':
            LR1_4.style.fill = key_color;
            prev_light_key = LR1_4;
            finLight('lh2');
            break;
        
        case '4':
            LR1_5.style.fill = key_color;
            prev_light_key = LR1_5;
            finLight('lh1');
            break;
        
        case '5':
            LR1_5.style.fill = key_color;
            prev_light_key = LR1_5;
            finLight('lh1');
            break;
        
        case '6':
            LR1_7.style.fill = key_color;
            prev_light_key = LR1_7;
            finLight('Rh1');
            break;
        
        case '7':
            LR1_8.style.fill = key_color;
            prev_light_key = LR1_8;
            finLight('Rh1');
            break;
        
        case '8':
            LR1_9.style.fill = key_color;
            prev_light_key = LR1_9;
            finLight('Rh2');
            break;
        
        case '9':
            LR1_10.style.fill = key_color;
            prev_light_key = LR1_10;
            finLight('Rh3');
            break;
        
        case '0':
            LR1_11.style.fill = key_color;
            prev_light_key = LR1_11;
            finLight('Rh4');
            break;

        case '-':
            LR1_12.style.fill = key_color;
            prev_light_key = LR1_12;
            finLight('Rh4');
            break;
        
        case '=':
            LR1_13.style.fill = key_color;
            prev_light_key = LR1_13;
            finLight('Rh4');
            break;
        
        case '~':
            LR1_1.style.fill = key_color;
            LR4_1.style.fill = key_color;
            l_switch_key = LR4_1;
            prev_light_key = LR1_1;
            finLight('lh4');
            break;
        
        case '!':
            LR1_2.style.fill = key_color;
            LR4_1.style.fill = key_color;
            l_switch_key = LR4_1;
            prev_light_key = LR1_2;
            finLight('lh4');
            break;
        
        case '@':
            LR1_3.style.fill = key_color;
            LR4_1.style.fill = key_color;
            l_switch_key = LR4_1;
            prev_light_key = LR1_3;
            finLight('lh3');
            break;
        
        case '#':
            LR1_4.style.fill = key_color;
            LR4_1.style.fill = key_color;
            l_switch_key = LR4_1;
            prev_light_key = LR1_4;
            finLight('lh2');
            break;
        
        case '$':
            LR1_5.style.fill = key_color;
            LR4_1.style.fill = key_color;
            l_switch_key = LR4_1;
            prev_light_key = LR1_5;
            finLight('lh1');
            break;
        
        case '%':
            LR1_6.style.fill = key_color;
            LR4_1.style.fill = key_color;
            l_switch_key = LR4_1;
            prev_light_key = LR1_6;
            finLight('lh1');
            break;
        
        case '^':
            LR1_7.style.fill = key_color;
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_1;
            prev_light_key = LR1_7;
            finLight('Rh1');
            break;
        
        case '&':
            LR1_8.style.fill = key_color;
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_12;
            prev_light_key = LR1_8;
            finLight('Rh1');
            break;
        
        case '*':
            LR1_9.style.fill = key_color;
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_12;
            prev_light_key = LR1_9;
            finLight('Rh2');
            break;
        
        case '(':
            LR1_10.style.fill = key_color;
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_12;
            prev_light_key = LR1_10;
            finLight('Rh3');
            break;
        
        case ')':
            LR1_11.style.fill = key_color;
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_12;
            prev_light_key = LR1_11;
            finLight('Rh4');
            break;
        
        case '_':
            LR1_12.style.fill = key_color;
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_12;
            prev_light_key = LR1_12;
            finLight('Rh4');
            break;
        
        case '+':
            LR1_13.style.fill = key_color;
            LR4_12.style.fill = key_color;
            r_switch_key = LR4_12;
            prev_light_key = LR1_13;
            finLight('Rh4');
            break;
        
        default:
            finLight();
            break;
    }
}


// Listining to messgage from main class
ipcRenderer.on('load-page', (event, data) => {
    sel_obj.lang = data.lang;
    sel_obj.time = parseInt(data.time);
    sel_obj.exam = data.exam;
    sel_obj.ex_font = data.ex_font;
    sel_obj.file_path = data.file_path;
    // backspace radio Trigger
    fetch(sel_obj.file_path)
    .then(response => response.text())
    .then(text => {
        exam_length(sel_obj.exam,text);
        instance = new textHighlight(sel_obj.lang,ques_arr,question_txt,key_color);
        finLight();
        if(data.learn_txt != null){
            ans_txt.value = data.learn_txt;
            word_count = data.learn_count;
            curr_word_index = data.learn_count;
            if(data.learn_char_count != null){
               cur_char_index = data.learn_char_count;
               
               curr_word = ques_arr2[curr_word_index];
               curr_char = curr_word[cur_char_index];
    
               len_ofword = curr_word.length;
               mapFingure(curr_char);

            }else{
                updateCharcheck();
            }
        }else{
            updateCharcheck();
        }
         
        if(highlight_chk){
            instance.markText(cur_char_index,word_count);
            // higlight_back = document.querySelector(".hlta-container");
            // higlight_back.style.fontFamily = sel_obj.ex_font;
            // higlight_back.style.fontSize = fontSize.toFixed(2) + "px";
            // higlight_back.style.fontSize = sel_obj.fontSize;
        }
        else {
            // higlight_back = document.querySelector(".hlta-container");
            // higlight_back.style.fontFamily = sel_obj.ex_font;
            // higlight_back.style.fontSize = fontSize.toFixed(2) + "px";
        }
        if(ques_arr2[word_count][cur_char_index]){
            alt_tet_handle.innerText = "Press " + ques_arr2[word_count][cur_char_index];
        }
        if(alt_handle[0]){
            alt_tet_handle.innerText = "ALT + 0" + charCode; 
        }
    })
    .catch(error => console.log(error));
    question_txt.style.fontFamily = sel_obj.ex_font;
    ans_txt.style.fontFamily = sel_obj.ex_font;
    question_txt.style.fontSize = fontSize.toFixed(2) + "px";
    ans_txt.focus();
});

ans_txt.addEventListener('keyup', function(event) {
    delete keysPressed[event.key]; // Remove the released key from the keysPressed object
});
ans_txt.addEventListener('input', function(event) {
    if(keysPressed['Alt']){
        if(event.data === ques_arr2[curr_word_index][cur_char_index]){
            updateChar();
            alt_handle = [false,null];
            printCharInAltText(charCode);
            changeAlt_Shit_key(ques_arr2[curr_word_index][cur_char_index].charCodeAt(0));
            if(highlight_chk){
                highlight_text();
            }
            return;
        }   
    }
});
// event on key press
ans_txt.addEventListener("keydown",function(event){
    if (event.key !== ques_arr2[curr_word_index][cur_char_index]) {
        let bool = true;
        if(event.key === "Shift" ||event.key === "Alt" || event.key === " "){
            switch(event.key){
                case "Shift":
                    if(ques_arr2[curr_word_index][cur_char_index].toUpperCase() === event.key){
                        bool = false;
                    }
                    break;
                case "Alt":
                    let charCode = ques_arr2[curr_word_index][cur_char_index].charCodeAt(0);
                    if(charCode > 126){
                        keysPressed[event.key] = true;
                        if(!event.repeat){
                            if( Object.keys(keysPressed).length > 1 ){
                                if(alt_handle[0]){
                                    altMap(alt_handle[1],false)
                                    return;
                                }
                            }
                        }
                        return;
                    }
                    break;
                case " ":
                    if(space_check){
                        word_count++;
                        curr_word_index++;
                        updateCharcheck();
                        printCharInAltText(ques_arr2[curr_word_index][cur_char_index].charCodeAt(0));
                        changeAlt_Shit_key();
                        bool = false;
                        space_check = false;
                        if(highlight_chk){
                            highlight_text();
                        }
                        return;
                    }
                    break;
            }
        }
        if(bool){
            event.preventDefault();
            return;
        }
    }
    if(event.key === "Shift" ||event.key === "Alt"){
        keysPressed[event.key] = true;
    }
    if (firstKeyPress && event.key === " ") {
        examTimer();
        firstKeyPress = false;
    }
    if(keysPressed['Alt']){
        if(!event.repeat){
            if( Object.keys(keysPressed).length > 1 ){
                if(alt_handle[0]){
                    altMap(alt_handle[1],false)
                    return;
                }
            }
        }
    }
    updateChar();
    printCharInAltText(charCode);
    changeAlt_Shit_key(ques_arr2[curr_word_index][cur_char_index].charCodeAt(0));
    if(highlight_chk){
        highlight_text();
    }
});
function changeAlt_Shit_key(){
    if(LR4_1.getAttribute('fill') == '#D9D9D9' || LR4_1.getAttribute('fill') == key_color){
        LR4_1.style.fill = 'gainsboro';
    }
    if(LR4_12.getAttribute('fill') == key_color || LR4_12.getAttribute('fill') == '#D9D9D9'){
        LR4_12.style.fill = 'gainsboro';
    }
}
function updateChar(){
    if(cur_char_index < len_ofword-1){
        moveToNextFing();
    }else if(cur_char_index === len_ofword-1){
        space_check = true
        return;
    }
}
function printCharInAltText(charCode){
    if(alt_handle[0]){
        alt_tet_handle.innerText = "ALT + 0" + charCode; 
    }
    else if(space_check){
        alt_tet_handle.innerText = "Press Space";
    }
    else{
        alt_tet_handle.innerText = "Press " + ques_arr2[word_count][cur_char_index];
    }
}
function altMap(char,first_check){
    let charCode = char.charCodeAt(0);
    alt_handle = [true,char];
    if(first_check){
        if(prev_light_key){
            prev_light_key.style.fill = 'gainsboro';   
        }
    }
    switch(charCode){
        case 8212:
            if(first_check){
                alt_key.push(RR4_1);
                alt_key.push(RR3_2);
                alt_key.push(RR4_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 161:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR3_3);
                alt_key.push(RR4_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 163:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR3_3);
                alt_key.push(RR4_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 165:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR3_3);
                alt_key.push(RR3_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 170:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_1);
                alt_key.push(RR5_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 171:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_1);
                alt_key.push(RR4_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 179:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_1);
                alt_key.push(RR2_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 182:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_2);
                alt_key.push(RR4_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 184:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_2);
                alt_key.push(RR3_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 188:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_2);
                alt_key.push(RR2_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 189:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_2);
                alt_key.push(RR2_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 193:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_3);
                alt_key.push(RR4_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 197:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_3);
                alt_key.push(RR2_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 204:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR5_1);
                alt_key.push(RR4_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 205:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR5_1);
                alt_key.push(RR3_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 206:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR5_1);
                alt_key.push(RR3_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 216:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_1);
                alt_key.push(RR3_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 217:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_1);
                alt_key.push(RR2_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 221:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR4_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 224:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR3_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 225:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR3_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 226:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR3_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 227:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR2_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 228:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR2_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 230:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_3);
                alt_key.push(RR5_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 233:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_3);
                alt_key.push(RR4_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 236:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_3);
                alt_key.push(RR2_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 238:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_3);
                alt_key.push(RR1_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 243:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR3_1);
                alt_key.push(RR4_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 183:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_1);
                alt_key.push(RR2_2);
                alt_key.push(RR4_3);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 207:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR5_1);
                alt_key.push(RR2_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 212:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_1);
                alt_key.push(RR4_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 214:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_1);
                alt_key.push(RR3_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 220:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR5_1);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        case 222:
            if(first_check){
                alt_key.push(RR5_1);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                alt_key.push(RR4_2);
                LR5_4.style.fill = key_color;
                finLight('lh4');
                altHandle(charCode);
            }else{
                altHandle(charCode);
            }
            break;
        default:
            alt_handle[false,null]
            break;
    }
}
function altHandle(charCode){
    if( alt_key.length > 0){
        alt_tet_handle.innerText = "ALT + 0" + charCode;
        if(prev_light_key){
            prev_light_key.style.fill = 'gainsboro';
        }
        LR5_4.style.fill = key_color;
        let key = alt_key.shift()
        key.style.fill = key_color;
        prev_light_key = key;
        let fac10 = alt_key.length * 10;
        let tempCharCode = Math.floor(charCode / fac10);
        if(tempCharCode>=9){
            tempCharCode = tempCharCode%10;
        }
        let num;
        if(tempCharCode == 1 || tempCharCode == 4 || tempCharCode == 7 ){
            num = '1';
        }else if(tempCharCode == 2 || tempCharCode == 5 || tempCharCode == 8){
            num = '2';
        }else{
            num = '3';
        }
        let rightfin = 'Rh' + num;
        finLight('lh4');
        finLight(rightfin);
    }
    else{
        alt_tet_handle.innerText = "";
        alt_handle = [false,null];
        LR5_4.style.fill = 'gainsboro';
        if(cur_char_index < len_ofword){
            moveToNextFing();
        }
        else{
            curr_word_index++;
            updateCharcheck();
            word_count++;
        }
        if(highlight_chk){
            highlight_text();
        }
    } 
}