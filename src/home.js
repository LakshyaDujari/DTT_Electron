const { ipcRenderer } = require('electron');

const about = document.getElementById("aboutus");
const learn = document.getElementById("learn");
const practice = document.getElementById("practice");
const profile = document.getElementById("profile");

about.addEventListener('click',() =>{
    ipcRenderer.send('home_sel','about_us');
    // window.location.href = "AboutUs.html";
});
learn.addEventListener('click',() =>{
    ipcRenderer.send('home_sel','learning');
    // window.location.href = "learning.html";
});
practice.addEventListener('click',() =>{
    ipcRenderer.send('home_sel','practice');
    // window.location.href = "learning.html";
});
profile.addEventListener('click',() =>{
    ipcRenderer.send('home_sel','profile');
    // window.location.href = "Profile.html";
});