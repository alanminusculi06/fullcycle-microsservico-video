import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { useState } from 'react';
import { useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import castMemberHttp from '../../util/http/cast-member-http';

interface CastMember {
    id: string;
    is_active: boolean;
    name: string;
    type: number;
}

const CastMemberTypeMap: { [key: number]: string } = {
    1: "Ator",
    2: "Diretor",
}

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: 'name',
        label: 'Nome',
    },
    {
        name: 'type',
        label: 'Tipo',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{CastMemberTypeMap[value]}</span>;
            }
        }
    },
    {
        name: 'created_at',
        label: 'Criado em',
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy HH:mm')}</span>;
            }
        }
    }
]

const Table = () => {

    const [data, setData] = useState<CastMember[]>([]);

    useEffect(() => {
        castMemberHttp.list<{ data: CastMember[] }>().then(({ data }) => setData(data.data));
    }, [])

    return (
        <MUIDataTable
            title="Listagem de pessoas"
            columns={columnsDefinition}
            data={data}
        >

        </MUIDataTable>
    )
};

export default Table;