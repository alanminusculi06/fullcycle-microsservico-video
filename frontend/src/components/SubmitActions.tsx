import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { Box, Theme, Button, ButtonProps } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing()
        }
    }
});

interface SubmitActionProps {
    disableButtons?: boolean;
    handleSave: () => void;
}

const SubmitActions: React.FC<SubmitActionProps> = (props) => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: 'contained',
        disabled: props.disableButtons === undefined ? false : props.disableButtons
    };

    return (
        <Box dir={"ltf"}>
            <Button
                {...buttonProps}
                color='primary'
                onClick={props.handleSave}
            >
                Salvar
            </Button>

            <Button
                {...buttonProps}
                type="submit"
            >
                Salvar e continuar editando
            </Button>
        </Box>
    );
}

export default SubmitActions;