import {useEffect, useState, useRef} from "react";
import {videoAPI} from "../client.tsx";

interface Video {
  id: string,
  title: string,
  url: string
}

// Assuming you already have these components from your existing app
import VideoPlayer from './VideoPlayer';
import WaveformVisualizer from './WaveformVisualizer';

const VideoPlayerWithSupabase = () => {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);


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

  // Handle video selection
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

  return (
    <div className="video-player-container">
      <div className="video-list">
        <h3>Available Videos</h3>
        {loading && <p>Loading videos...</p>}
        {error && <p className="error">{error}</p>}
        <ul>
          {videos.map((video) => (
            <li 
              key={video.id} 
              onClick={() => handleVideoSelect(video)}
              className={selectedVideo?.title === video.name ? 'selected' : ''}
            >
              {video.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="video-player-section">
        {selectedVideo ? (
          <>
            <h2>{selectedVideo.title}</h2>
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
            <div className="controls">
              <PlayPauseButton 
                isPlaying={isPlaying} 
                onClick={togglePlayPause} 
              />
              <WaveformVisualizer 
                audioSource={selectedVideo.url} 
                isPlaying={isPlaying}
              />
            </div>
            <TagInput onTagAdd={handleTagAdd} />
          </>
        ) : (
          <div className="empty-state">
            <p>Select a video from the list to play</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .video-player-container {
          display: flex;
          gap: 2rem;
        }
        
        .video-list {
          width: 300px;
          border-right: 1px solid #eaeaea;
          padding-right: 1rem;
        }
        
        .video-list ul {
          list-style: none;
          padding: 0;
        }
        
        .video-list li {
          padding: 8px 12px;
          margin-bottom: 4px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .video-list li:hover {
          background-color: #f0f0f0;
        }
        
        .video-list li.selected {
          background-color: #e6f7ff;
          border-left: 3px solid #1890ff;
        }
        
        .video-player-section {
          flex: 1;
        }
        
        .controls {
          display: flex;
          align-items: center;
          margin-top: 1rem;
        }
        
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 300px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .error {
          color: #ff4d4f;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayerWithSupabase;