import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

const AudioPlayer = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const response = await fetch(audio.url);
        if (!response.ok) {
          throw new Error("Failed to fetch audio URL");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load();
        }
      } catch (err) {
        console.error("Error fetching audio URL:", err);
        setError("Failed to load audio. Please try again later.");
        setIsLoading(false);
      }
    };

    if(!!audio) {
      fetchAudioUrl();
    }
  }, [audio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restartAudio = () => {
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md h-fit">
      <audio ref={audioRef} />
      {audio?.title && (
        <h3 className="text-wrap text-lg font-semibold mb-4">{audio.title}</h3>
      )}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={togglePlay}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={restartAudio}
          className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 transition-colors"
          disabled={isLoading}
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={toggleMute}
          className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 transition-colors"
          disabled={isLoading}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => {
            const time = parseFloat(e.target.value);
            setCurrentTime(time);
            audioRef.current.currentTime = time;
          }}
          className="w-full"
          disabled={isLoading}
        />
        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
      </div>
      {isLoading && !!audio  && <div className="text-center mt-2">Loading audio...</div>}
    </div>
  );
};

export default AudioPlayer;
