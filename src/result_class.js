export class result_class{
  constructor(lang,exm_type,tst_time,time_taken,ques_arr,avg_word_len,final_ans,wrong_arr,right_arr,penaties = 0,ans_txt,backspace_count){
      this.lang = lang;
      this.exm_type = exm_type;
      this.tst_time = tst_time;
      this.time_taken = time_taken;
      this.ques_arr = ques_arr;
      this.avg_word_len = avg_word_len;
      this.final_ans = final_ans;
      this.wrong_arr = wrong_arr;
      this.right_arr = right_arr;
      this.penaties = penaties;
      this.ans_txt = ans_txt;
      this.backspace_count = backspace_count;
  }   
}