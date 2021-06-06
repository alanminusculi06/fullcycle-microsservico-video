import * as React from 'react';
import { Box, Button, ButtonProps, Checkbox, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core';
import categoryHttp from '../../util/http/category-http';
import useForm from 'react-hook-form';
import * as yup from '../../../src/util/vendor/yup';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing()
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string().label("Nome").required().max(255),
})

export const Form = () => {

    const classes = useStyles();

    const { register, handleSubmit, getValues, errors, reset, watch, setValue } = useForm({
        validationSchema
    });

    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);
    const snackbar = useSnackbar();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: 'contained',
        disabled: loading
    };

    useEffect(() => {
        register({ name: 'is_active' })
    }, [register]);

    useEffect(() => {
        if (!id) {
            return;
        }
        setLoading(true);
        categoryHttp.get(id).then(response => {
            setCategory(response.data.data);
            reset(response.data.data)
        }).finally(() => setLoading(false))
    }, [])

    function onSubmit(formData, event) {
        setLoading(true);

        const http = !id
            ? categoryHttp.create(formData)
            : categoryHttp.update(id, formData);

        http.then(({ data }) => {
            snackbar.enqueueSnackbar('Categoria salva com sucesso.', { variant: 'success' });
            setTimeout(() => {
                event
                    ? (id
                        ? history.replace(`/categories/${data.data.id}/edit`)
                        : history.push(`/categories/${data.data.id}/edit`))
                    : history.push('/categories');
            });
        })
            .catch((error) => {
                snackbar.enqueueSnackbar('Nào foi possível salvar a categoria.', { variant: 'error' });
            })
            .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControlLabel
                disabled={loading}
                control={
                    <Checkbox
                        color='primary'
                        name="is_active"
                        checked={watch('is_active')}
                        onChange={() => setValue('is_active', !getValues()['is_active'])} />}
                label='Ativo'
                labelPlacement='end' />

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

            <TextField
                disabled={loading}
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                InputLabelProps={{ shrink: true }}
                margin={"normal"}
                inputRef={register}
            />

            <Box dir={"rtl"}>
                <Button {...buttonProps} color='primary' onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )
}