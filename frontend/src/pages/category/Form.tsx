/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as yup from '../../../src/util/vendor/yup';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import categoryHttp from '../../util/http/category-http';
import useForm from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';

const validationSchema = yup.object().shape({
    name: yup.string().label("Nome").required().max(255),
})

export const Form = () => {

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        setValue,
        triggerValidation,
        errors,
    } = useForm({
        validationSchema
    });

    const history = useHistory();
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(false);
    const [ativo, setAtivo] = useState<boolean>(true);

    useEffect(() => {
        let isSubscribed = true;

        (async () => {
            if (!id) return;
            setLoading(true);
            try {
                const { data } = await categoryHttp.get(id);
                if (isSubscribed) reset(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' })
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            isSubscribed = false;
        }
    }, [])

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !id
                ? categoryHttp.create(formData)
                : categoryHttp.update(id, formData);

            const { data } = await http;

            snackbar.enqueueSnackbar('Categoria salva com sucesso.', { variant: 'success' });

            setTimeout(() => {
                event
                    ? (id
                        ? history.replace(`/categories/${data.data.id}/edit`)
                        : history.push(`/categories/${data.data.id}/edit`))
                    : history.push('/categories');
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar('Não foi possível salvar a categoria.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }

    function onAtivoChanged(event) {
        console.log(event);
        setAtivo(event.target.checked);
        setValue('is_active', ativo);
        console.log(ativo);
    }

    return (
        <DefaultForm GridItemProps={{ xs: 12, md: 6 }} onSubmit={handleSubmit(onSubmit)}>
            <FormControlLabel
                disabled={loading}
                control={
                    <Checkbox
                        color='primary'
                        name="is_active"
                        ref={register}
                        checked={ativo}
                        onChange={onAtivoChanged} />}
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