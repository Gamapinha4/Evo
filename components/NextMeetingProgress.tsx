import { useEffect, useState } from 'react';

const convertTimeToTimestamp = (time: any): any => {
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

export const getNextMeeting = (db: any): any => {
    const now = new Date().getTime();
    const upcomingMeetings = db
        .map((meeting: any) => ({
            ...meeting,
            startTimestamp: convertTimeToTimestamp(meeting.timeInicio),
            endTimestamp: convertTimeToTimestamp(meeting.timeFim),
        }))
        .filter((meeting: any) => meeting.startTimestamp > now);

    if (upcomingMeetings.length === 0) return null;

    return upcomingMeetings.reduce((nextMeeting: any, meeting: any) => 
        meeting.startTimestamp < nextMeeting.startTimestamp ? meeting : nextMeeting
    );
};

const getMeetingsCountAndAvailableTimes = (db: any, empresa: any, sala: any): any => {
    const now = new Date().getTime();
    const meetings = db
        .filter((meeting: any) => meeting.empresa === empresa && meeting.sala === sala)
        .map((meeting: any) => ({
            ...meeting,
            startTimestamp: convertTimeToTimestamp(meeting.timeInicio),
            endTimestamp: convertTimeToTimestamp(meeting.timeFim),
        }))
        .filter((meeting: any) => meeting.endTimestamp > now);

    const availableTimes: any = [];
    meetings.forEach((meeting: any, index: any) => {
        if (index === 0 && meeting.startTimestamp > now) {
            availableTimes.push(`Até ${meeting.timeInicio}`);
        } else if (index > 0) {
            const previousMeeting = meetings[index - 1];
            if (previousMeeting.endTimestamp < meeting.startTimestamp) {
                availableTimes.push(`${previousMeeting.timeFim} - ${meeting.timeInicio}`);
            }
        }   
        if (index === meetings.length - 1 && meeting.endTimestamp > now) {
            availableTimes.push(`Após ${meeting.timeFim}`);
        }
    });

    return {
        count: meetings.length,
        availableTimes
    };
};


const NextMeetingProgress = ({ db }: any) => {
    const [nextMeeting, setNextMeeting]: any = useState(null);
    const [meetingsInfo, setMeetingsInfo]: any = useState({ count: 0, availableTimes: [] });

    useEffect(() => {
        const meeting = getNextMeeting(db);
        setNextMeeting(meeting);

        if (meeting) {
            const info = getMeetingsCountAndAvailableTimes(db, meeting.empresa, meeting.sala);
            setMeetingsInfo(info);
        }
    }, [db]);

    if (!nextMeeting) return <div></div>;

    return (
        <div style={{marginTop: '5%'}}>
            <h3>Quantidade de reuniões marcadas nesta sala: {meetingsInfo.count}</h3>
            <h3>Horários disponíveis:</h3>
            <ul>
                {meetingsInfo.availableTimes.map((time: any, index: any) => (
                    <li key={index}>{time}</li>
                ))}
            </ul>
        </div>
    );
};

export default NextMeetingProgress;
