// --- VARIABEL AUDIO UTAMA ---
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBarFill = document.getElementById('progressBarFill');
const albumArt = document.getElementById('albumArt');

let currentTrackFile = '';
let currentTrackIndex = 0;

// Set class play icon di awal agar tombol standby dalam keadaan presisi di tengah
if(playPauseBtn) {
    playPauseBtn.classList.add('is-play-icon');
}

// --- FUNGSI PROSES LOGIN ---
function handleLogin(event) {
    event.preventDefault(); 
    
    const usernameInput = document.getElementById('username').value;
    
    if (usernameInput.trim() !== "") {
        document.getElementById('userDisplay').innerText = usernameInput;
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('dashboardPage').classList.remove('hidden');
        
        document.body.style.alignItems = 'stretch';
        document.body.style.justifyContent = 'stretch';
    }
}

// --- FUNGSI PROSES LOGOUT ---
function handleLogout() {
    // Stop musik saat logout
    audioPlayer.pause();
    if(playPauseBtn) {
        playPauseBtn.innerText = '▶';
        playPauseBtn.classList.remove('is-pause-icon');
        playPauseBtn.classList.add('is-play-icon');
    }
    albumArt.style.animation = 'none';
    albumArt.src = 'default-art.jpg';

    document.getElementById('dashboardPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('loginForm').reset();
    
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';
}

// --- FUNGSI PERPINDAHAN MENU (TABS) ---
function switchTab(tabName) {
    document.getElementById('tab-beranda').classList.add('hidden');
    document.getElementById('tab-menuju9').classList.add('hidden');
    document.getElementById('tab-musik').classList.add('hidden');
    
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    
    const items = document.querySelectorAll('.nav-menu .nav-item');
    items.forEach(item => item.classList.remove('active'));
    
    items.forEach(item => {
        if (item.getAttribute('onclick').includes(tabName)) {
            item.classList.add('active');
        }
    });
}

// --- FUNGSI KLIK PEMUTAR PLAYLIST MUSIK ASLI DENGAN GAMBAR DINAMIS ---
function playSong(title, artist, audioFile, coverImg, event) {
    document.getElementById('currentTitle').innerText = title;
    document.getElementById('currentArtist').innerText = artist;
    
    // Ralat: Mengubah file gambar/foto album art asli secara dinamis
    albumArt.src = coverImg;
    
    // Cek index track untuk fitur Next/Prev
    const trackItems = document.querySelectorAll('.track-item');
    trackItems.forEach((item, index) => {
        if(item === event.currentTarget) {
            currentTrackIndex = index;
        }
    });

    // Jalankan sistem HTML5 Audio
    if (currentTrackFile !== audioFile) {
        currentTrackFile = audioFile;
        audioPlayer.src = audioFile; 
    }
    
    audioPlayer.play();
    
    // Ralat OCD: Set ikon ke pause dan pastikan class disesuaikan agar simetris di tengah
    playPauseBtn.innerText = '⏸';
    playPauseBtn.classList.remove('is-play-icon');
    playPauseBtn.classList.add('is-pause-icon');
    
    albumArt.style.animation = 'spin 12s linear infinite'; // Diperlambat sedikit agar foto tidak pusing saat berputar
    albumArt.style.animationPlayState = 'running';
    
    // Reset teks status lagu lama di list kiri
    trackItems.forEach(item => {
        item.classList.remove('playing');
        const statusText = item.querySelector('.track-status');
        if (statusText && statusText.innerText.includes('Diputar')) {
            statusText.innerText = '03:00'; 
            statusText.style.color = '#8b949e';
        }
    });
    
    // Set status lagu baru yang diklik
    const activeItem = event.currentTarget;
    activeItem.classList.add('playing');
    
    const activeStatus = activeItem.querySelector('.track-status');
    if (activeStatus) {
        activeStatus.innerText = '▶ Sekarang Diputar';
        activeStatus.style.color = '#00e5ff';
    }
}

// --- FUNGSI TOMBOL PLAY / PAUSE MINI PLAYER ---
function togglePlay() {
    if (audioPlayer.src === '' || audioPlayer.paused) {
        // Jika belum memilih lagu sama sekali, klik otomatis baris lagu pertama
        if (audioPlayer.src === '') {
            const firstTrack = document.querySelector('.track-item');
            if (firstTrack) firstTrack.click();
            return;
        }
        audioPlayer.play();
        
        // Ralat OCD: Sinkronisasi simetris tombol saat diganti ke Pause
        playPauseBtn.innerText = '⏸';
        playPauseBtn.classList.remove('is-play-icon');
        playPauseBtn.classList.add('is-pause-icon');
        albumArt.style.animationPlayState = 'running';
    } else {
        audioPlayer.pause();
        
        // Ralat OCD: Sinkronisasi simetris tombol saat diganti ke Play
        playPauseBtn.innerText = '▶';
        playPauseBtn.classList.remove('is-pause-icon');
        playPauseBtn.classList.add('is-play-icon');
        albumArt.style.animationPlayState = 'paused';
    }
}

// --- LOGIKA UPDATE TIMING PROGRESS BAR ---
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBarFill.style.width = progressPercent + '%';
    }
});

// --- FUNGSI KLIK GARIS PROGRESS BAR (SEEKING AUDIO) ---
function seekAudio(event) {
    const progressBarContainer = event.currentTarget;
    const clickPositionX = event.offsetX;
    const totalWidth = progressBarContainer.clientWidth;
    
    if (audioPlayer.duration) {
        const newTime = (clickPositionX / totalWidth) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    }
}

// --- FITUR SEBELUMNYA & BERIKUTNYA (NEXT / PREV) ---
function nextSong() {
    const trackItems = document.querySelectorAll('.track-item');
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= trackItems.length) nextIndex = 0; // Balik ke lagu pertama jika habis
    if (trackItems[nextIndex]) trackItems[nextIndex].click();
}

function prevSong() {
    const trackItems = document.querySelectorAll('.track-item');
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = trackItems.length - 1; // Balik ke lagu terakhir jika mundur terus
    if (trackItems[prevIndex]) trackItems[prevIndex].click();
}

// Otomatis pindah ke lagu berikutnya kalau lagu yang diputar selesai/habis
audioPlayer.addEventListener('ended', () => {
    nextSong();
});