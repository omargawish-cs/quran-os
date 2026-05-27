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

    // Proxy-backed streaming for Sheikh Al-Minshawi
    function loadAndSetupAudio(element) {
        const surahName = element.innerText;
        const surahId = element.getAttribute('data-id'); // E.g., "001", "002"
        
        currentViewState = "player";
        menuView.classList.add('hidden');
        playerView.classList.remove('hidden');
        
        playingTitle.innerText = surahName;
        playBtn.innerText = "[LOADING]"; 

        // Direct archive path for Minshawi Murattal
const directAudioUrl = `https://server13.mp3quran.net/husr/${surahId}.mp3`;
        
        // We route it through an open proxy to completely bypass browser CORS blocks
        const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(directAudioUrl)}`;
        
        audioElement.src = proxiedUrl;
        audioElement.load();
        playBtn.innerText = "[PLAY]";
    }

    function togglePlayback() {
        if (playBtn.innerText === "[LOADING]") return; 

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
