// src/App.tsx
import {useRef, useState, useEffect} from 'react';
import VideoPlayer from './components/VideoPlayer';
import WaveformVisualizer from './components/WaveformVisualizer';
import QCControls from './components/QCControls';
import './App.css';
import { videoAPI } from './client';

function App() {
    const [videoList, setVideoList] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [videoUrl, setVideoUrl] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);
    const [audioData, setAudioData] = useState<number[]>([]);
    const [issues, setIssues] = useState<string[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch videos
                const fetchedVideos = await videoAPI.getAllVideos();
                console.log(fetchedVideos);
                setVideoList(fetchedVideos);

            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures this effect runs only once on mount

    const handleVideoSelect = async (video: Video) => {
        try {
          setVideoUrl(video.url);
    
          // Reset state when loading a new video
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
          setIssues([]);
          setAudioData([]); // Clear previous audio data
    
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error('Error getting video URL:', error);
          setError('Failed to load the selected video. Please try again.');
        }
      };
    

    const extractAudioData = async (videoUrl: string) => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const response = await fetch(videoUrl);
            const arrayBuffer = await response.arrayBuffer();

            // Try to decode the audio data
            audioContext.decodeAudioData(
                arrayBuffer,
                (audioBuffer) => {
                    // Successfully decoded audio
                    const channelData = audioBuffer.getChannelData(0); // Get first channel

                    // Downsample for visualization (we don't need all samples)
                    const samples = 1000;
                    const blockSize = Math.floor(channelData.length / samples);
                    const downsampled = [];

                    for (let i = 0; i < samples; i++) {
                        const blockStart = i * blockSize;
                        let sum = 0;

                        // Find the max amplitude in this block
                        for (let j = 0; j < blockSize && (blockStart + j) < channelData.length; j++) {
                            sum = Math.max(sum, Math.abs(channelData[blockStart + j]));
                        }

                        downsampled.push(sum);
                    }

                    setAudioData(downsampled);
                },
                (err) => {
                    console.error("Error decoding audio data:", err);
                    // If there's an error (like no audio track), set empty data
                    setAudioData([]);
                }
            );
        } catch (error) {
            console.error("Error extracting audio data:", error);
            setAudioData([]);
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

    if (loading) {
        return <p>Loading ... </p>;
    } else if (error !== null) {
        return <p>Error fetching videos:</p>;
    } else {
        return (
            <div className="flex mb-4 full-width">
                <div className="w-1/6">
                    <div className="preset-issues">
                        {
                            videoList.map((video) => (
                                <button onClick={() => handleVideoSelect(video)}>{video.title}</button>
                            ))
                        }
                    </div>
                </div>
                <div className="w-5/6 relative z-0">
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
                {/* <header className="header">
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
                    </header> */}
            </div>
        );
    }
}

export default App;