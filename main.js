const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  ipcMain
} = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
const menu = Menu.buildFromTemplate([
  {
    label: 'Application',
    submenu: [
      {
        label: 'Preference',
        accelerator: 'Meta+,',
        click() {
          console.log('open preference');
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Back',
        accelerator: 'Meta+Left',
        click() {
          mainWindow.webContents.send('back');
        }
      },
      {
        label: 'Forward',
        accelerator: 'Meta+Right',
        click() {
          mainWindow.webContents.send('forward');
        }
      },
      {
        label: 'Create new post',
        accelerator: 'Meta+N',
        click() {
          console.log('meta + n');
          mainWindow.webContents.send('newPost');
        }
      },
      {
        label: 'Toggle Always on top',
        accelerator: 'Meta+Shift+F',
        click() {
          const isAlwaysOnTop = !mainWindow.isAlwaysOnTop()
          mainWindow.setAlwaysOnTop(isAlwaysOnTop);
          mainWindow.webContents.send('changeAlwaysOnTap', isAlwaysOnTop);
        }
      }
    ]
  },
  {
    label: 'Workspace',
    submenu: ['simochee-frontend', 'lollipop-onl'].map((name, i) => ({
      label: name,
      accelerator: `Meta+${i + 1}`,
      click() {
        mainWindow.webContents.send('jumpWorkspace', name);
      }
    }))
  },
  {
    label: 'Development',
    submenu: [
      {
        label: 'Open devtool',
        accelerator: 'Alt+Cmd+I',
        click() {
          mainWindow.webContents.openDevTools();
        }
      }
    ]
  }
]);
Menu.setApplicationMenu(menu);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false
  });

  mainWindow.loadFile('./dist/index.html');

  globalShortcut.register('F1', () => {
    if (!mainWindow.isVisible()) {
      mainWindow.show();
    } else if (!mainWindow.isFocused()) {
      mainWindow.focus();
    } else {
      mainWindow.hide();
    }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
}

app.on('ready', createWindow);
