import { useEffect, useState } from 'react';

const ProgressBar = ({ startTime, endTime } : any) => {
    const [progress, setProgress] = useState(0);

    const convertTimeToTimestamp = (time: any) => {
        if (!time) {
            console.error('Invalid time:', time);
            return 0;
        }

        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const targetTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
        );
        return targetTime.getTime();
    };

    useEffect(() => {
        const startTimestamp = convertTimeToTimestamp(startTime);
        const endTimestamp = convertTimeToTimestamp(endTime);

        const updateProgress = () => {
            const now = new Date().getTime();

            const totalTime = endTimestamp - startTimestamp;
            const elapsed = now - startTimestamp;
            const progress = Math.min(Math.max((elapsed / totalTime) * 100, 0), 100);
            setProgress(progress);

            console.log({
                now: new Date(now).toLocaleTimeString(),
                start: new Date(startTimestamp).toLocaleTimeString(),
                end: new Date(endTimestamp).toLocaleTimeString(),
                totalTime,
                elapsed,
                progress
            });
        };

        updateProgress();
        const interval = setInterval(updateProgress, 1000);

        return () => clearInterval(interval);
    }, [startTime, endTime]);

    return (
        <div style={{width: '100%', height: '30px', marginTop: '2%' }}>
            <div
                style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'chocolate',
                    transition: 'width 1s ease-in-out',
                    borderRadius: '8px'
                }}
            />
            <p>{progress.toFixed(2)}% concluído</p>
        </div>
    );
};

export default ProgressBar;
