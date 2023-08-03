// Получаем элементы плеера
var audioPlayer = document.getElementById('audio-player');
var audio = new Audio(); // Создаем новый объект Audio
var audioFileInput = document.getElementById('audio-file-input');
var songList = document.getElementById('song-list');
var playButton = document.getElementById('play-button');
var pauseButton = document.getElementById('pause-button');
var stopButton = document.getElementById('stop-button');
var resetButton = document.getElementById('reset-button');
var volumeSlider = document.getElementById('volume-slider');
var seekSlider = document.getElementById('seek-slider');
var currentTimeDisplay = document.getElementById('current-time');
var previousButton = document.getElementById('previous-button');
var nextButton = document.getElementById('next-button');

// Список загруженных песен
var songs = [];
var currentSongIndex = 0; // Текущий индекс воспроизводимой песни

// Функция воспроизведения аудио
function playAudio() {
  if (audio.src) {
    audio.play();
  }
}

// Функция паузы аудио
function pauseAudio() {
  audio.pause();
}

// Функция остановки аудио
function stopAudio() {
  audio.pause();
  audio.currentTime = 0; // Сбрасываем таймлайн до начала
}

// Функция перемотки аудио
function seekAudio() {
  var seekTime = audio.duration * (seekSlider.value / 100);
  audio.currentTime = seekTime;
}

function handleSongItemHover(event) {
  var songItems = document.getElementsByClassName('song-item');
  for (var i = 0; i < songItems.length; i++) {
    songItems[i].classList.remove('active');
  }
  event.target.classList.add('active');
}

// Функция для обработки события ухода курсора с элемента песни
function handleSongItemLeave(event) {
  event.target.classList.remove('active');
}

// Добавляем обработчики событий для каждого элемента песни
var songItems = document.getElementsByClassName('song-item');
for (var i = 0; i < songItems.length; i++) {
  songItems[i].addEventListener('mouseenter', handleSongItemHover);
  songItems[i].addEventListener('mouseleave', handleSongItemLeave);
}

// Функция обновления ползунка и таймера
function updateSeekBar() {
  seekSlider.value = (audio.currentTime / audio.duration) * 100;
  var minutes = Math.floor(audio.currentTime / 60);
  var seconds = Math.floor(audio.currentTime % 60);
  var currentTimeString = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  currentTimeDisplay.textContent = currentTimeString;
  
  // Проверяем, если песня закончилась, воспроизводим следующую
  if (audio.currentTime === audio.duration) {
    playNextTrack();
  }
}

// Функция воспроизведения следующего трека
function playNextTrack() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    stopAudio(); // Если нет следующего трека, останавливаем воспроизведение
    currentSongIndex--;
    return;
  }
  var selectedSong = songs[currentSongIndex];
  audio.src = selectedSong.url;
  playAudio();
}

// Функция воспроизведения предыдущего трека
function playPreviousTrack() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = 0; // Если уже на первом треке, не переходим назад
  }
  var selectedSong = songs[currentSongIndex];
  audio.src = selectedSong.url;
  playAudio();
}

// Функция для обработки выбора папки
function handleFolderSelection(event) {
  var files = [];
  var inputElement = event.target;
  var fileList = inputElement.files;
  for (var i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }
  if (files.length > 0) {
    loadSongs(files);
  }
  inputElement.value = ''; // Очистить выбор файла, чтобы событие change сработало при следующем выборе
}

// Функция для загрузки песен из выбранной папки
function loadSongs(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var fileURL = URL.createObjectURL(file);
    var song = {
      file: file,
      url: fileURL
    };
    songs.push(song);
    var songItem = document.createElement('div');
    songItem.textContent = file.name;
    songItem.classList.add('song-item');
    songItem.addEventListener('click', function() {
      var index = Array.from(songList.children).indexOf(this);
      var selectedSong = songs[index];
      audio.src = selectedSong.url;
      currentSongIndex = index;
      playAudio();
    });
    // Добавляем обработчики событий для каждого элемента песни
    songItem.addEventListener('mouseenter', handleSongItemHover);
    songItem.addEventListener('mouseleave', handleSongItemLeave);

    songList.appendChild(songItem);
  }
}

// Обработчик события выбора папки
audioFileInput.addEventListener('change', handleFolderSelection);

// Обработчик события изменения громкости
volumeSlider.addEventListener('input', function(event) {
  var volume = event.target.value;
  audio.volume = volume;
});

// Обработчик события перемотки песни
seekSlider.addEventListener('input', seekAudio);

// Обновление ползунка и таймера при каждом обновлении времени
audio.addEventListener('timeupdate', updateSeekBar);

// Обработчик события сброса списка треков
resetButton.addEventListener('click', function() {
  songs = [];
  songList.innerHTML = '';
});

// Добавляем обработчики событий кнопкам
playButton.addEventListener('click', playAudio);
pauseButton.addEventListener('click', pauseAudio);
stopButton.addEventListener('click', stopAudio);
previousButton.addEventListener('click', playPreviousTrack);
nextButton.addEventListener('click', playNextTrack);
