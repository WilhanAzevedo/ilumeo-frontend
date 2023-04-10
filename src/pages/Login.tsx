import { createStyles, rem, Button, TextInput, MantineProvider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import './Login.css'
import axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const { classes } = useStyles();

    const [code, setCode] = useState(0);

    const handleCode = (e: any) => {
        setCode(e.target.value);
    }

    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_URL_BACKEND;

    const handleSubmit = (e: any) => {

        e.preventDefault();
        axios.post(`${baseUrl}/users/login`, { code })
            .then(response => {
                localStorage.setItem('usuario', JSON.stringify(response.data));
                console.log(response.data);
                navigate('/home');


            }).catch(error => {
                notifications.show({
                    title: 'Ops!',
                    message: 'Usuario não encontrado!',
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
            }
        );
    }



    return (
        <MantineProvider>
            <Notifications />
            <div className="container-login">
                <span className="title-login">Ponto <b>Ilumeo</b></span>
                <TextInput label="Código do Usuário" placeholder="4SXXFMf" classNames={classes} onChange={handleCode} />
                <Button color="blue" className="my-button" variant="filled" size="lg" fullWidth onClick={handleSubmit}>Entrar</Button>
            </div>
        </MantineProvider>
    );

}

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
    },

    input: {
        width: '100%',
        height: 60,
        paddingTop: rem(18),
        marginTop: 46,
        borderRadius: 4,
        background: '#1E2733',
        borderWidth: 0,
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: 21.6,
        lineHeight: 26,
        color: '#FFFFFF',
    },

    label: {
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: `calc(${theme.spacing.sm} / 2)`,
        zIndex: 1,
        color: '#FFFFFF',
    },
}));