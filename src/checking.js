export class checking_class{
    constructor(higlight_back,ques_arr,ans_arr,wrong_arr,final_ans,wrong_count,word_count,right_arr,ques_len,final_ques){
        let higlight_back = null;
        let ques_arr = [];
        let ans_arr = [];
        let wrong_arr = [];
        let final_ans = [];
        let wrong_count = 0.0;
        let word_count = 0;
        let right_arr = [];
        let ques_len = 10;
        let final_ques = "";
    }
    // Name: Lakshya Dujari
    // Date: 05.09.2023
    // Comment Added function for checking mistakes and text highlighter
    checking_mistakes(ans_word,ques_word){//returns .5,1
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
                                if(letter_rchk[i].toLowerCase() == letter_wchk[j].toLowerCase()){
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
                    if(return_ans < 2){
                        return .5;
                    }
                    // return .5;
                }
            }
            if(skipped){
                let penalties = checkSkippedWords(ans_word);
                if(penalties != 0){
                    let return_val ={
                        penalty: 1,
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
    highlight_text(){
        let textHighlight = '';
        let caseSensitive = true;
        instance.search(textHighlight,caseSensitive,word_count); 
    }
    // checking empty spaces
    checkEmptySpace(char){
        if(char == ""){
            return true;
        }
        return false;
    }
    // cheking how many words skipped
    checkSkippedWords(word){
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
    wrongWordUpdate(wrong_word,right_word,fine){
        if(typeof(fine) == 'object' ){
            let str1 = right_word;
            let str2 = '<span style="background-color: #ff3c5f; width:fit-content"><span style="font-family:Arial;">{-}</span>' + str1 + "</span> ";
            wrong_arr.push(['-',str1,1,fine.penalty]);
            final_ans.push(str2);
            for(let i=0;i<fine.penalty-1;i++){
                str1 = ques_arr.shift();
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
                let str1 = '<span style="background-color: yellow; width:fit-content">'+right_word + '<span style="font-family:Arial;">{-}</span>' + ques_arr.shift() + "</span>";
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
                if(fine == 1){
                    str1 = '<span style="background-color: #ff3c5f; width:fit-content">'+wrong_word + '<span style="font-family:Arial;">{</span>' + right_word + '<span style="font-family:Arial;">}</span></span>';
                }else{
                    str1 = '<span style="background-color: yellow; width:fit-content">'+wrong_word + '<span style="font-family:Arial;">{</span>' + right_word + '<span style="font-family:Arial;">}</span></span>';
                }
                final_ans.push(str1);
            }
            wrong_count = wrong_count+fine;
            wword_txt.textContent = " Wrong Words: " + wrong_count;
        }
    }
    rightWordUpdate(word){
        right_arr.push(word);
        // console.log(typeof(word));
        if(typeof(word) == 'object'){//to pust the last correct of skipped word which is correct 
            final_ans.push(word[0]);
        }else{
            final_ans.push(word);
        }
        rword_txt.textContent = "Right Words: " +right_arr.length;
    }
    // adjusting question array and right and wrong array based on backspace cliked
    backspaceAdjust(currentWord){
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
    
    startChecking(){
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
}