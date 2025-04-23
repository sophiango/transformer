import React, {useState} from 'react';
import './Waveform.css';

type WaveformProps = {
    bars?: number;
};

const Waveform: React.FC<WaveformProps> = ({bars = 500}) => {
    const [marked, setMarked] = useState<Set<number>>(new Set());
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const toggleMark = (index: number) => {
        setMarked(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            console.log("new set index", newSet);
            return newSet;
        });
    };

    return (
        <div className="fc-waveform">
            {[...Array(bars)].map((_, i) => {
                const height = Math.random() * 80 + 10;
                const isMarked = marked.has(i);
                const isHovered = i === hoverIndex;

                return (
                    <div
                        key={i}
                        className={`fc-bar ${isMarked ? 'marked' : ''} ${isHovered ? 'hovered' : ''}`}
                        style={{height: `${height}%`}}
                        onClick={() => toggleMark(i)}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                    />
                );
            })}
        </div>
    );

};

export default Waveform;
