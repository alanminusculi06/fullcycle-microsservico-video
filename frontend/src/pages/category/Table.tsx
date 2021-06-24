/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Link } from 'react-router-dom';
import { Category, ListResponse } from '../../util/models';
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import MyTable, { makeActionStyles, TableColumn } from '../../components/Table';
import EditIcon from '@material-ui/icons/Edit';
import categoryHttp from '../../util/http/category-http';


const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'id',
        options: {
            display: false
        },
        width: '0%'
    },
    {
        name: 'is_active',
        label: 'Ativo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo />;
            }
        },
        width: '0%'
    },
    {
        name: 'name',
        label: 'Nome',
        width: '80%'
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy HH:mm')}</span>;
            }
        },
        width: '20%'
    },
    {
        name: "actions",
        label: "Ações",
        width: '13%',
        options: {
            sort: false,
            customBodyRender(value, tableMeta) {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/categories/${tableMeta.rowData[0]}/edit`}>
                        <EditIcon fontSize={'inherit'} />
                    </IconButton>
                );
            }
        }
    }
]

const Table = () => {

    const snackbar = useSnackbar();
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const { data } = await categoryHttp.list<ListResponse<Category>>();
                if (isSubscribed)
                    setData(data.data);
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

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <MyTable
                title="Listagem de categorias"
                columns={columnsDefinition}
                data={data}
                loading={loading}
            />
        </MuiThemeProvider>
    )
};

export default Table;