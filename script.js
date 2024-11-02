document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('animeVideo');
    const prevEpisodeBtn = document.getElementById('prev-episode');
    const nextEpisodeBtn = document.getElementById('next-episode');
    const episodeButtons = document.querySelectorAll('.episode-btn');

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
        quality: {
            default: 720, // Якість за замовчуванням
            options: [1080, 720, 480],
            forced: true, // Примусове використання якостей з options
        },
    });

    // Функція для завантаження відео
    function loadVideo(episode) {
        const episodeSources = videoSources[episode];
        const sources = [];

        for (let quality in episodeSources) {
            const size = parseInt(quality.replace('p', '')); // Витягуємо числове значення якості
            sources.push({
                src: episodeSources[quality],
                type: 'video/mp4',
                size: size
            });
        }

        // Оновлюємо джерело плеєра
        player.source = {
            type: 'video',
            title: 'Епізод ' + episode,
            sources: sources,
        };

        // Відтворюємо відео, коли плеєр готовий
        player.once('ready', () => {
            player.play();
        });

        // Оновлюємо активну кнопку епізоду
        updateActiveEpisodeButton();
    }

    // Обробник кнопки попереднього епізоду
    prevEpisodeBtn.addEventListener('click', function () {
        if (currentEpisode > 1) {
            currentEpisode--;
            loadVideo(currentEpisode);
        }
    });

    // Обробник кнопки наступного епізоду
    nextEpisodeBtn.addEventListener('click', function () {
        const totalEpisodes = Object.keys(videoSources).length;
        if (currentEpisode < totalEpisodes) {
            currentEpisode++;
            loadVideo(currentEpisode);
        }
    });

    // Обробники кнопок списку епізодів
    episodeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const episode = parseInt(this.getAttribute('data-episode'));
            if (episode && videoSources[episode]) {
                currentEpisode = episode;
                loadVideo(currentEpisode);
            }
        });
    });

    // Функція для оновлення активної кнопки епізоду
    function updateActiveEpisodeButton() {
        episodeButtons.forEach(button => {
            if (parseInt(button.getAttribute('data-episode')) === currentEpisode) {
                button.classList.add('active-episode');
            } else {
                button.classList.remove('active-episode');
            }
        });
    }

    // Завантажити перший епізод за замовчуванням
    loadVideo(currentEpisode);
});
