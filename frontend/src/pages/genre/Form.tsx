import * as React from 'react';
import { Box, Button, ButtonProps, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import { useEffect } from 'react';
import useForm from 'react-hook-form';
import genreHttp from '../../util/http/genre-http';
import categoryHttp from '../../util/http/category-http';
import { useState } from 'react';

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

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        variant: 'contained',
    };

    const [categories, setCategories] = useState<any[]>([]);
    const { register, handleSubmit, getValues, setValue, watch } = useForm({
        defaultValues: {
            categories_id: ['']
        }
    });

    useEffect(() => {
        register({ name: 'categories_id' })
    }, [register]);

    useEffect(() => {
        categoryHttp.list<{ data: Category[] }>().then(({ data }) => setCategories(data.data));
    }, [])

    function onSubmit(formData, event) {
        genreHttp.create(formData).then((response) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register}
            />

            <TextField
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
            >
                <MenuItem value="">
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