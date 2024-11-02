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

    // Ініціалізація Plyr з доданою кнопкою ">>"
    const player = new Plyr('#animeVideo', {
        controls: [
            'play-large',
            'rewind', // Кнопка перемотування назад
            'play',
            'fast-forward', // Кнопка перемотування вперед (наша кнопка ">>")
            'progress',
            'current-time',
            'mute',
            'volume',
            'settings',
            'fullscreen'
        ],
        settings: ['quality', 'speed', 'loop'],
        quality: {
            default: 720,
            options: [1080, 720, 480],
            forced: true,
        },
    });

    // Додаємо функціонал для кнопки ">>"
    function addFastForwardFunctionality() {
        const fastForwardButton = player.elements.controls.querySelector('.plyr__controls__item[data-plyr="fast-forward"]');

        if (fastForwardButton) {
            // Видаляємо попередній обробник, якщо він був
            fastForwardButton.removeEventListener('click', fastForward);

            // Додаємо новий обробник
            fastForwardButton.addEventListener('click', fastForward);
        }
    }

    // Функція перемотування вперед на 80 секунд
    function fastForward() {
        player.currentTime += 76; // Змінити на потрібний час у секундах
    }

    // Викликаємо функцію після ініціалізації плеєра
    player.on('ready', () => {
        addFastForwardFunctionality();
    });

    // Функція для завантаження відео
    function loadVideo(episode) {
        const episodeSources = videoSources[episode];
        const sources = [];

        for (let quality in episodeSources) {
            const size = parseInt(quality.replace('p', ''));
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
            addFastForwardFunctionality(); // Оновлюємо функціонал кнопки ">>" після завантаження нового відео
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
