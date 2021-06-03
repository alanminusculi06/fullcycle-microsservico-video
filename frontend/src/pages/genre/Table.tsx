import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chip } from '@material-ui/core';
import { parseISO, format } from 'date-fns';
import genreHttp from '../../util/http/genre-http';
import { BadgeNo, BadgeYes } from '../../components/Badege';

interface Category {
    name: string
}

interface Genre {
    id: string;
    is_active: boolean;
    name: string;
    categories: Category[]
}

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'is_active',
        label: 'Ativo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo />;
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
                return value.map(item => {
                    return item.name;
                }).join(", ");
            }
        }
    },
]

const Table = () => {

    const [data, setData] = useState<Genre[]>([]);

    useEffect(() => {
        genreHttp.list<{ data: Genre[] }>().then(({ data }) => setData(data.data));
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