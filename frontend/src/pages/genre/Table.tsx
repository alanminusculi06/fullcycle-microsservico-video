import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chip } from '@material-ui/core';
import { parseISO, format } from 'date-fns';
import httpVideo from '../../util/http';

interface Category {
    name: string
}

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'is_active',
        label: 'Ativo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <Chip label="Sim" color="primary" /> : <Chip label="Não" color="secondary" />;
            }
        }
    },
    {
        name: 'name',
        label: 'Nome',
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy HH:mm')}</span>;
            }
        }
    },
    {
        name: 'categories',
        label: 'Categorias',
        options: {
            customBodyRender(value: Category[], tableMeta, updateValue) {
                return value.map(item=> {
                    return item.name;
                }).join(", ");
            }
        }
    },
]

const Table = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        httpVideo.get('genres').then(
            response => setData(response.data.data)
        )
    }, [])

    return (
        <MUIDataTable
            title="Listagem de gêneros"
            columns={columnsDefinition}
            data={data}
        >

        </MUIDataTable>
    )
};

export default Table;