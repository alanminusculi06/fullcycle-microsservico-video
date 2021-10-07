/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as yup from '../../../src/util/vendor/yup';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useContext } from 'react';
import { useForm } from "react-hook-form";
import castMemberHttp from '../../util/http/cast-member-http';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DefaultForm';
import useSnackbarFormError from '../../hooks/useSnackbarFormError';
import LoadingContext from '../../components/Loading/LoadingContext';

const validationSchema = yup.object().shape({
    name: yup.string().label('Nome').required().max(255),
    type: yup.number().label('Tipo').required()
})

export const Form = () => {

    const {
        formState,
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
        triggerValidation
    } = useForm<{name, type}>({
        validationSchema,
    });

    useSnackbarFormError(formState.submitCount, errors);

    const history = useHistory();
    const snackbar = useSnackbar();
    const { id } = useParams<{ id: string }>();
    const loading = useContext(LoadingContext);

    useEffect(() => {
        register({ name: "type" })
    }, [register]);

    useEffect(() => {
        let isSubscribed = true;

        (async () => {
            if (!id) return;
            try {
                const { data } = await castMemberHttp.get(id);
                if (isSubscribed) reset(data.data);
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' })
            }
        })();

        return () => {
            isSubscribed = false;
        }
    }, [])

    async function onSubmit(formData, event) {
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