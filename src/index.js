// Class Declarations
class user_data {
  comnstructor() {
    this.name = '';
    this.roll_no = '';
    this.img = '';
    this.mode = '';
    this.pub_hash = '';
    this.pri_hash = '';
    this.r_date = '';
    this.key = '';
    this.act_conf = '';
  }
}
class main_response {
  constructor() {
    this.act_bool = 0;
    this.hex = '';
    this.macID = '';
    this.error = 0;
  }
}
class selection_opt {
  constructor(lang, time, exam, ex_font, file_path,learn_count,learn_txt,learn_char_count) {
    this.lang = lang;
    this.time = time;
    this.exam = exam;
    this.ex_font = ex_font;
    this.file_path = file_path;
    this.learn_count =  learn_count;
    this.learn_txt = learn_txt;
    this.learn_char_count = learn_char_count;
  }
}
// package Declaration
const menuBarVisibility = false;
const nodeIntegration = true;
const contextIsolation = false;
const { app, BrowserWindow, ipcMain, dialog ,globalShortcut} = require('electron');
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const mac_promice = require('node-machine-id').machineId();
const logopath = path.join('./Image/ICO.png');
// constant Declaration
let comp_hex;  //constant do not change2
const algorithm = 'AES-256-CBC';
const helper = 'tamtob-cibbe6-cakHav';
let usr_data = new user_data();
const prof_resp = new main_response();
let db;
let mainWindow;
let testWindow;
let chkWindow;
let popWin;
function 
createWindow() {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1800,
    icon: logopath,
    // frame: false,
    webPreferences: {
      nodeIntegration: nodeIntegration,
      contextIsolation: contextIsolation,
    },
  });
  // Hide the menu bar
mainWindow.setMenuBarVisibility(menuBarVisibility)
ipcMain.on('howtotype',(event,sel_lang, sel_time, sel_exam, sel_font, sel_exr,sel_scr,learn_count,learn_txt,learn_char_count) =>{
  try{
    let test_obj = new selection_opt(sel_lang, sel_time, sel_exam, sel_font, sel_exr,learn_count,learn_txt,learn_char_count);
    decryptString(usr_data.act_conf).then((confirmation)=> {
      if(confirmation == '0'){
        status_code = 401;
        event.sender.send('db_callback',status_code);
      }else{
        popWin = new BrowserWindow({
          width: 1800,
          height: 1800,
          icon: logopath,
          webPreferences: {
            nodeIntegration: nodeIntegration,
            contextIsolation: contextIsolation,
          },
        });
        // Hide the menu bar
        popWin.loadFile('learnscr.html');
        if(menuBarVisibility){
          popWin.setMenuBarVisibility(menuBarVisibility)
          popWin.webContents.on('devtools-opened', () => {
            popWin.webContents.closeDevTools();
          });
        }
        popWin.webContents.on('did-finish-load', () => {
          popWin.webContents.send('load-page', test_obj);
        });
      }
    });
  }
  catch(e){
    console.log(e);
  }
});

ipcMain.on('mistake_popup',(event,request)=>{
  try{
    let popUp = new BrowserWindow({
      width: 650,
      height:300,
      icon: logopath,
      webPreferences:{
        nodeIntegration:nodeIntegration,
        contextIsolation:contextIsolation,
      }
    });
    // Hide the menu bar
    popUp.loadFile('popUp.html');
    if(menuBarVisibility){
      popUp.setMenuBarVisibility(menuBarVisibility)
      popUp.webContents.on('devtools-opened', () => {
        popUp.webContents.closeDevTools();
      });
    }
    popUp.webContents.on('did-finish-load',() =>{
      popUp.webContents.send('load-page',request);
    });
  }catch(e){
    console.error(e);
  }
});

ipcMain.on('chk_mistake_req', (event,request) =>{
  chkWindow = new BrowserWindow({
    width:650,
    height: 650,
    icon: logopath,
    webPreferences:{
      nodeIntegration: nodeIntegration,
      contextIsolation: contextIsolation,
    }
  });
  try{
    // Hide the menu bar
    chkWindow.loadFile('chk_mistake.html'); 
    if(menuBarVisibility){
      chkWindow.setMenuBarVisibility(menuBarVisibility)
      chkWindow.webContents.on('devtools-opened', () => {
        chkWindow.webContents.closeDevTools();
      });
    }
    // Send the data to the new windowa
    chkWindow.webContents.on('did-finish-load', () => {
      chkWindow.webContents.send('load-page', request);
    }); 
  }catch(e){
    console.error(e);
  }
});  
  // Hide the menu bar
  mainWindow.loadFile('index.html');
  if(menuBarVisibility){
    mainWindow.setMenuBarVisibility(menuBarVisibility)
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }
  // Listen for a message fromthe renderer process
  ipcMain.on('selection-renderer', (event, sel_lang, sel_time, sel_exam, sel_font, sel_exr,sel_scr,learn_count,learn_txt,learn_char_count) => {
    let test_obj = new selection_opt(sel_lang, sel_time, sel_exam, sel_font, sel_exr,learn_count,learn_txt,learn_char_count);
    decryptString(usr_data.act_conf).then((confirmation)=>{
      if( confirmation == '0'){
        status_code = 401;
        event.sender.send('db_callback',status_code);
      }else{
        testWindow = new BrowserWindow({
          width: 1800,
          height: 1800,
          icon: logopath,
          webPreferences: {
            nodeIntegration: nodeIntegration,
            contextIsolation: contextIsolation,
          },
        });
        // change added on 20.01.2024
        // issue of extra screen opens on learn window
        switch(sel_scr){
          case 'learn':
            testWindow.loadFile('learnscr.html');
            break;
          case 'test':
            testWindow.loadFile('testscr.html');
            break;
          case 'stano':
            testWindow.loadFile('stano_test.html');
            break;
          default:
            break;
        }
        // Hide the menu bar
        if(menuBarVisibility){
          testWindow.setMenuBarVisibility(menuBarVisibility)
          testWindow.webContents.on('devtools-opened', () => {
            testWindow.webContents.closeDevTools();
          });
        }
        // Send the data to the new window
        testWindow.webContents.on('did-finish-load', () => {
          testWindow.webContents.send('load-page', test_obj);
        });
      }
    });
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}
app.on('ready', ()=>{
  createWindow();
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      return menuBarVisibility;
    });
    // Create or open a SQLite database fild
    // let directoryPath = path.join(app.getPath('userData'), 'database.db');
    var directoryPath = path.join(__dirname, "database.db");
    db = new sqlite3.Database(directoryPath,sqlite3.OPEN_READWRITE,async (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        db = await new sqlite3.Database(directoryPath, (err) => {
          if (err) {
            console.error('Error creating new database:', err.message);
          } else {
            console.log('Created a new database');
              // Call the function to start performing database tasks
            db_table_create();  
          } 
        });
      } else {
        console.log('Connected to the database');
          // Call the function to start performing database tasks
        db_table_create();  
      }
    });
});
app.on('will-quit', () => {
  // Unregister the shortcut.
  globalShortcut.unregister('CommandOrControl+Shift+I')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.whenReady().then(()=>{
  app.dock.setIcon(logopath);
}).catch((e)=>{
  console.error(e);
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
ipcMain.on("test_result", (event, result_data) => {
  // let result_obj = new result_class(lang, tst_time, time_taken, quest_txt_send, ans_txt_arr, ans_arr, wrong_arr, wrong_count, right_count, word_count);
  testWindow.loadFile('result.html');
  testWindow.webContents.on('did-finish-load', () => {
    testWindow.webContents.send('result-obj', result_data,{name:usr_data.name,roll_no:usr_data.roll_no});
  });
});
ipcMain.on("home_sel", (event, selection) => {
  switch (selection) {
    case "about_us":
      mainWindow.loadFile('AboutUs.html');
      break;
    case "profile":
      mainWindow.loadFile('Profile.html');
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.send('info', usr_data);
      });
      break;
    case "learning":
      mainWindow.loadFile('Learning.html');
      // Send the data to the new window
      // Name : Lakshya Dujari
      // Date : 04.09.2023
      // Comment : adding comment to respond on learning and practie modes differently on line 164 (usr_data.mode = selection) and line 171 same code
      usr_data.mode = selection;
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.send('info', usr_data);
      });
      break;
    case "practice":
      usr_data.mode = selection;
      mainWindow.loadFile('Learning.html');
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.send('info', usr_data);
      });
      break;
  }
});
ipcMain.on('show-info-dialog', (event, message) => {
  dialog.showMessageBox({
    type: 'info',
    icon: './Image/logo.png',
    title: 'Information',
    message,
    buttons: ['OK']
  });
});
ipcMain.on('db_insert', (event, record) => {
  var status_code = 0;
  usr_data = record;
  decryptString(record.pri_hash).then((data)=>{
    if(data == record.key){
      usr_data.act_conf = '1';
      encryptString(record.key).then((key)=>{
        usr_data.key = key;
        encryptString(usr_data.act_conf).then((act_bool)=>{
          usr_data.act_conf = act_bool;
          insert_db(usr_data.name, usr_data.roll_no, usr_data.img, usr_data.pub_hash, usr_data.pri_hash, usr_data.timestamp,usr_data.key,usr_data.act_conf).then((data)=>{
            if(data == true){
              status_code = 200;
            }else{
              status_code = 401;
            }
            event.sender.send('db_callback',status_code);
          });
        });
      });
    }else{
      usr_data.act_conf = '0';
      usr_data.key = '';
      encryptString(usr_data.act_conf).then((act_bool)=>{
        usr_data.act_conf = act_bool;
        insert_db(usr_data.name, usr_data.roll_no, usr_data.img, usr_data.pub_hash, usr_data.pri_hash, usr_data.timestamp,usr_data.key,usr_data.act_conf).then((data)=>{
          if(data == true){
            status_code = 301;
          }else{
            status_code = 401;
          }
          event.sender.send('db_callback',status_code);
        });
      });
    }
  });
});
ipcMain.on('hex_call', (event, request) => {
  try{
    decryptString(request.value).then((data) => {
      switch (request.request) {
        case 'pub_hash':
          prof_resp.macID = data;
          prof_resp.act_bool = 0;
          prof_resp.error = null;
          prof_resp.hex = null;
          event.sender.send('dtt_dec_honey', prof_resp);
          break;
        case 'activation_check':
          prof_resp.macID = null;
          prof_resp.act_bool = data;
          prof_resp.error = null;
          prof_resp.hex = null;
          event.sender.send('dtt_dec_honey', prof_resp);
          break;
        case 'pri_hash':
          prof_resp.macID = null;
          prof_resp.act_bool = 0;
          prof_resp.error = null;
          prof_resp.hex = data;
          event.sender.send('dtt_dec_honey', prof_resp);
          break;
        default:
          prof_resp.error = 404;
          event.sender.send('dtt_dec_honey', prof_resp);
      }
    }).catch((e)=>{
      console.log(e);
    });
  }catch(e){
    console.error(e);
  }
});

async function db_table_create() {
  db.run("CREATE TABLE IF NOT EXISTS user ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, roll_num TEXT, usr_img BLOB, pub_hex_profile TEXT, pri_hex_profile TEXT, timeStamp DATETIME, key TEXT, activation TEXT);", (error) => {
    if (error) {
      console.error(error);
      console.warn("Error While creating table");
      return false;
    } else {
      usr_fetch();
    }
  });
  db.close();
  return true;
}
async function usr_fetch() {
  db.get('Select * from user limit 1', async function (err, row) {
    if (err) {
      console.error(err);
      return false;
    } else {
      if (row) {
        mac_promice.then(async (id) => {
          comp_hex = id;
        });
        usr_data.name = row.name;
        usr_data.roll_no = row.roll_num;
        usr_data.img = row.usr_img;
        usr_data.pub_hash = row.pub_hex_profile;
        usr_data.pri_hash = row.pri_hex_profile;
        usr_data.r_date = row.timeStamp;
        usr_data.key = row.key;
        usr_data.act_conf = row.activation;
        return true;
      }
      else {
        mac_promice.then(async (id) => {
          comp_hex = id;
          await createHash(comp_hex).then(async (data) => {
            await encryptString(honey_DTT(data)).then((data) => {
              usr_data.pub_hash = data;
              encryptString(honey_DTT(usr_data.pub_hash)).then((data) => {
                usr_data.pri_hash = data;
              }).catch((e) => {
                console.error("error While encrypting: ", e);
              });
            });
          }).catch((e) => {
            console.error("Error while genereating hash: ", e);
          });
        });
        return false;
      }
    }
  });
}
function honey_DTT(input) {
  const first_char = input.substring(0, 12);
  const last_char = input.substring(12, input.length);
  let esum = 0;
  let osum = 0;
  Array.from(last_char).forEach((char, index) => {
    if (index % 2 == 0) {
      const numericValue = char.charCodeAt(0) + index;
      esum = esum + numericValue;
    } else {
      const numericValue = char.charCodeAt(0) - index;
      osum = osum + numericValue;
    }
  });
  let esum1 = value_check(Math.floor(esum / 100));
  let esum2 = value_check(esum % 100);
  let osum1 = value_check(Math.floor(osum / 100));
  let osum2 = value_check(osum % 100);
  let k1 = charFromdigit(esum1) + charFromdigit(reverseNumber(esum1));
  let k2 = charFromdigit(esum2) + charFromdigit(reverseNumber(esum2));
  let k3 = charFromdigit(osum1) + charFromdigit(reverseNumber(osum1));
  let k4 = charFromdigit(osum2) + charFromdigit(reverseNumber(osum2));
  k1 = first_char.substring(0, 3) + k1 + '-';
  k2 = first_char.substring(3, 6) + k2 + '-';
  k3 = first_char.substring(6, 9) + k3 + '-';
  k4 = first_char.substring(9, 12) + k4;
  return k1 + k2 + k3 + k4;
}
async function encryptString(input) {
  const cipher = crypto.createCipher(algorithm, helper);
  let encrypted = cipher.update(input, 'utf8', 'hex')
  encrypted += cipher.final('hex');
  return encrypted;
}
async function decryptString(encrypted) {
  const decipher = crypto.createDecipher(algorithm, helper);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
async function createHash(input) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    resolve(hash);
  });
}

function value_check(number) {
  if (number >= 10 && number <= 200) {
    return number;
  }
  if (number < 2) {
    return value_check(number + 1);;
  }
  if (number < 10) {
    return number * 12;
  } else if (number > 200) {
    return value_check(Math.floor(number / 10));
  } else {
    return number;
  }
}
function charFromdigit(digit) {
  if (digit >= 91 && digit <= 96) {
    return charFromdigit((digit % 10) * 10)
  }
  if (digit >= 64 && digit <= 122) {
    return String.fromCharCode(digit);
  } else {
    if (digit < 64) {
      let temp = (64 % digit) + 64;
      return String.fromCharCode(temp);
    } else if (digit > 122) {
      let temp = 122 - ((digit - 122) / 10);
      return String.fromCharCode(temp);
    }
  }
}
function reverseNumber(number) {
  let rev = 0;
  while (number > 0) {
    let rem = number % 10;
    rev = rev * 10 + rem;
    number = Math.floor(number / 10);
  }
  return rev;
}
async function insert_db(name, roll_num, img_blob, enc_pub_hex, enc_pri_hex, timeStamp, key='',activation='') {
  const id = 1;
  var directoryPath = path.join(__dirname, "database.db");
  db = new sqlite3.Database(directoryPath,sqlite3.OPEN_READWRITE);
  db.serialize(() => {
    const stmt = db.prepare("INSERT or REPLACE INTO user (id ,name, roll_num, usr_img, pub_hex_profile, pri_hex_profile, timeStamp,key,activation) VALUES (?,?,?,?,?,?,?,?,?)");
    stmt.run(id, name, roll_num, img_blob, enc_pub_hex, enc_pri_hex, timeStamp,key,activation);
    stmt.finalize();
  });
  db.close();
  return true;
}
