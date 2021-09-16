/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as yup from '../../../src/util/vendor/yup';
import { MenuItem, TextField } from '@material-ui/core';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import genreHttp from '../../util/http/genre-http';
import categoryHttp from '../../util/http/category-http';
import { Category } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';

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
        triggerValidation,
        errors
    } = useForm({
        validationSchema,
        defaultValues: {
            categories_id: [''],
            name: undefined
        }
    });

    const history = useHistory();
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        register({ name: 'categories_id' })
    }, [register]);

    useEffect(() => {
        let isSubscribed = true;

        (async () => {
            setLoading(true);

            const promises = [categoryHttp.list({ queryParams: { all: '' } })];

            if (id) promises.push(genreHttp.get(id))

            try {
                const [categoriesResponse, genreResponse] = await Promise.all(promises);
                if (isSubscribed) {
                    setCategories(categoriesResponse.data.data);
                    if (id) {
                        reset({
                            ...genreResponse.data.data,
                            categories_id: genreResponse.data.data.categories.map(category => category.id)
                        });
                    }
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar('Não foi possível carregar as informações.', { variant: 'error' })
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            isSubscribed = false;
        }
    }, []);


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
            console.error(error);
            snackbar.enqueueSnackbar('Não foi possível salvar o gênero.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultForm GridItemProps={{ xs: 12, md: 6 }} onSubmit={handleSubmit(onSubmit)}>
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
                select
                fullWidth
                disabled={loading}
                name="categories_id"
                label="Categorias"
                margin="normal"
                variant="outlined"
                value={watch('categories_id')}
                error={errors.categories_id !== undefined}
                //helperText={errors.categories_id && errors.categories_id.message}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                    setValue('categories_id', [e.target.value], true);
                }}>
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

            <SubmitActions
                disableButtons={loading}
                handleSave={
                    () =>
                        triggerValidation()
                            .then(isValid => {
                                isValid && onSubmit(getValues(), null)
                            })
                }
            />
        </DefaultForm>
    )
}