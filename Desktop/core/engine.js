const { ipcRenderer } = require('electron')

//Main elements

const main = document.getElementById('main')
const title = document.getElementById('window-title')



ipcRenderer.on('new-script', function(event, data){
    main.innerHTML = data.content
    title.innerHTML = 'NGL | ' +  data.name 
 })