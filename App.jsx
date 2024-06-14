import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const songs = [
  {
    title: 'Gulabi Sadi',
    artist: 'Sanju Rathod',
    src: 'Gulabi Sadi Ani Lali(PagalWorld.com.sb).mp3',
  },
  {
    title: 'Main Tenu Samjhawan Ki',
    artist: 'Arijit Singh, Shreya Ghoshal',
    src: 'Main-Tenu-Samjhawan-Ki(PaglaSongs).mp3',
  },
  {
    title: 'Deva Deva',
    artist: 'Arijit Singh, Jonita Gandhi',
    src: 'Deva Deva From Brahmastra - (Raag.Fm).mp3',
  },
  
  // Add more songs as needed
];

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayer = useRef(null);

  useEffect(() => {
    loadSong(currentSongIndex);
  }, [currentSongIndex]);

  useEffect(() => {
    const updateTime = () => {
      if (audioPlayer.current) {
        setCurrentTime(audioPlayer.current.currentTime);
      }
    };
    const player = audioPlayer.current;
    player.addEventListener('timeupdate', updateTime);
    return () => player.removeEventListener('timeupdate', updateTime);
  }, []);

  const loadSong = (songIndex) => {
    const song = songs[songIndex];
    if (audioPlayer.current) {
      audioPlayer.current.src = song.src;
      audioPlayer.current.onloadedmetadata = () => {
        setDuration(audioPlayer.current.duration);
        console.log(`Loaded song: ${song.title}`);
      };
      audioPlayer.current.onerror = (error) => {
        console.error(`Error loading song: ${song.title}`, error);
      };
      if (isPlaying) {
        audioPlayer.current.play();
      } else {
        setCurrentTime(0);
      }
    }
  };

  const playPause = () => {
    if (audioPlayer.current.paused) {
      audioPlayer.current.play();
      setIsPlaying(true);
    } else {
      audioPlayer.current.pause();
      setIsPlaying(false);
    }
  };

  const skipNext = () => {
    setIsPlaying(false);
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
  };

  const skipPrevious = () => {
    setIsPlaying(false);
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="music-player">
      <div className="song-info">
        <h2 id="song-title">{songs[currentSongIndex].title}</h2>
        <p id="artist">{songs[currentSongIndex].artist}</p>
      </div>
      <audio id="audio-player" ref={audioPlayer} />
      <div className="controls">
        <button id="prev-btn" onClick={skipPrevious}>Previous</button>
        <button id="play-pause-btn" onClick={playPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button id="skip-btn" onClick={skipNext}>Next</button>
      </div>
      <div className="time-info">
        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default App;
