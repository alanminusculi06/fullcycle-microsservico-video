import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import genreHttp from '../../util/http/genre-http';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, Genre, ListResponse } from '../../util/models';

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
        let isSubscribed = true;
        (async () => {
            const { data } = await genreHttp.list<ListResponse<Genre>>();
            if (isSubscribed)
                setData(data.data);
        })();

        return () => {
            isSubscribed = false;
        }
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