const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
  // Создаем окно браузера.
  const win = new BrowserWindow({
    width: 350,
    height: 700,
    resizable: false, // Запрещаем изменение размера окна
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Удаляем меню браузера
  Menu.setApplicationMenu(null);

  // Загружаем index.html файл вашего проекта.
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
