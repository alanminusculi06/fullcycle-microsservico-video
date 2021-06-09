/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as yup from '../../../src/util/vendor/yup';
import { Box, Button, ButtonProps, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import useForm from 'react-hook-form';
import genreHttp from '../../util/http/genre-http';
import categoryHttp from '../../util/http/category-http';

interface Category {
    id: string;
    is_active: boolean;
    name: string;
}

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing()
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string().label('Nome').required().max(255),
    categories_id: yup.array().label('Categorias').required()
})

export const Form = () => {

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        watch,
        reset,
        errors
    } = useForm({
        validationSchema,
        defaultValues: {
            categories_id: [''],
            name: undefined
        }
    });

    const classes = useStyles();
    const history = useHistory();
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<any[]>([]);

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: 'contained',
        disabled: loading
    };

    useEffect(() => {
        register({ name: 'categories_id' })
    }, [register]);

    useEffect(() => {
        if (!id) return;

        async function getGenre() {
            setLoading(true);
            try {
                const { data } = await genreHttp.get(id);
                reset(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' })
            } finally {
                setLoading(false);
            }
        }

        getGenre();
    }, [])

    useEffect(() => {
        async function getCategories() {
            setLoading(true);
            try {
                const { data } = await categoryHttp.list<{ data: Category[] }>();
                setCategories(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar('Não foi possível carregar as categorias', { variant: 'error' })
            } finally {
                setLoading(false);
            }
        }

        getCategories();
    }, [])

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !id
                ? genreHttp.create(formData)
                : genreHttp.update(id, formData);

            const { data } = await http;

            snackbar.enqueueSnackbar('Gênero salvo com sucesso.', { variant: 'success' });

            setTimeout(() => {
                event
                    ? (id
                        ? history.replace(`/genres/${data.data.id}/edit`)
                        : history.push(`/genres/${data.data.id}/edit`))
                    : history.push('/genres');
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar('Não foi possível salvar o gênero.', { variant: 'error' });
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

            <TextField
                disabled={loading}
                select
                name="categories_id"
                value={watch('categories_id')}
                label="Categorias"
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                    setValue('categories_id', [e.target.value], true);
                }}
                SelectProps={{ multiple: true }}
                error={errors.categories_id !== undefined}
                helperText={errors.categories_id && errors.categories_id.message}
                InputLabelProps={{ shrink: true }}
            >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                {
                    categories.map(
                        (category, key) => (
                            <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                        )
                    )
                }
            </TextField>

            <Box dir={"rtl"}>
                <Button {...buttonProps} color='primary' onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    )
}