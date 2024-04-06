// Class Declaration
import { result_class } from './result_class.js';
// constant Declaration
const { ipcRenderer } = require('electron');
const today_time = document.getElementById('time');
const lang_txt = document.getElementById('lang');
const name_txt = document.getElementById('sname');
const roll_txt = document.getElementById('roll');
const tst_time_txt = document.getElementById('tst_time');
const time_taken_txt = document.getElementById('time_taken');
const res_type1 = document.querySelector('.type1');
const res_type2 = document.querySelector('.type2');
const f_mistake_txt = document.getElementById('f_mistakes');
const h_mistake_txt = document.getElementById('h_mistakes');
const g_speed_txt = document.getElementById('g_speed');
const n_speed_txt = document.getElementById('n_speed');
const penalties_txt = document.getElementById('penalties');
const gross_error_txt = document.getElementById('g_error');
const accuracy_txt = document.getElementById('acc');
const ndph_txt = document.getElementById('ndph');
const e_strokes_txt = document.getElementById('e_strokes');
const m_50_txt = document.getElementById('m_50');
const m_25_txt = document.getElementById('m_25');
const backspace_txt1 = document.getElementById('b_space_cnt');
const word_cnt_txt = document.getElementById('word_count');
const net_wpm2_txt = document.getElementById('net_wpm2');
const right_word_txt = document.getElementById('Right_words');
const gross_wpm2_txt = document.getElementById('gross_wpm2')
const wrong_word_txt = document.getElementById('Wrong_words');
const acc2_txt = document.getElementById('acc2');
const chk_mist = document.getElementById('chk_mis')
const backspace_txt2 = document.getElementById('backspace_count2');
const m_type2_txt = document.getElementById('marks');
const ans_txtarea = document.querySelector('.txt_container');

// Variable Declaration
let result_obj = new result_class();
let half_mis = 0;
let full_mis = 0;
let ans_arr = [];
let gross_strokes_val = 0;
let net_strokes_val = 0;
let gross_speed = 0;
let net_speed = 0;
// Functions
// Gross Strokes Calculation
function gross_strokes(){
    // let stringWithoutSpaces = result_obj.ans_txt.replace(/\s/g, '');
    // console.log("Ans text:",result_obj.ans_txt)
    let gross_str = '';
    result_obj.right_arr.forEach((element)=>{
        if(typeof(element) == 'object'){
            gross_str = gross_str + " " +element[0];
        }
        else{
            gross_str = gross_str + " " +element;
        }
    });
    result_obj.wrong_arr.forEach((element)=>{
        gross_str = gross_str + " " +element[1];
    });
    gross_strokes_val = gross_str.length;
    grossSpeed(result_obj.exm_type);
}

// Net Stokes Calculator
function net_strokes(){
    net_strokes_val = gross_strokes_val - grossError()*5;
    netSpeed(result_obj.exm_type);
    ndph_txt.textContent = "Net DPH: "+String(net_strokes_val*60);
}

// Net speed Calculator
function netSpeed(exam_type){
    if(exam_type == 'ex1'){
        net_speed = ((net_strokes_val/500)/result_obj.time_taken);
    }else if(exam_type == 'ex7'){
        //  for stano
    }else{
        net_speed = result_obj.right_arr.length/result_obj.ques_arr.length;
    }
    net_speed = (net_speed*100).toFixed(2);

    n_speed_txt.textContent = "Net Speed[WPM]: "+String(net_speed) + "  ("+String(net_strokes_val)+" net strokes Value)";
}
// Gross Speed Calculator
function grossSpeed(exam_type){
    if(exam_type == 'ex1'){
        gross_speed = ((gross_strokes_val/500)/result_obj.time_taken);
    }else if(exam_type == 'ex7'){
        //  for stano
    }else{
        gross_speed = ans_arr.length/100*result_obj.tst_time;
    }
    gross_speed = (gross_speed*100).toFixed(2);
    g_speed_txt.textContent = "Gross Speed[WPM]: "+String(gross_speed) + "  ("+String(gross_strokes_val)+" gross strokes Value)";
}

// mistake segregation
function f_h_mistakes(wrong_arr){
    wrong_arr.forEach(element => {
        if(element[2] == 1){
            full_mis++;
        }else{
            half_mis++;
        }
    });
    h_mistake_txt.textContent = "Half Mistakes:"+String(half_mis);
    f_mistake_txt.textContent = "Full Mistakes:"+String(full_mis);
}
// Penalties Calculator
function penalties(){
    let penalties_val = result_obj.penaties;
    penalties_txt.textContent = "Penalties: " + String(penalties_val);
    return penalties_val;
}
// Accuracy
function accuracy(exam_type){
    let accuracy_val = 0;
    if(exam_type == "ex1"){
        let right_txt = result_obj.right_arr.join(' ');
        let ans_txt = ans_arr.join(' ');
        accuracy_val = (net_strokes_val/gross_strokes_val)*100;
    }else if(exam_type == "ex7"){
        // for stano
    }else{
        let right_cnt = result_obj.right_arr.length;
        let word_count = result_obj.ques_arr.length;
        accuracy_val = (right_cnt*100)/word_count;
    }
    accuracy_val = accuracy_val.toFixed(2);
    accuracy_txt.textContent = "Accuracy: "+String(accuracy_val)+"%";
}

// function to find gross error
function grossError(){
    let gross_error = full_mis + (half_mis/2) + penalties();
    gross_error_txt.textContent = "Gross Errors(Full + (Half/2) + Penalties): "+ String(gross_error);
    e_strokes_txt.textContent = "Error Strokes(Gross Error * 5): "+String(gross_error*5);
    return gross_error;
}

// calculation of marks in hcldc
function hc_marksCal(){
    let cal_ratio = .75018;
    let hc_50 = cal_ratio * net_speed;
    let hc_25 = hc_50/2;
    m_50_txt.textContent = "Marks Out of 50: "+String(hc_50.toFixed(2));
    m_25_txt.textContent = "Marks Out of 25: "+String(hc_25.toFixed(2));
}

// calls related to type1 calculations
function type1_function(){
    res_type2.style.display = 'none';
    grossError();
    gross_strokes();
    net_strokes();
    accuracy(result_obj.exm_type);
    penalties();
    hc_marksCal();
    backspace_txt1.textContent = "Backspace: "+String(result_obj.backspace_count);
}

// type2 function starts here
// calls related to type2 calculations
function type2_function(){
    res_type1.style.display = 'none';
    let ques_len = result_obj.ques_arr.length;
    let right_words = result_obj.right_arr.length;
    let wrong_words = result_obj.wrong_arr.length;
    let temp_ans = result_obj.ans_txt.trim();
    let ans_arr_len = temp_ans.length;
    let netwpm2 = ((right_words/ques_len)*100).toFixed(2);
    let grosswpm2 = ((ans_arr.length/ques_len)*100).toFixed(2);
    let type2Acc = ((right_words/result_obj.final_ans.length)*100).toFixed(2);
    word_cnt_txt.textContent = "Total Words: "+String(ques_len);
    net_wpm2_txt.textContent = "Net Speed[WPM]: "+String(netwpm2);
    right_word_txt.textContent = "Right Words: "+String(right_words);
    gross_wpm2_txt.textContent = "Gross Speed[WPM]: "+String(grosswpm2);
    wrong_word_txt.textContent = "Wrong Typed Words: "+String(wrong_words);
    acc2_txt.textContent = "Accuracy: "+String(type2Acc)+"%";
    backspace_txt2.textContent = "Backspace: "+String(result_obj.backspace_count);
}

// calls for stano result
function stano_function(){
    // to be implemented
}

ipcRenderer.on('result-obj',(event, data,usr_info) =>{
    result_obj = data;
    name_txt.textContent = usr_info.name;
    roll_txt.textContent = usr_info.roll_no;
    ans_txtarea.textContent = result_obj.ans_arr;
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let seconds = String(now.getSeconds()).padStart(2, '0');
    let datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    today_time.textContent = datetime;
    lang_txt.textContent = result_obj.lang;
    tst_time_txt.textContent = result_obj.tst_time;
    // time take calculation 
    result_obj.time_taken = ((result_obj.tst_time * 60 - result_obj.time_taken)/60).toFixed(2);
    let timeParts = result_obj.time_taken.toString().split('.');
    time_taken_txt.textContent = timeParts[0].padStart(2, '0') + ':' + timeParts[1].padStart(2, '0');
    if(result_obj.lang == "Hindi_Exercise"){
        ans_txtarea.style.fontFamily = "\"Kruti Dev 010\"";
    }
    else{
        ans_txtarea.style.fontFamily = "Arial Rounded MT Bold";
    }
    // getting parameters for result
    ans_arr = result_obj.ans_txt.trim();
    ans_arr = result_obj.ans_txt.split(' ');
    f_h_mistakes(result_obj.wrong_arr);
    // calling proper method for exam calculations
    switch(result_obj.exm_type){
        case 'ex1':
            type1_function();
            break;
        case 'ex7':
            stano_function();
            break;
        default:
            type2_function();
            break;
    }
    ans_txtarea.innerHTML = result_obj.final_ans.join(' ');
});
chk_mist.addEventListener(('click'),()=>{
    let request = {
        lang: result_obj.lang,
        wrong_arr: result_obj.wrong_arr,
    }
    ipcRenderer.send("chk_mistake_req",request);
});