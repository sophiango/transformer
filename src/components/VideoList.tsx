import {useEffect, useState} from "react";
import {videoAPI} from "../client.tsx";
// @ts-ignore

interface Video {
    id: string,
    title: string,
    url: string
}

const VideoList = () => {
    const [videoList, setVideoList] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Fetch videos from Supabase storage
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
          if (error) {
            throw error;
          }
    
            setVideoUrl(url);

            // Reset state when loading a new video
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            setIssues([]);
            setAudioData([]); // Clear previous audio data

            // Process actual audio from video instead of mock data
            if (file.type.includes('video')) {
                extractAudioData(url);
            }

        } catch (error) {
          console.error('Error getting video URL:', error);
          setError('Failed to load the selected video. Please try again.');
        }
      };


    if (loading) {
        return <p>Loading ... </p>;
    } else if (error !== null) {
        return <p>Error fetching videos:</p>;
    } else {
        return (
            <ul>
                {
                    videoList.map((Video) => (
                        <a>
                            <li key={Video.id}>{Video.title}</li>
                        </a>
                    ))
                }
            </ul>
        )
    }
};

export default VideoList;