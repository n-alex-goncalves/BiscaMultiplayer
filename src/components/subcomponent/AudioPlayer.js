import React, { useState, useEffect, useRef } from 'react';
import '../../assets/AudioPlayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons'

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current.pause();
  }, [audioRef]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="audio-container">
      <audio ref={audioRef} autoPlay loop={isPlaying}>
        <source src={src} type="audio/mpeg" />
      </audio>
      <button className="audio-toggle" onClick={toggleAudio}>
        {isPlaying ? <FontAwesomeIcon icon={faVolumeUp} /> : <FontAwesomeIcon icon={faVolumeMute} />}
      </button>
    </div>
  );
};

export default AudioPlayer;
