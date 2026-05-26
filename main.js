window.addEventListener('DOMContentLoaded', () => {
    console.log("Quran OS Active Core Online");

    const items = document.querySelectorAll('.menu-item');
    let activeIndex = 0;
    let currentViewState = "menu"; 

    const menuView = document.getElementById('menu-view');
    const playerView = document.getElementById('player-view');
    const playingTitle = document.getElementById('playing-title');
    const playBtn = document.getElementById('play-btn');
    const backBtn = document.getElementById('back-btn');
    const audioElement = document.getElementById('audio-element');

    // CORS-Bypassing API Handler
    function loadAndSetupAudio(element) {
        const surahName = element.innerText;
        const surahId = element.getAttribute('data-id'); // E.g., "001", "003"
        const cleanId = parseInt(surahId, 10);
        
        currentViewState = "player";
        menuView.classList.add('hidden');
        playerView.classList.remove('hidden');
        
        playingTitle.innerText = surahName;
        playBtn.innerText = "[LOADING]"; 

        // Fetching the official open-source audio streaming link directly from Quran.com API
        // Reciter ID 7 is Sheikh Minshawi (Murattal)
        const apiUrl = `https://api.quran.com/api/v4/chapter_recitations/7/${cleanId}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error("API Network issue");
                return response.json();
            })
            .then(data => {
                if (data && data.audio_file && data.audio_file.audio_url) {
                    audioElement.src = data.audio_file.audio_url;
                    audioElement.load();
                    playBtn.innerText = "[PLAY]";
                } else {
                    throw new Error("Invalid API data format");
                }
            })
            .catch(err => {
                playBtn.innerText = "[ERROR]";
                console.error("API Fetch Error: ", err);
            });
    }

    function togglePlayback() {
        if (playBtn.innerText === "[LOADING]") return; // Block input while fetching stream

        if (audioElement.paused) {
            audioElement.play()
                .then(() => {
                    playBtn.innerText = "[PAUSE]";
                })
                .catch(err => {
                    playBtn.innerText = "[ERROR]";
                    console.error("Playback block encountered:", err);
                });
        } else {
            audioElement.pause();
            playBtn.innerText = "[PLAY]";
        }
    }

    function backToMenu() {
        currentViewState = "menu";
        playerView.classList.add('hidden');
        menuView.classList.remove('hidden');
        
        audioElement.pause();
        audioElement.src = ""; 
        audioElement.load();
        
        items[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    // --- TOUCH SCREEN CLICK CONTROLS ---
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            items[activeIndex].classList.remove('selected');
            activeIndex = index;
            item.classList.add('selected');
            loadAndSetupAudio(item);
        });
    });

    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayback();
    });

    backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        backToMenu();
    });

    // --- HARDWARE KEYBOARD CONTROLS ---
    window.addEventListener('keydown', (event) => {
        if (currentViewState === "menu") {
            if (event.key === 'ArrowDown') {
                event.preventDefault(); 
                items[activeIndex].classList.remove('selected');
                activeIndex = (activeIndex + 1) % items.length;
                items[activeIndex].classList.add('selected');
                items[activeIndex].scrollIntoView({ block: 'nearest' });
            } 
            else if (event.key === 'ArrowUp') {
                event.preventDefault(); 
                items[activeIndex].classList.remove('selected');
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                items[activeIndex].classList.add('selected');
                items[activeIndex].scrollIntoView({ block: 'nearest' });
            } 
            else if (event.key === 'Enter') {
                event.preventDefault();
                loadAndSetupAudio(items[activeIndex]);
            }
        } 
        else if (currentViewState === "player") {
            if (event.key === 'Enter') {
                event.preventDefault();
                togglePlayback();
            }
            else if (event.key === 'Escape') {
                event.preventDefault();
                backToMenu();
            }
        }
    });
});
