// src/components/WaveformVisualizer.tsx

import {useEffect, useRef} from "react";

interface WaveformVisualizerProps {
    audioData: number[];
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
}

const WaveformVisualizer = ({
                                audioData,
                                currentTime,
                                duration,
                                onSeek
                            }: WaveformVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawWaveform();
    }, [audioData, currentTime]);

    const drawWaveform = () => {
        const canvas = canvasRef.current;
        if (!canvas || audioData.length === 0 || duration === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set styles
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#4CAF50';
        ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';

        const width = canvas.width;
        const height = canvas.height;
        const barWidth = width / audioData.length;

        // Draw waveform
        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        audioData.forEach((dataPoint, i) => {
            const x = i * barWidth;
            const y = (dataPoint * height / 2) + (height / 2);
            ctx.lineTo(x, y);
        });

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.closePath();

        // Fill area under waveform
        ctx.globalAlpha = 0.2;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw playhead
        if (duration > 0) {
            const playheadPos = (currentTime / duration) * width;
            ctx.beginPath();
            ctx.moveTo(playheadPos, 0);
            ctx.lineTo(playheadPos, height);
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || duration === 0) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const canvasWidth = canvas.width;

        const clickTimeRatio = clickX / canvasWidth;
        const newTime = clickTimeRatio * duration;

        onSeek(newTime);
    };

    return (
        <div className="waveform-container">
            <h3>Audio Waveform</h3>
            <canvas
                ref={canvasRef}
                className="waveform-canvas"
                width={800}
                height={100}
                onClick={handleCanvasClick}
            />
        </div>
    );
};

export default WaveformVisualizer;