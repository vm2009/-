document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('animeVideo');
  const prevEpisodeBtn = document.getElementById('prev-episode');
  const nextEpisodeBtn = document.getElementById('next-episode');
  const episodeButtons = document.querySelectorAll('.episode-btn');
  const qualityButtons = document.querySelectorAll('.quality-btn');

  const videoSources = {
      1: {
          '480p': 'videos/1.480.mp4',
          '720p': 'videos/1.720.mp4',
          '1080p': 'videos/1.1080.mp4'
      },
      2: {
          '480p': 'videos/2.480.mp4',
          '720p': 'videos/2.720.mp4',
          '1080p': 'videos/2.1080.mp4'
      },
      3: {
          '480p': 'videos/3.480.mp4',
          '720p': 'videos/3.720.mp4',
          '1080p': 'videos/3.1080.mp4'
      }
      // Додайте більше епізодів за потребою
  };

  let currentEpisode = 1;
  let currentQuality = '720p'; // Початкова якість

  // Ініціалізація Plyr
  const player = new Plyr('#animeVideo', {
      controls: [
          'play-large', // велика кнопка play
          'play', // кнопка play
          'progress', // прогрес-бар
          'current-time', // поточний час
          'mute', // кнопка вимкнення звуку
          'volume', // регулятор гучності
          'settings', // кнопка налаштувань
          'fullscreen' // кнопка повноекранного режиму
      ],
      settings: ['quality', 'speed', 'loop'], // Налаштування, доступні для користувача
  });

  // Функція для завантаження відео
  function loadVideo(episode, quality) {
      const src = videoSources[episode][quality];
      if (!src) {
          console.error(`Відсутній відеофайл для серії ${episode} з якістю ${quality}`);
          return;
      }

      // Зупинити відео перед зміною джерела
      player.pause();

      // Змінити джерело відео
      player.source = {
          type: 'video',
          sources: [
              {
                  src: src,
                  type: 'video/mp4',
                  size: parseInt(quality)
              }
          ]
      };

      // Після зміни джерела, відтворити відео
      player.play();
  }

  // Функція для завантаження поточного епізоду з поточною якістю
  function loadCurrentVideo() {
      loadVideo(currentEpisode, currentQuality);
      updateActiveEpisodeButton();
      updateActiveQualityButton();
  }

  // Обробник кнопки попереднього епізоду
  prevEpisodeBtn.addEventListener('click', function () {
      if (currentEpisode > 1) {
          currentEpisode--;
          loadCurrentVideo();
      }
  });

  // Обробник кнопки наступного епізоду
  nextEpisodeBtn.addEventListener('click', function () {
      const totalEpisodes = Object.keys(videoSources).length;
      if (currentEpisode < totalEpisodes) {
          currentEpisode++;
          loadCurrentVideo();
      }
  });

  // Обробники кнопок списку епізодів
  episodeButtons.forEach(button => {
      button.addEventListener('click', function () {
          const episode = parseInt(this.getAttribute('data-episode'));
          if (episode && videoSources[episode]) {
              currentEpisode = episode;
              loadCurrentVideo();
          }
      });
  });

  // Обробники кнопок вибору якості відео
  qualityButtons.forEach(button => {
      button.addEventListener('click', function () {
          const selectedQuality = this.getAttribute('data-quality');
          if (selectedQuality !== currentQuality) {
              currentQuality = selectedQuality;
              loadCurrentVideo();
          }
      });
  });

  // Функція для оновлення активного стану кнопок серій
  function updateActiveEpisodeButton() {
      episodeButtons.forEach(button => {
          if (parseInt(button.getAttribute('data-episode')) === currentEpisode) {
              button.classList.add('active-episode');
          } else {
              button.classList.remove('active-episode');
          }
      });
  }

  // Функція для оновлення активного стану кнопок якості
  function updateActiveQualityButton() {
      qualityButtons.forEach(button => {
          if (button.getAttribute('data-quality') === currentQuality) {
              button.classList.add('active');
          } else {
              button.classList.remove('active');
          }
      });
  }

  // Завантажити перший епізод за замовчуванням
  loadCurrentVideo();
});