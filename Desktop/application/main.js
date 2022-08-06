const {app, BrowserWindow, Menu } = require('electron')

var win = null
async function createWindow(){
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    await win.loadFile('application/index.html')
    win.webContents.openDevTools()
}

var graph = {}

//Script Handler

function newScript(){
    
    graph = {
        name: "untitled.ngl",
        content: "new script created",
        saved: false,
        compiled: false,
        engine: "js",
        path: app.getPath('documents')+'/untitled.ngl'

    }
    //console.log(graph)
    win.webContents.send('new-script', graph)

}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Script',
                click(){    
                    newScript() 
                }
            },
            {
                label: 'Open Script'
            },
            {
                label: 'Save Script'
            },
            {
                label: 'Exit',
                role: process.platform === 'darwin' ? 'close' : 'quit'
            },

        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Redo'
            },
            {
                label: 'Undo'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About'
            }
        ]
    },
]

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)


//Ready
app.whenReady().then(createWindow)

//Show Window
app.on('activate', () => {
    if(BrowserWindow.getAllWindows(). length === 0)
    {
        createWindow()
    }
})