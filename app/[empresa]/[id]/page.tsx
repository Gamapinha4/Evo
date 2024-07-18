'use client'
import { useEffect, useState } from 'react';
import { useQRCode } from 'next-qrcode';
import Logo from '@/components/Logo';
import ProgressBar from '@/components/ProgressBar';
import { hatch } from 'ldrs';
import { db, empresas } from '@/components/list';
import NextMeetingProgress from '@/components/NextMeetingProgress';

export default function Page({ params }: { params: { empresa: string, id: string } }) {
    const { Canvas } = useQRCode();
    const [loading, setLoading] = useState(true);
    const [empresa, setEmpresa] = useState<string | null>(null);
    const [infos, setInfos] = useState<any[]>([]);
    const [timeUntilNextMeeting, setTimeUntilNextMeeting] = useState<number | null>(null);
    const [temporaryMessage, setTemporaryMessage] = useState<string | null>(null);
    const [nextMeetingIndex, setNextMeetingIndex] = useState<number>(0); 

    hatch.register();

    useEffect(() => {
        const fetchEmpresa = async () => {
            const empresaFound = empresas.find(item => item.code === params.empresa);
            if (empresaFound) {
                setEmpresa(empresaFound.empresa);

                const filteredInfos = db.filter((dbItem: any) =>
                    dbItem.empresa === empresaFound.empresa &&
                    dbItem.sala === String(parseInt(params.id) <= 9 ? '0' + params.id : params.id)
                );
                setInfos(filteredInfos);

                const now = new Date().getTime();
                const upcomingMeetings = filteredInfos
                    .map((meeting: any) => ({
                        ...meeting,
                        startTimestamp: convertTimeToTimestamp(meeting.timeInicio),
                        endTimestamp: convertTimeToTimestamp(meeting.timeFim),
                    }))
                    .filter((meeting: any) => meeting.startTimestamp > now);

                if (upcomingMeetings.length > 0) {
                    const nextMeeting = upcomingMeetings.reduce((next: any, current: any) =>
                        current.startTimestamp < next.startTimestamp ? current : next
                    );

                    const timeUntilNext = nextMeeting.startTimestamp - now;
                    setTimeUntilNextMeeting(timeUntilNext);

                    if (timeUntilNext < 300000) {
                        setTemporaryMessage(`Próxima reunião em breve`);
                    } else {
                        setTemporaryMessage(null);
                    }

                    const nextIndex = filteredInfos.findIndex((item: any) => item === nextMeeting);
                    if (nextIndex !== -1) {
                        setNextMeetingIndex(nextIndex);
                    }
                } else {
                    setTimeUntilNextMeeting(null);
                    setTemporaryMessage('Não há próximas reuniões agendadas');
                }
            } else {
                setEmpresa(null);
            }

            setLoading(false);
        };

        fetchEmpresa();

        const interval = setInterval(fetchEmpresa, 1000);

        return () => clearInterval(interval);
    }, [params]);

    const convertTimeToTimestamp = (time: any): number => {
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
        const checkNextMeetingTime = () => {
            if (infos.length > 0 && nextMeetingIndex >= 0 && nextMeetingIndex < infos.length) {
                const nextMeeting = infos[nextMeetingIndex];
                const now = new Date().getTime();
                const meetingEndTime = convertTimeToTimestamp(nextMeeting.timeFim);

                if (now >= meetingEndTime) {
                    const newIndex = nextMeetingIndex + 1;

                    if (newIndex < infos.length) {
                        const nextMeeting = infos[newIndex];
                        const now = new Date().getTime();
                        const timeUntilNext = convertTimeToTimestamp(nextMeeting.timeInicio) - now;

                        setNextMeetingIndex(newIndex);
                        setTimeUntilNextMeeting(timeUntilNext);
                        
                        if (timeUntilNext < 300000) {
                            setTemporaryMessage(`Próxima reunião em breve`);
                        } else {
                            setTemporaryMessage(null);
                        }
                    } else {
                        setInfos([]);
                        setTemporaryMessage('Não há próximas reuniões agendadas');
                    }
                }
            }
        };

        const interval = setInterval(checkNextMeetingTime, 1000);

        return () => clearInterval(interval);
    }, [infos, nextMeetingIndex]);

    if (loading) {
        return (
            <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '23%' }}>
                <l-hatch
                    size="60"
                    stroke="4"
                    speed="3.5"
                    color="black"
                ></l-hatch>
            </div>
        );
    }

    if (empresa === null) {
        return (
            <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '20%', flexDirection: 'column' }}>
                <Logo />
                <text style={{ fontSize: 28 }}>Empresa não encontrada!</text>
                <text style={{ fontSize: 20 }}>Entre em contato com nosso suporte.</text>
            </div>
        );
    }

    if (infos.length > 0 && nextMeetingIndex >= 0 && nextMeetingIndex < infos.length) {
        const item = infos[nextMeetingIndex];

        return (
            <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '15%', flexDirection: 'row' }}>
                <Canvas
                    text={'https://github.com/gamapinha4/evo'}
                    options={{
                        errorCorrectionLevel: 'M',
                        margin: 3,
                        scale: 4,
                        width: 400,
                        color: {
                            dark: '#000',
                            light: '#FFF',
                        },
                    }}
                />
                <div style={{ display: "flex", flexDirection: 'column', marginLeft: '5%' }}>
                    <text style={{ fontSize: 48 }}>ESTÁ É A SALA:</text>
                    <text style={{ fontSize: 78 }}>{parseInt(params.id) <= 9 ? '0' + params.id : params.id}</text>

                    <text style={{ fontSize: 24, marginTop: '1%' }}>Esta sala foi agendada por: <span style={{ color: 'chocolate' }}>{item.author}</span></text>
                    <text style={{ fontSize: 24, marginTop: '1%' }}>Horário: <span style={{ color: 'chocolate' }}>{item.timeInicio}H</span> até <span style={{ color: 'chocolate' }}>{item.timeFim}H</span></text>
                    <ProgressBar startTime={item.timeInicio} endTime={item.timeFim} />
                    <NextMeetingProgress db={db}/>

                    {timeUntilNextMeeting !== null && <text>Próxima reunião em: {formatTime(timeUntilNextMeeting)}</text>}
                </div>
            </div>
        );
    }
    return (
        <div style={{ display: "flex", flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: '15%', flexDirection: 'row' }}>
            <Canvas
                text={'https://github.com/gamapinha4/evo'}
                options={{
                    errorCorrectionLevel: 'M',
                    margin: 3,
                    scale: 4,
                    width: 400,
                    color: {
                        dark: '#000',
                        light: '#FFF',
                    },
                }}
            />
            <div style={{ display: "flex", flexDirection: 'column', marginLeft: '5%' }}>
                <text style={{ fontSize: 48 }}>ESTÁ É A SALA:</text>
                <text style={{ fontSize: 78 }}>{parseInt(params.id) <= 9 ? '0' + params.id : params.id}</text>

                <text style={{ fontSize: 24, marginTop: '25%' }}>{empresa}</text>
                <text style={{ fontSize: 24, marginTop: '1%' }}>Não há mais reuniões agendadas.</text>
            </div>
        </div>
    );
}

const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
};
