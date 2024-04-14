// Class Imports
import { selection_opt } from './selopt.js';
import { textHighlight } from './texthighlighter.js';
import { result_class } from './result_class.js';
// constant declaration
const { ipcRenderer } = require('electron');
const path = require('path');

const question_txt = document.getElementById("ques_txt");
const ans_txt = document.getElementById("text_cont");
const submit_btn = document.getElementById("submit_btn");
const learn_btn = document.getElementById('learn_btn');
const font_up = document.getElementById("font_up");
const font_down = document.getElementById("font_down");
const font_txt = document.getElementById("cur_font");
const rword_txt = document.getElementById("rwords");
const wword_txt = document.getElementById("wwords");
const timer_txt = document.getElementById("time_id");
const highlight_chkbox = document.getElementById("highlight");
const scroll_chkbox = document.getElementById("scroll");
const sound_chkbox = document.getElementById("sound");
const full_scr = document.getElementById('full_scr');
const setting = document.querySelector(".settings-container");
const back_radios = document.querySelectorAll(['input[type = "radio"][name = "backspace_set"']);
const selection_container = document.querySelector('.selection-container');
const openingBrac = "&lt;";
const closingBrac = "&gt;";

// Variable Declaration
let howtotype = false;
let higlight_back = null;
let ques_arr = [];
let ans_arr = [];
let wrong_arr = [];
let enter_penalties = 0;
let enter_bool = false;
let final_ans = [];
let wrong_count = 0.0;
let word_count = 0;
let right_arr = [];
let ques_len = 0;
let back_setting = 0;
let fontSize = 22.0;
let final_ques = "";
let backspce_count = 0;
let sel_obj = new selection_opt();
let duration = 0;
let avg_word_len = 5;
let firstKeyPress = true;
let instance = new textHighlight(question_txt);
let intervalId = null;
let isPaused = false;

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
    question_txt.value = final_ques;
}

// Name: Lakshya Dujari
// Date: 05.09.2023
// Comment Added function for checking mistakes and text highlighter
function checking_mistakes(ans_word,ques_word){//returns .5,1
    if( ans_word == ques_word){
        return 0;
    }
    else{
        let skipped = false;
        if(checkEmptySpace(ans_word)){
            word_count--;
            ques_arr.unshift(ques_word);
            return .5;   
        }
        // checking if str1 + str2 is true
        if (ans_word == ques_word+ques_arr[0]){
            return .5;
        }
        else if(enter_bool){//checking if wrong enter is pressed
            let enter_w = ans_word.split('\n');
            if(enter_w[0] == ''){
                let ent_final_push = '<span style="background-color: yellow; width:fit-content; font-family:Arial;">{\n}</span>';
                wrong_count = wrong_count+.5;
                final_ans.push(ent_final_push);
                wword_txt.textContent = " Wrong Words: " + wrong_count; 
                let after_res = checking_mistakes(enter_w[1],ques_word);
                if(after_res == .5){
                    wrongWordUpdate(enter_w[1],ques_word,after_res);
                }
                else if(after_res == 0){
                    rightWordUpdate(enter_w[1]);
                }
                else{
                    wrongWordUpdate(enter_w[1],ques_word,after_res);
                }
            }else{
                let befor_w = ques_word;
                let after_w = ques_arr.shift();
                let before_er = checking_mistakes(enter_w[0],befor_w);
                let after_er = checking_mistakes(enter_w[1],after_w);
                word_count++;
                if(before_er == .5){
                    wrongWordUpdate(enter_w[0],befor_w,before_er);
                }
                else if(before_er == 0){
                    rightWordUpdate(enter_w[0]);
                }
                else{
                    wrongWordUpdate(enter_w[0],befor_w,1);
                }
                let ent_final_push = '<span style="background-color: yellow; width:fit-content; font-family:Arial;">{Wrong Enter}</span>';
                wrong_count = wrong_count+.5;
                wword_txt.textContent = " Wrong Words: " + wrong_count;
                final_ans.push(ent_final_push);
                if(after_er == .5){
                    wrongWordUpdate(enter_w[1],after_w,after_er);
                }else if(after_er == 0){
                    rightWordUpdate(enter_w[1]);
                }else{
                    wrongWordUpdate(enter_w[0],befor_w,1);
                }
            }
            enter_penalties++;
            return -1;
        }
        else{
            var letter_wchk = ans_word.split("");
            var letter_rchk = ques_word.split("");
            if(letter_rchk.length + 1 < letter_wchk.length){
                // return 1;
                skipped = true;
            } else {
                let return_ans = 0;
                let j = 0;
                for( let i=0; i<letter_rchk.length; i++){
                    if(letter_rchk[i] !== letter_wchk[j]){
                        try{
                            // Name: Lakshya Dujari
                            // Date: 01.04.2024
                            // Comment: handling alt variations
                            let charCode = letter_rchk[i].charCodeAt(0);
                            if(charCode > 126){
                                /*
                                    क्र = d+z या alt+0216
                                    द्र = n+z या alt+0230
                                    प्र =  I+z या alt+0231 अथवा alt+0193
                                    कृ= d+left साईड एकदम कोर्नर हलन्त या alt+0209 अथवा alt+0151 match करवाना हैं कैसे भी दबा लो सही होना चाहिए ( जय बाबा री)
                                */
                               switch(charCode){
                                case 216:
                                    if(letter_wchk[j] + letter_wchk[j+1] === 'dz'){
                                        j += 2;
                                        continue;
                                    }
                                    break;
                                case 230:
                                    if(letter_wchk[j] + letter_wchk[j+1] === 'nz'){
                                        j += 2;
                                        continue;
                                    }
                                    break;
                                case 231:
                                    if(letter_wchk[j] + letter_wchk[j+1] === 'iz'){
                                        j += 2;
                                        continue;
                                    }
                                    break;
                                case 193:
                                    if(letter_wchk[j] + letter_wchk[j+1] === 'dz'){
                                        j += 2;
                                        continue;
                                    }
                                    break;
                                case 209:
                                    if(letter_wchk[j] + letter_wchk[j+1] === 'dz'){
                                        j += 2;
                                        continue;
                                    }
                                    break;
                                case 151:
                                    if(letter_wchk[j] + letter_wchk[j+1] === 'dz'){
                                        j += 2;
                                        continue;
                                    }
                                    break;
                                default:
                                    j+=2;
                                    break;
                               }
                            }
                            if(letter_rchk[i] == letter_wchk[j]){
                                j++;
                            }
                        }catch{
                            return_ans++;
                            break;
                        }
                        return_ans++;
                    }
                    else{
                        j++;
                    }
                    if(return_ans == 2){
                        // return 1;
                        skipped = true;
                        break;
                    }
                }
                if(return_ans === 0){
                    return 0;
                }else if(return_ans < 2){
                    return .5;
                }
                // return .5;
            }
        }
        if(skipped){
            let penalties = checkSkippedWords(ans_word);
            if(penalties != 0){
                let return_val ={
                    penalty: penalties,
                    skipped_bool: true,
                }
                return return_val;
            }
            else{
                return 1;
            }
        }
    }
}
// function to highlight text 
function highlight_text(){
    let textHighlight = '';
    let caseSensitive = true;
    instance.search(textHighlight,caseSensitive,word_count); 
}
// checking empty spaces
function checkEmptySpace(char){
    if(char == ""){
        return true;
    }
    return false;
}
// cheking how many words skipped
function checkSkippedWords(word){
    let count_w = 1;
    for(let i=0;i<ques_arr.length;i++){
        if(ques_arr[i] == word){
            return count_w;
        }
        count_w++;
    }
    return 0;
}
// wrong word updates into respective array 
function wrongWordUpdate(wrong_word,right_word,fine){
    if(typeof(fine) == 'object' ){
        let str1 = right_word;
        str1 = str1.replace(/</g, "&lt;").replace(/>/g,"&gt;");
        let str2 = '<span style="background-color: #ff3c5f; width:fit-content"><span style="font-family:Arial;">{-}</span>' + str1 + "</span> ";
        wrong_arr.push(['-',str1,1,fine.penalty]);
        final_ans.push(str2);
        for(let i=0;i<fine.penalty-1;i++){
            str1 = ques_arr.shift();
            str1 = str1.replace(/</g, "&lt;").replace(/>/g,"&gt;");
            str2 = '<span style="background-color: #ff3c5f; width:fit-content"><span style="font-family:Arial;">{-}</span>' + str1 + "</span> ";
            // str2 = '';
            // if(i==fine-2){
            //     str2 = '-'+str1+'\}\'</span>';
            // }
            // else{
            //     str2 = '-' + str1;
            // }
            wrong_arr.push(['-',str1,1,fine.penalty]);
            final_ans.push(str2);
        }
        rightWordUpdate([ques_arr.shift(),fine.penalty]);
        word_count = word_count + fine.penalty;
        wrong_count = wrong_count+fine.penalty;
        wword_txt.textContent = " Wrong Words: " + wrong_count;
    }
    else{
        if(wrong_word == right_word+ques_arr[0]){
            wrong_arr.push([wrong_word,right_word+' '+ques_arr[0],fine]);
            let rightWordFormatted = right_word.replace(/</g, "&lt;").replace(/>/g,"&gt;");
            let wrongWordFormatted = wrong_word.replace(/</g, "&lt;").replace(/>/g,"&gt;");
            let str1 = '<span style="background-color: yellow; width:fit-content">'+ rightWordFormatted + '<span style="font-family:Arial;">{-}</span>' + ques_arr.shift().replace(/</g, "&lt;").replace(/>/g,"&gt;")+ "</span>";
            word_count++;
            final_ans.push(str1);
        }else if(wrong_word == ""){
            wrong_arr.push([wrong_word,right_word,fine]);
            // let str1 = '<span style="background-color: yellow; width:fit-content">"<span style="font-family:Arial">{'-'}</span>"</span>';
            let str1 = '<span style="background-color: yellow; width:fit-content">'+wrong_word + "{-}</span>";
            if(sel_obj.lang == "Hindi_Exercise"){
                str1 = '<span style="background-color: yellow; width:fit-content; font-family:Arial;">{-}</span>';
            }
            final_ans.push(str1);
        }else{
            wrong_arr.push([wrong_word,right_word,fine]);
            let str1 = '';
            let wrongWordFormatted = wrong_word.replace(/</g, "&lt;").replace(/>/g,"&gt;");
            let rightWordFormatted = right_word.replace(/</g, "&lt;").replace(/>/g,"&gt;");
            if(fine == 1){
                str1 = '<span style="background-color: #ff3c5f; width:fit-content">'+ wrongWordFormatted + '<span style="font-family:Arial;">{</span>' + rightWordFormatted + '<span style="font-family:Arial;">}</span></span>';
            }else{
                str1 = '<span style="background-color: yellow; width:fit-content">'+wrongWordFormatted + '<span style="font-family:Arial;">{</span>' + rightWordFormatted + '<span style="font-family:Arial;">}</span></span>';
            }
            final_ans.push(str1);
        }
        wrong_count = wrong_count+fine;
        wword_txt.textContent = " Wrong Words: " + wrong_count;
    }
}
function rightWordUpdate(word){
    right_arr.push(word);
    // console.log(typeof(word));
    if(typeof(word) == 'object'){//to pust the last correct of skipped word which is correct 
        let str1 = word[0];
        str1 = srt1.replace(/</g, "&lt;").replace(/>/g,"&gt;");
        final_ans.push(str1);
    }else{
        let str1 = word.replace(/</g, "&lt;").replace(/>/g,"&gt;");
        final_ans.push(str1);
    }
    rword_txt.textContent = "Right Words: " +right_arr.length;
}
// adjusting question array and right and wrong array based on backspace cliked
function backspaceAdjust(currentWord){
    let right_last_ele = right_arr[right_arr.length - 1];
    let wrong_last_ele = wrong_arr[wrong_arr.length - 1];
    if(typeof(currentWord) == 'undefined'){
        backspce_count++;
        return;
    }
    if(typeof(right_last_ele) == 'object'){
        if(right_last_ele[0] == currentWord){
            // adjusting the current word
            let temp = right_arr.pop();
            ques_arr.unshift(temp[0]);
            rword_txt.textContent = "Right Words: " +right_arr.length;
            word_count--;
            backspce_count++;
            // adjusting the skipped word
            let n = temp[1]
            for(let i=0;i<n;i++){
                let wrong_pop = wrong_arr.pop();
                ques_arr.unshift(wrong_pop[1]);
                wrong_count--;
            }
            backspce_count++;
            word_count--;
            wword_txt.textContent = " Wrong Words: " + wrong_count;
        }
    }else if(right_last_ele == currentWord){
        let temp = right_arr.pop();
        ques_arr.unshift(temp);
        rword_txt.textContent = "Right Words: " +right_arr.length;
        word_count--;
        backspce_count++;
    }else{
        try{
            if(wrong_last_ele[0] == currentWord){
                let wrong_pop = wrong_arr.pop();
                ques_arr.unshift(wrong_pop[1]);
                wrong_count--;
                backspce_count++;
                word_count--;
                wword_txt.textContent = " Wrong Words: " + wrong_count; 
            }else if(typeof(wrong_last_ele === 'undefined')){
                backspce_count++;
                return;
            }
        }catch(e){
            backspce_count++;
            return;
        }

    }
}

function startChecking(){
    let str = ans_txt.value;
    ans_arr = str.split(" ");
    let ans_chk = ans_arr.pop();
    let ques_chk = ques_arr.shift();
    if(enter_bool){
        // Remove \r character
        // try{
            ques_chk = ques_chk.replace(/\r/g, '');
        // }catch{
        //     ques_chk = ques_chk.split('\n');
        //     if(ques_chk[0][ques_chk[0].length - 2] === "'\'"){
        //         ques_chk[0] = ques_chk[0].splice(0,ques_chk[0].length-1);
        //     }
        //     ques_chk = ques_chk.join('\n');
        // }
    }
    let penalties = checking_mistakes(ans_chk,ques_chk);
    if(typeof(penalties) != 'object'){
        switch(penalties){
            case 0:
                rightWordUpdate(ans_chk);
                break;
            case 1:
                wrongWordUpdate(ans_chk,ques_chk,penalties);
                break;
            case .5:
                wrongWordUpdate(ans_chk,ques_chk,penalties);
                break
            case -1:
                break;
            default:
                wrongWordUpdate(ans_chk,ques_chk,penalties);
                break;
        }
    }else{
        wrongWordUpdate(ans_chk,ques_chk,penalties);
    }
    word_count++;
    if(highlight_chkbox.checked){
        highlight_text();
    }
    return;
}

function resultSend(){
    startChecking();
    let ques = final_ques.split(' ');
    var result_obj = new result_class(sel_obj.lang,sel_obj.exam,sel_obj.time,parseFloat(duration),ques,avg_word_len,final_ans,wrong_arr,right_arr,enter_penalties,ans_txt.value,backspce_count);
    ipcRenderer.send("test_result",result_obj);
}
// function for timer of the exam
function examTimer(){
    // Setting up the timer once the key is pressed
    duration = sel_obj.time * 60; // minutes in seconds

    intervalId = setInterval(function() {
        if (!isPaused) {
            duration--;
            let minutes = Math.floor(duration / 60);
            let seconds = duration % 60;
            timer_txt.textContent = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            if (duration === 0) {
                clearInterval(intervalId);
                resultSend();
                // window.close();
            }
        }
    }, 1000);
}
function pauseTimer() {
    isPaused = true;
}

function resumeTimer() {
    isPaused = false;
}
// Listining to messgage from main class
ipcRenderer.on('load-page', (event, data) => {
    sel_obj.lang = data.lang;
    sel_obj.time = parseInt(data.time);
    sel_obj.exam = data.exam;
    sel_obj.ex_font = data.ex_font;
    sel_obj.file_path = data.file_path;
    // Name: Lakshya Dujari
    // Date: 14.09.2023
    // Comment : commenting question length
    // ques_len = ques_len * parseInt(sel_obj.time);
    switch(sel_obj.exam){
        case 'ex1':
            back_setting = 1;
            highlight_chkbox.checked = false;
            break;
        case 'ex6':
            back_setting = 1;
            highlight_chkbox.checked = true;
            break;
        case 'ex2':
            back_setting = 1;
            highlight_chkbox.checked = false;
            // setting.style.display = 'none';
            break;
        case 'ex3':
            back_setting = 2;
            highlight_chkbox.checked = false;
            break;
        case 'ex5':
            back_setting = 2;
            highlight_chkbox.checked = false;
            break;
        default:
            back_setting = 0
            highlight_chkbox.checked = false;
    }
    // backspace radio Trigger
    back_radios.forEach(radio=>{
        if( radio.value == 1 && sel_obj.exam == 'ex1'){
            radio.checked = true;
        } else if( radio.value == 1 && (sel_obj.exam == 'ex2' || sel_obj.exam == 'ex6')){
            radio.checked = true;
        } else if(radio.value == 2 && (sel_obj.exam == 'ex3' || sel_obj.exam == "ex5")){
            radio.checked = true;
        }
        radio.addEventListener('change', (e) =>{
            back_setting = e.target.value;
        });
    });
    fetch(sel_obj.file_path,{
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
    })
    .then(response => response.text())
    .then(text => {
        exam_length(sel_obj.exam,text);
        if(highlight_chkbox.checked){
            let textHighlight = '';
            let caseSensitive = true;
            instance.search(textHighlight,caseSensitive,0);
            higlight_back = document.querySelector(".hlta-container");
            higlight_back.style.fontFamily = sel_obj.ex_font;
            higlight_back.style.fontSize = fontSize.toFixed(2) + "px";
        }
        else {
            higlight_back = document.querySelector(".hlta-container");
            higlight_back.style.fontFamily = sel_obj.ex_font;
            higlight_back.style.fontSize = fontSize.toFixed(2) + "px";
        }
    })
    .catch(error => console.log(error));
    question_txt.style.fontFamily = sel_obj.ex_font;
    ans_txt.style.fontFamily = sel_obj.ex_font;
    question_txt.style.fontSize = fontSize.toFixed(2) + "px";
    ans_txt.focus();
});

ans_txt.addEventListener("keydown",function(event){
    // event.preventDefault();
    // adding event on frst key press
    if (firstKeyPress) {
        // Your code to execute on the first space key press
        examTimer();
        firstKeyPress = false;
      }
    if(howtotype){
        resumeTimer();
        howtotype = false;
    }
    // Name: Lakshya Dujari 
    // Date: 04.09.2023
    // Comment : Added backspace logic to adjust marks and pointer to the correct location based on user Selection
    // code added on line
    if(event.keyCode === 8 || event.key === "Backspace"){
        let currentWordStart;
        let caretPos;
        let words;
        let currentWord;
        switch(parseInt(back_setting)){
            case 0:
                event.preventDefault();
                break;
            case 1:
                caretPos = ans_txt.selectionStart;
                words = ans_txt.value.substring(0, caretPos).split(" ");
                currentWord = words[words.length - 1];
                backspaceAdjust(currentWord);
                currentWordStart = ans_txt.value.lastIndexOf(currentWord);
                if (caretPos <= currentWordStart) {
                    event.preventDefault();
                }
                break;
            // Name: Lakshya Dujari
            // Date: 04.09.2023
            // Comment adding case for default handing of backspace
            default:
                caretPos = ans_txt.selectionStart;
                words = ans_txt.value.substring(0, caretPos).split(" ");
                currentWord = words[words.length - 1];
                backspaceAdjust(currentWord);
                currentWordStart = ans_txt.value.lastIndexOf(currentWord);
                break;
        }
        if(highlight_chkbox.checked){
            highlight_text();
        }
    }
    else if(event.keyCode === 32 || event.key === " "){
        startChecking();
        enter_bool = false;
    }
    else if(event.keyCode === 13 || event.key === "Enter"){
        enter_bool = true;
    }
    return;
});
window.addEventListener('keydown',(event)=>{
    if(event.key === 'Escape' || event.keyCode === 27){
        if(full_scr.checked){
            event.preventDefault();
            selection_container.style.display = 'flex';
            full_scr.checked = false;
        }
    }
});
// listining for highlighter change
highlight_chkbox.addEventListener('change',()=>{
    if(!highlight_chkbox.checked){
        instance.clear();
    } else {
        let textHighlight = '';
        let caseSensitive = true;   
        instance.search(textHighlight,caseSensitive,word_count);
        if(higlight_back == null ){
            higlight_back = document.querySelector(".hlta-container");
        }
    }
    ans_txt.focus();
});

full_scr.addEventListener('change',()=>{
    if(full_scr.checked){
        selection_container.style.display = 'none';
    }else{
        selection_container.style.display = 'flex';
    }
})
// font size change
font_up.addEventListener('click', (e) =>{
    fontSize = fontSize + .5;
    font_txt.textContent = fontSize.toFixed(2) + "px";
    higlight_back.style.fontSize = fontSize.toFixed(2) + "px";
    question_txt.style.fontSize = fontSize.toFixed(2) + "px";
    ans_txt.style.fontSize = fontSize.toFixed(2) + "px";
    ans_txt.focus();
});
font_down.addEventListener('click',(e) =>{
    fontSize = fontSize - .5;
    font_txt.textContent = fontSize.toFixed(2) + "px";
    higlight_back.style.fontSize = fontSize.toFixed(2) + "px";
    question_txt.style.fontSize = fontSize.toFixed(2) + "px";
    ans_txt.style.fontSize = fontSize.toFixed(2) + "px";
    ans_txt.focus();
});

// function for timer of the exam
function learnWordHandle(ans_chk,ques_chk){
    if(ans_chk.length > ques_chk.length){
        return -1
    }else{
        let i = 0;
        ques_chk.split('').forEach((char) =>{
            if(ans_chk[i] === undefined){
                return i;
            }
            if(char != ques_chk[i]){
                return i;
            }
            i++;
        });
        return i;
    }
}

// Submit btn 
submit_btn.addEventListener('click' , (e)=>{
    resultSend();
});
learn_btn.addEventListener('click',(e) =>{
    howtotype = true;
    pauseTimer();
    let sel_learn = 'learn';
    let learn_txt;
    let learn_count;
    let learn_char_count;
    if(!ans_txt.value.endsWith(" ")){
        let split = ans_txt.value.split(" ");
        let ques_chk = ques_arr[0];
        let penalties = learnWordHandle(split[split.length -1],ques_chk);
        if(penalties === -1){
            learn_count = word_count;
            learn_txt = ans_txt.value;
            learn_char_count = null;
        }
        else if(penalties > 0){
            learn_count = word_count;
            learn_txt = ans_txt.value;
            learn_char_count = penalties;
        }else{
            learn_count = word_count;
            learn_txt = ans_txt.value;
            learn_char_count = 0;
        }
    }else{
        learn_count = word_count;
        learn_txt = ans_txt.value;
        learn_char_count = 0;
    }
    // Create an object of the class
    ipcRenderer.send('howtotype', sel_obj.lang,sel_obj.time,sel_obj.exam,sel_obj.ex_font,sel_obj.file_path,sel_learn,learn_count,learn_txt,learn_char_count); 
});
