import { ipcRenderer } from 'electron';

ipcRenderer.on('newPost', () => {
  const wv = document.getElementById('wv');
  // wv.loadURL('https://scrapbox.io/simochee-frontend/new');
  wv.executeJavaScript('history.pushState(null, null, "/simochee-frontend/new")');
});

ipcRenderer.on('changeAlwaysOnTap', (event, flag) => {
  const wv = document.getElementById('wv');

  if (flag) {
    wv.classList.add('--active');
  } else {
    wv.classList.remove('--active');
  }
});

ipcRenderer.on('jumpWorkspace', (event, name) => {
  const wv = document.getElementById('wv');
  wv.loadURL(`https://scrapbox.io/${name}/`);
});

ipcRenderer.on('back', () => {
  const wv = document.getElementById('wv');

  wv.goBack();
});

ipcRenderer.on('forward', () => {
  const wv = document.getElementById('wv');

  wv.goForward();
});
