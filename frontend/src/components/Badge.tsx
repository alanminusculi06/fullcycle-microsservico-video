import * as React from 'react';
import { Chip, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import theme from '../theme';

const yesTheme = createMuiTheme({
    palette: {
        primary: theme.palette.success
    }
});

const noTheme = createMuiTheme({
    palette: {
        primary: theme.palette.error
    }
});

export const BadgeYes = () => {
    return (
        <MuiThemeProvider theme={yesTheme}>
            <Chip label="Sim" color="primary" />
        </MuiThemeProvider>
    );
};

export const BadgeNo = () => {
    return (
        <MuiThemeProvider theme={noTheme}>
            <Chip label="Não" color="primary" />
        </MuiThemeProvider>
    );
};