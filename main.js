window.addEventListener('DOMContentLoaded', () => {
    console.log("Quran OS Touch Engine Online");

    const items = document.querySelectorAll('.menu-item');
    let activeIndex = 0;
    let currentViewState = "menu"; 

    const menuView = document.getElementById('menu-view');
    const playerView = document.getElementById('player-view');
    const playingTitle = document.getElementById('playing-title');
    const playBtn = document.getElementById('play-btn');
    const backBtn = document.getElementById('back-btn');
    const audioElement = document.getElementById('audio-element');

// Universal core stream switcher function
// Universal core stream switcher function
function loadAndSetupAudio(element) {
    const surahName = element.innerText;
    const surahId = element.getAttribute('data-id'); // Keeps the 3-digit string ("001", "002")
    
    // Stable, high-speed, fully SSL-secured, CORS-friendly official storage path
    const audioUrl = `https://download.quran.com/minshawi_murattal/${surahId}.mp3`;
    
    currentViewState = "player";
    menuView.classList.add('hidden');
    playerView.classList.remove('hidden');
    
    playingTitle.innerText = surahName;
    playBtn.innerText = "[PLAY]"; 
    
    // Pass explicit instructions to the browser interface to allow cross-origin stream media
    audioElement.crossOrigin = "anonymous";
    audioElement.src = audioUrl;
    audioElement.load();
}
    // Toggle play state function
    function togglePlayback() {
        if (audioElement.paused) {
            playBtn.innerText = "[LOADING]";
            audioElement.play()
                .then(() => {
                    playBtn.innerText = "[PAUSE]";
                })
                .catch(err => {
                    playBtn.innerText = "[ERROR]";
                    console.error("Audio blocked:", err);
                });
        } else {
            audioElement.pause();
            playBtn.innerText = "[PLAY]";
        }
    }

    // Return to main playlist layout
    function backToMenu() {
        currentViewState = "menu";
        playerView.classList.add('hidden');
        menuView.classList.remove('hidden');
        
        audioElement.pause();
        audioElement.src = ""; 
        audioElement.load();
        
        items[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    // --- MOBILE TOUCH EVENTS ---
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

    // --- DESKTOP KEYBOARD ENGINE ---
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
