const { ipcRenderer: ipc, shell } = require('electron');

class Scrapbox {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.projectName = null;
  }

  /**
   * 新しいポストのURL
   * @public
   */
  get newPostUrl() {
    return `${this.baseUrl}${this.projectName}/new`;
  }

  /**
   * URLが変更されたら情報を保持する
   * @public
   */
  changedUrl(url) {
    const pathname = url.replace(this.baseUrl, '');
    const [ projectName ] = pathname.split('/');

    this.projectName = projectName;
  }

  /**
   * プロジェクトのURLを取得する
   * @public
   */
  getProjectUrl(projectName) {
    return `${this.baseUrl}${projectName}`;
  }
}

class MainApp {
  constructor() {
    this.ACTIVE_CLASS = '-active';

    this.webview = document.getElementById('webview');
    this.preference = document.getElementById('preference');
    this.scrapbox = new Scrapbox('https://scrapbox.io/');

    this.webview.addEventListener('did-navigate-in-page', ({ url }) => {
      this.scrapbox.changedUrl(url);
    });

    this.webview.addEventListener('new-window', (e) => {
      shell.openExternal(e.url);
    });

    this.toggleWebViewDevtools = this.toggleWebViewDevtools.bind(this);
    this.webviewHistoryBack = this.webviewHistoryBack.bind(this);
    this.webviewHistoryForward = this.webviewHistoryForward.bind(this);
    this.openNewPost = this.openNewPost.bind(this);
    this.togglePreference = this.togglePreference.bind(this);
    this.changeAlwaysOnTap = this.changeAlwaysOnTap.bind(this);
    this.changeProject = this.changeProject.bind(this);

    ipc.on('toggleWebViewDevtools', this.toggleWebViewDevtools);
    ipc.on('back', this.webviewHistoryBack);
    ipc.on('forward', this.webviewHistoryForward);
    ipc.on('openNewPost', this.openNewPost);
    ipc.on('togglePreference', this.togglePreference);
    ipc.on('changeAlwaysOnTap', this.changeAlwaysOnTap);
    ipc.on('changeProject', this.changeProject);
  }

  /**
   * WebViewの開発者ツールをトグルする
   * @private
   */
  toggleWebViewDevtools() {
    if (this.webview.isDevToolsOpened()) {
      this.webview.closeDevTools();
    } else {
      this.webview.openDevTools();
    }
  }

  /**
   * WebViewの履歴を戻る
   * @private
   */
  webviewHistoryBack() {
    this.webview.goBack();
  }

  /**
   * WebViewの履歴を進める
   * @private
   */
  webviewHistoryForward() {
    this.webview.goForward();
  }

  /**
   * 新しいポストを作成する
   * @private
   */
  openNewPost() {
    this.webview.loadURL(this.scrapbox.newPostUrl);
  }

  /**
   * アプリの設定をトグルする
   * @private
   */
  togglePreference() {
    const hasClass = this.preference.className.split(' ').includes(this.ACTIVE_CLASS);

    if (hasClass) {
      this.closePreference();
    } else {
      this.openPreference();
    }
  }

  /**
   * アプリの設定を開く
   */
  openPreference() {
    this.preference.classList.add(this.ACTIVE_CLASS);
  }

  /**
   * アプリの設定を閉じる
   */
  closePreference() {
    this.preference.classList.remove(this.ACTIVE_CLASS);
  }

  /**
   * 最前面表示モードを切り替え
   */
  changeAlwaysOnTap(event, flag) {
    if (flag) {
      this.webview.classList.add(this.ACTIVE_CLASS);
    } else {
      this.webview.classList.remove(this.ACTIVE_CLASS);
    }
  }

  /**
   * プロジェクトを変更する
   */
  changeProject(event, projectName) {
    if (this.scrapbox.projectName === projectName) return;

    this.webview.loadURL(this.scrapbox.getProjectUrl(projectName));
  }
}

new MainApp();
