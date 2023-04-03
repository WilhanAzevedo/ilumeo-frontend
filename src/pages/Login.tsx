import { createStyles, rem, Button, TextInput } from '@mantine/core';
import './Login.css'

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
    },

    input: {
        width: 365,
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

export function Login() {
    const { classes } = useStyles();

    return (
        <div className="conatiner-login">
            <span className="title-login">Ponto <b>Ilumeo</b></span>
            <TextInput label="Código do Usuário" placeholder="4SXXFMf" classNames={classes} />
            <Button color="blue" className="my-button" variant="filled" size="lg" fullWidth> Continuar </Button>
        </div>
    );
}