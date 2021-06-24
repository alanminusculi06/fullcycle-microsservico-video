/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, Genre, ListResponse } from '../../util/models';
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MyTable, { makeActionStyles, TableColumn } from '../../components/Table';
import EditIcon from '@material-ui/icons/Edit';
import genreHttp from '../../util/http/genre-http';


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
        width: '40%'
    },
    {
        name: 'categories',
        label: 'Categorias',
        options: {
            customBodyRender(value: Category[], tableMeta, updateValue) {
                return value.map(item => {
                    return item.name;
                }).join(", ");
            }
        },
        width: '40%'
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
                        to={`/genres/${tableMeta.rowData[0]}/edit`}>
                        <EditIcon fontSize={'inherit'} />
                    </IconButton>
                );
            }
        }
    }
]

const Table = () => {

    const snackbar = useSnackbar();
    const [data, setData] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const { data } = await genreHttp.list<ListResponse<Genre>>();
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
                title="Listagem de gêneros"
                columns={columnsDefinition}
                data={data}
                loading={loading}
            />
        </MuiThemeProvider >
    )
};

export default Table;