const storage = require('electron-json-storage');

module.exports = class AppMenu {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.appMenu = null;

    this.installAppMenu();
  }

  /**
   * ベースメニュー
   * @private
   */
  get baseMenu() {
    return [
      {
        label: 'Application',
        submenu: [
          // {
          //   label: 'Preferences',
          //   accelerator: 'Meta+,',
          //   click: () => {
          //     this.mainWindow.webContents.send('togglePreference');
          //   }
          // },
          {
            role: 'about'
          },
          {

            type: 'separator'
          },
          {
            role: 'quit'
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Back',
            accelerator: 'Meta+Left',
            click: () => {
              this.mainWindow.webContents.send('back');
            }
          },
          {
            label: 'Forward',
            accelerator: 'Meta+Right',
            click: () => {
              this.mainWindow.webContents.send('forward');
            }
          },
          {
            role: 'reload'
          },
          {
            role: 'forceReload'
          },
          {
            type: 'separator'
          },
          {
            role: 'toggleDevTools'
          },
          {
            label: 'Toggle WebView Developer Tools',
            click: () => {
              this.mainWindow.webContents.send('toggleWebViewDevtools');
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Toggle Always on top',
            accelerator: 'Meta+Shift+F',
            click: () => {
              const isAlwaysOnTop = !this.mainWindow.isAlwaysOnTop();

              this.mainWindow.setAlwaysOnTop(isAlwaysOnTop);
              this.mainWindow.webContents.send('changeAlwaysOnTap', isAlwaysOnTop);
            }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'New post',
            accelerator: 'Meta+N',
            click: () => {
              this.mainWindow.webContents.send('openNewPost');
            }
          },
          {
            role: 'close'
          }
        ]
      }
    ];
  }

  /**
   * メニューを取得する
   * @public
   */
  installAppMenu() {
    this.appMenu = this.baseMenu;
  }

  /**
   * ワークスペースのメニューを追加する
   * @public
   */
  updateProjects() {
    return new Promise((resolve, reject) => {
      storage.get('config', (err, data) => {
        if (err) return reject(err);

        const { projects } = data;

        if (!projects) return;

        const submenu = Object.keys(projects)
          .map((key) => {
            const projectName = projects[key];

            return {
              label: projectName,
              accelerator: `Meta+${key}`,
              click: () => {
                this.mainWindow.webContents.send('changeProject', projectName);
              }
            };
          });

        this.appMenu[4].submenu = submenu;

        resolve(this.appMenu);
      });
    });
  }
}
