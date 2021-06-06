import { setLocale } from 'yup';


setLocale({
    mixed: {
        required: '${path} é obrigatório.'
    },
    string: {
        max: '${path} pode ter no máximo ${max} caracteres.'
    },
    number: {
        min: '${path} precisa ter no mínimo ${min} caracteres.'
    }
});

export * from 'yup';