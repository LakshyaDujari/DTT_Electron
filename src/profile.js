import { user_data } from './user_data.js';

const { ipcRenderer} = require('electron');
const { event } = require('jquery');

class requestDispatcher{
    constructor(){
        this.request = '';
        this.value = '';
    }
}
// Constant HTML element declaration
const currentTimestamp = Date.now();
const blob = new Blob(['./Image/profile_fill.svg'], { type: 'image/svg+xml' });
const usr_data = new user_data();
const request = new requestDispatcher();

// HTML Element declaration
const uname = document.getElementById("uname");
const roll_no = document.getElementById("rollnum");
const macinp = document.getElementById('macid');
const key_place = document.getElementById("key_placeholder");
const register_btn = document.getElementById("submit");

ipcRenderer.on('info', (event,data) =>{
    if(data!=null){
        if(data.name != null && data.name != ''){
            console.log(data);
            usr_data.name = data.name;
            usr_data.roll_no = data.roll_no;
            usr_data.img = data.img;
            usr_data.r_date = data.r_date;
            uname.value = usr_data.name;
            uname.disabled = true;
            roll_no.value = usr_data.roll_no;
            roll_no.disabled = true;
        }
        if(data.pub_hash != null && data.pub_hash != '' ){
            usr_data.pub_hash = data.pub_hash;
            usr_data.pri_hash = data.pri_hash;
            request.request = 'pub_hash';
            request.value = usr_data.pub_hash;
            ipcRenderer.send('hex_call', request);
        }
        if(data.act_conf != null && data.act_conf != ''){
            request.request = 'activation_check';
            request.value = data.act_conf;
            ipcRenderer.send('hex_call', request);
        }
    }
});
ipcRenderer.on('db_callback',(event, response) =>{  
    if (response === 200) {
        ipcRenderer.send('show-info-dialog', 'Activation Successful');
      } else {
        ipcRenderer.send('show-info-dialog', 'Activation Unsuccessful');
      }
});
// Receive a response from the backend
ipcRenderer.on('dtt_dec_honey', (event, response) => {
    if(response.error != 404){
        if(response.act_bool == '1'){
            request.request = 'pri_hash';
            request.value = usr_data.pri_hash;
            ipcRenderer.send('hex_call', request);
            register_btn.disabled = true;
            // true
        }
        if(response.hex != null){
            key_place.value = response.hex;
            key_place.disabled = true;
            // False
        }
        if(response.macID != null){
            macinp.value = response.macID;
            macinp.disabled = true;
        }
    }
    else{
        console.error("Response While connecting backend");
    }
});
register_btn.addEventListener('click', async (e) =>{
    e.preventDefault();
    if(uname.value != null && key_place.value != null){
        try{
            usr_data.name = uname.value;
            usr_data.roll_no = roll_no.value;
            // usr_data.img = blob;
            usr_data.timestamp = currentTimestamp;
            usr_data.key = key_place.value;
            ipcRenderer.send('db_insert',usr_data);
        }catch(e){
            console.log(e);
        }
    }
});