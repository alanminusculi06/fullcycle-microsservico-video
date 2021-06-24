/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { CastMember, ListResponse } from '../../util/models';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import castMemberHttp from '../../util/http/cast-member-http';
import MyTable, { makeActionStyles, TableColumn } from '../../components/Table';
import EditIcon from '@material-ui/icons/Edit';


const CastMemberTypeMap: { [key: number]: string } = {
    1: "Ator",
    2: "Diretor",
}

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
        name: 'name',
        label: 'Nome',
        width: '50%'
    },
    {
        name: 'type',
        label: 'Tipo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{CastMemberTypeMap[value]}</span>;
            }
        },
        width: '30%'
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
                        to={`/cast-members/${tableMeta.rowData[0]}/edit`}>
                        <EditIcon fontSize={'inherit'} />
                    </IconButton>
                );
            }
        }
    }
]

const Table = () => {

    const snackbar = useSnackbar();
    const [data, setData] = useState<CastMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const { data } = await castMemberHttp.list<ListResponse<CastMember>>();
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
                title="Listagem de pessoas"
                columns={columnsDefinition}
                data={data}
                loading={loading}
            />
        </MuiThemeProvider>
    )
};

export default Table;