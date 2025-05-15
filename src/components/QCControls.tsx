// src/components/QCControls.tsx

import {useState} from "react";

interface QCControlsProps {
    currentTime: number;
    onAddIssue: (issue: string) => void;
    issues: string[];
}

// @ts-ignore
const QCControls = ({currentTime, onAddIssue, issues}: QCControlsProps) => {
    const [customIssue, setCustomIssue] = useState<string>('');

    const handleAddIssue = (issueType: string) => {
        onAddIssue(issueType);
    };

    const handleCustomIssueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomIssue(e.target.value);
    };

    const handleCustomIssueSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customIssue.trim()) {
            onAddIssue(customIssue);
            setCustomIssue('');
        }
    };

    return (
        <div className="qc-controls">
            <h3>Quality Control</h3>

            <div className="preset-issues">
                <button onClick={() => handleAddIssue('Video Glitch')}>Video Glitch</button>
                <button onClick={() => handleAddIssue('Audio Dropout')}>Audio Dropout</button>
                <button onClick={() => handleAddIssue('Sync Issue')}>Sync Issue</button>
                <button onClick={() => handleAddIssue('Color Issue')}>Color Issue</button>
            </div>

            <form onSubmit={handleCustomIssueSubmit} className="custom-issue-form">
                <input
                    type="text"
                    value={customIssue}
                    onChange={handleCustomIssueChange}
                    placeholder="Custom issue..."
                    className="custom-issue-input"
                />
                <button type="submit" className="add-issue-btn">Add</button>
            </form>

            <div className="issues-list">
                <h4>Issues Found:</h4>
                {issues.length > 0 ? (
                    <ul>
                        {issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No issues reported yet.</p>
                )}
            </div>
        </div>
    );
};

export default QCControls;