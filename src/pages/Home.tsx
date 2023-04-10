import { createStyles, rem, Button, TextInput, MantineProvider, Loader } from '@mantine/core'
import { useEffect, useState } from "react";
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import axios from 'axios';
import { json, useNavigate } from "react-router-dom";
import './Home.css'

type receivedPoints = {
    id: number,
    user_id: number,
    entry: string,
    exit: string

}


export function Home() {
    const [titleButton, setTitle] = useState('Hora de entrada');
    const [pointsConverted, setPointsConverted] = useState<Array<{ date: string, hours: string }>>([{ date: '00/00/00', hours: '0h 0m' }]);
    const [horas, setHoras] = useState('0h 0m 0s');
    const [loading , setLoading] = useState(false);
    const [getPts, setGetPts] = useState(true);
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const baseUrl = import.meta.env.VITE_URL_BACKEND;



    function getPoints() {
        if (usuario.code === undefined) {
            const navigate = useNavigate();
            navigate('/');
        }
        if (pointsConverted.length == 1) {
            axios.post(`${baseUrl}/points-by-user`, { user_id: usuario.id }).then(response => {
                calculateTime(response.data);
            }).catch(error => {
                console.log(error);
            }
            );
        }
    }

    if (getPts) {
        axios.post(`${baseUrl}/points-by-user`, { user_id: usuario.id }).then(response => {
            calculateTime(response.data);
        }).catch(error => {
            console.log(error);
        }
        );

        setGetPts(false);
    }

    let points: Array<{ date: string, hours: string }> = [];

    function calculateTime(data: [receivedPoints]): void {

        data.forEach((element: receivedPoints) => {
            let today = new Date();
            let entry = new Date(element.entry);
            if (element.exit == null) {
                if (today.getDate() === entry.getDate() && today.getMonth() === entry.getMonth() && today.getFullYear() === entry.getFullYear()) {

                    localStorage.setItem('entry', JSON.stringify(element));
                    let exit = new Date();
                    let diff = exit.getTime() - entry.getTime();
                    let hours = diff / 1000 / 60 / 60;
                    let segundos = diff / 1000;
                    segundos = segundos % 60;
                    let horas = hours.toFixed(2);
                    let h = horas.split('.')[0];
                    let m = horas.split('.')[1];
                    if(parseInt(m) >= 60){
                        h = (parseInt(h) + 1).toString();
                        m = (parseInt(m) - 60).toString();
                    }
                    horas = `${h}h ${m}m`;
                    setHoras(horas);
                    setTitle('Hora de saída');
                }
            } else {
                setHoras('0h 0m 0s');
                setTitle('Hora de entrada');
                let ent = new Date(element.entry);
                let exit = new Date(element.exit);
                let diff = exit.getTime() - ent.getTime();
                let hours = diff / 1000 / 60 / 60 ;

                points.push({ date: `${ent.getDate()}/${ent.getMonth()}/${ent.getFullYear()}`, hours: hours.toFixed(2) });

                points = points.sort((a, b) => {
                    let dateA = a.date.split('/');
                    let dateB = b.date.split('/');
                    let dayA = dateA[0].length === 1 ? `0${dateA[0]}` : dateA[0];
                    let dayB = dateB[0].length === 1 ? `0${dateB[0]}` : dateB[0];
                    let monthA = dateA[1].length === 1 ? `0${dateA[1]}` : dateA[1];
                    let monthB = dateB[1].length === 1 ? `0${dateB[1]}` : dateB[1];
                    let yearA = dateA[2].substring(2, 4);
                    let yearB = dateB[2].substring(2, 4);
                    let date1 = `${yearA}${monthA}${dayA}`;
                    let date2 = `${yearB}${monthB}${dayB}`;
                    if (date1 > date2) {
                        return -1;
                    }
                    if (date1 < date2) {
                        return 1;
                    }
                    return 0;
                });
            }

        });

        points = points.map((point) => {
            let date = point.date.split('/');
            let day = date[0].length === 1 ? `0${date[0]}` : date[0];
            let month = date[1].length === 1 ? `0${date[1]}` : date[1];
            let year = date[2].substring(2, 4);
            point.date = `${day}/${month}/${year}`;
            let hours = point.hours.split('.')[0];
            let minutes = parseInt(point.hours.split('.')[1])
            if(minutes >= 60){
                hours = (parseInt(hours) + 1).toString();
                minutes = (minutes - 60)
                minutes.toString();
            }
            return { date: point.date, hours: `${hours}h ${minutes}m` };
        })

        setPointsConverted(points);

    }


    const handleSubmit = function (e: any) {

        e.preventDefault();
        setLoading(true);
        let interval: any;
        if (titleButton == 'Hora de entrada') {
            axios.post(`${baseUrl}/entries`, { user_id: usuario.id, entry: new Date() }).then(async response => {
                setTitle('Hora de saída');
                notifications.show({
                    title: 'Ótimo!',
                    message: 'Entrada Registrada!',
                    styles: (theme) => ({
                        root: {
                            backgroundColor: '#FE8A00',
                            borderColor: '#FE8A00',

                            '&::before': { backgroundColor: theme.white },
                        },

                        title: { color: theme.white },
                        description: { color: theme.white },
                        closeButton: {
                            color: theme.white,
                            '&:hover': { backgroundColor: '#FE8A00' },
                        },
                    }),
                })
                let hours = 0;
                let minutes = 0;
                let seconds = 0;
                interval = setInterval(() => {
                    seconds++;
                    if (seconds == 60) {
                        seconds = 0;
                        minutes++;
                    }
                    if (minutes == 60) {
                        minutes = 0;
                        hours++;
                    }
                    setHoras(`${hours}h ${minutes}m ${seconds}s`);
                }, 1000);
                setLoading(false);
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });

        }
        if (titleButton == 'Hora de saída') {
            let id = JSON.parse(localStorage.getItem('entry') || '{}').id;
            axios.post(`${baseUrl}/exits`, { user_id: usuario.id, exit: new Date(), id: id }).then(async response => {
                notifications.show({
                    title: 'Ótimo!',
                    message: 'Saída Registrada!',
                    styles: (theme) => ({
                        root: {
                            backgroundColor: '#FE8A00',
                            borderColor: '#FE8A00',

                            '&::before': { backgroundColor: theme.white },
                        },

                        title: { color: theme.white },
                        description: { color: theme.white },
                        closeButton: {
                            color: theme.white,
                            '&:hover': { backgroundColor: '#FE8A00' },
                        },
                    }),
                })
                clearInterval(interval);
                setHoras('0h 0m 0s');
                setTitle('Hora de entrada');
                setGetPts(true);
                setLoading(false);
            }).catch(error => {
                console.log(error);
                setLoading(false);
            });
        }
    }

    return (
        <MantineProvider>
            <Notifications />
            <div>
                <div className="container-home">
                    <div className="container-home-top">
                        <span className="title">Relogio de Ponto</span>
                        <div className='usuario'>
                            <span className="subtitle">#{usuario.code}</span>
                            <span className="sub">Usuário</span>
                        </div>
                    </div>
                    <div className="container-home-horas">
                        <span className='horas'>{horas}</span>
                        <span className='sub-horas'>Horas de hoje</span>
                    </div>
                    <Button color="blue" className="my-button-home" variant="filled" size="lg" fullWidth onClick={handleSubmit}>
                        {loading ? <Loader color="dark" /> : titleButton}
                    </Button>
                    <div className='label-anteriores'>
                        <span className="label-dias">Dias Anteriores</span>
                    </div>
                    <div className='container-points'>
                        {pointsConverted.map((point) => {
                            return (
                                <div className='card'>
                                    <span>{point.date}</span>
                                    <span>{point.hours}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </MantineProvider>
    );
}