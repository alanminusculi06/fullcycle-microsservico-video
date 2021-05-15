import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chip } from '@material-ui/core';
import { parseISO, format } from 'date-fns';
import httpVideo from '../../util/http';


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
]

const Table = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        httpVideo.get('categories').then(
            response => setData(response.data.data)
        )
    }, [])

    return (
        <MUIDataTable
            title="Listagem de categorias"
            columns={columnsDefinition}
            data={data}
        >

        </MUIDataTable>
    )
};

export default Table;