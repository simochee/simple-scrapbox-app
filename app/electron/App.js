const {
  BrowserWindow,
  Menu,
  app,
  globalShortcut,
  protocol
} = require('electron');
const path = require('path');
const url = require('url');
const AppMenu = require('./AppMenu');

module.exports = class ElectronApp {
  constructor(baseDir) {
    this.mainWindow = null;
    this.forceQuit = false;

    app.on('ready', () => {
      this.interceptFilePath(baseDir);
      this.registGlobalShortcuts();
      this.initMainWindow();
      this.initAppMenu();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', () => {
      this.forceQuit = true;
    });
  }

  /**
   * ファイルパスのベースを変更する
   * @private
   * @param {string} baseDir ベースディレクトリのパス
   */
  interceptFilePath(baseDir) {
    protocol.interceptFileProtocol('file', (req, callback) => {
      const requestedUrl = req.url.substr(7);

      if (path.isAbsolute(requestedUrl)) {
        callback(path.normalize(path.join(baseDir, requestedUrl)));
      } else {
        callback(requestedUrl);
      }
    });
  }

  /**
   * メインウィンドウを初期化する
   * @private
   */
  initMainWindow() {
    this.mainWindow = new BrowserWindow({
      title: 'Quick Scrapbox.io',
      width: 800,
      height: 600
    });

    this.mainWindow.loadFile(url.format({
      pathname: '/client/index.html',
      slashes: true
    }));

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
    });

    this.mainWindow.on('close', (e) => {
      if (!this.forceQuit) {
        e.preventDefault();

        this.mainWindow.hide();
      }
    });
  }

  /**
   * アプリケーションメニューを初期化する
   * @private
   */
  async initAppMenu() {
    const appMenu = new AppMenu(this.mainWindow);
    // const _menu = await appMenu.updateProjects();
    const menu = Menu.buildFromTemplate(appMenu.baseMenu);
    Menu.setApplicationMenu(menu);
  }

  /**
   * グローバルショートカットを登録する
   * @private
   */
  registGlobalShortcuts() {
    // F1でウィンドウを表示・非表示
    globalShortcut.register('F1', () => {
      if (!this.mainWindow) throw new Error('mainWindow is undefined!');

      // ウィンドウが消えていれば表示
      if (!this.mainWindow.isVisible()) {
        return this.mainWindow.show();
      }

      // ウィンドウがフォーカスされていなければフォーカス
      if (!this.mainWindow.isFocused()) {
        return this.mainWindow.focus();
      }

      // ウィンドウを消す
      this.mainWindow.hide();
    });
  }
}
