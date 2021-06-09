/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as yup from '../../../src/util/vendor/yup';
import { Box, Button, ButtonProps, FormControl, FormControlLabel, FormHelperText, FormLabel, makeStyles, Radio, RadioGroup, TextField, Theme } from '@material-ui/core';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import useForm from 'react-hook-form';
import castMemberHttp from '../../util/http/cast-member-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing()
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string().label('Nome').required().max(255),
    type: yup.number().label('Tipo').required()
})

export const Form = () => {

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        reset,
        watch,
        errors
    } = useForm({
        validationSchema
    });

    const classes = useStyles();
    const history = useHistory();
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(false);

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: 'contained',
        disabled: loading
    };

    useEffect(() => {
        register({ name: "type" })
    }, [register]);

    useEffect(() => {
        if (!id) return;

        async function getCastMember() {
            setLoading(true);
            try {
                const { data } = await castMemberHttp.get(id);
                reset(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' })
            } finally {
                setLoading(false);
            }
        }

        getCastMember();
    }, [])

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !id
                ? castMemberHttp.create(formData)
                : castMemberHttp.update(id, formData);

            const { data } = await http;

            snackbar.enqueueSnackbar('Pessoa salva com sucesso.', { variant: 'success' });

            setTimeout(() => {
                event
                    ? (id
                        ? history.replace(`/cast-members/${data.data.id}/edit`)
                        : history.push(`/cast-members/${data.data.id}/edit`))
                    : history.push('/cast-members');
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar('Não foi possível salvar a pessoa.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                disabled={loading}
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
                InputLabelProps={{ shrink: true }}
            />

            <FormControl
                margin="normal"
                disabled={loading}
                error={errors.type !== undefined}>

                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}
                    value={watch('type') + ""}>
                    <FormControlLabel value="1" control={<Radio color='primary' />} label="Ator" />
                    <FormControlLabel value="2" control={<Radio color='primary' />} label="Diretor" />
                </RadioGroup>
                {
                    errors.type
                        ? <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
                        : null
                }
            </FormControl>

            <Box dir={"rtl"}>
                <Button {...buttonProps} color='primary' onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )
}