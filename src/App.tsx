// src/App.tsx
import {useRef, useState} from 'react';
import VideoPlayer from './components/VideoPlayer';
import WaveformVisualizer from './components/WaveformVisualizer';
import QCControls from './components/QCControls';
import './App.css';

function App() {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);
    const [audioData, setAudioData] = useState<number[]>([]);
    const [issues, setIssues] = useState<string[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);

            // Reset state when loading a new video
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            setIssues([]);

            // Generate mock audio data when a video is loaded
            generateMockAudioData();
        }
    };

    // Mock function to generate waveform data
    const generateMockAudioData = () => {
        const sampleCount = 1000;
        const mockData = Array.from({length: sampleCount}, () => Math.random() * 0.8);
        setAudioData(mockData);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleSeek = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
        }
    };

    const addIssue = (issue: string) => {
        setIssues([...issues, `${formatTime(currentTime)} - ${issue}`]);
    };

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="app-container">
            <header className="header">
                <h1>Video QC Tool</h1>
                <div className="file-controls">
                    <button className="upload-btn" onClick={triggerFileInput}>Upload Video</button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="video/*"
                        onChange={handleFileSelect}
                        style={{display: 'none'}}
                    />
                </div>
            </header>

            <main className="main-content">
                <div className="video-section">
                    <VideoPlayer
                        videoRef={videoRef}
                        videoUrl={videoUrl}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        duration={duration}
                        volume={volume}
                        onPlay={togglePlay}
                        onTimeUpdate={handleTimeUpdate}
                        onSeek={handleSeek}
                        onVolumeChange={handleVolumeChange}
                        onLoadedMetadata={handleLoadedMetadata}
                    />
                </div>

                <div className="waveform-section">
                    <WaveformVisualizer
                        audioData={audioData}
                        currentTime={currentTime}
                        duration={duration}
                        onSeek={handleSeek}
                    />
                </div>

                <div className="qc-section">
                    <QCControls
                        currentTime={currentTime}
                        onAddIssue={addIssue}
                        issues={issues}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;