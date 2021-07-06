/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useRef, useState } from 'react';
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

interface Pagination {
    page: number;
    total: number;
    perPage: number;
}

interface Order {
    sort: string | null;
    dir: string | null;
}

interface SearchState {
    search: string;
    pagination: Pagination;
    order: Order;
}

const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchState, setSearchState] = useState<SearchState>({
        search: '',
        pagination: {
            page: 1,
            total: 0,
            perPage: 15
        },
        order: {
            sort: null,
            dir: null
        }
    });

    const columns = columnsDefinition.map(column => {
        if (column.name === searchState.order.sort) {
            let options = column.options as any;
            if (options != null) {
                options.sortDirection = searchState.order.dir
            }
        }
        return column;
    })

    useEffect(() => {
        subscribed.current = true;
        getData();
        return () => {
            subscribed.current = false;
        }
    }, [
        searchState.search,
        searchState.pagination.page,
        searchState.pagination.perPage,
        searchState.order
    ]);

    async function getData() {
        setLoading(true);
        try {
            const { data } = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: searchState.search,
                    page: searchState.pagination.page,
                    per_page: searchState.pagination.perPage,
                    sort: searchState.order.sort,
                    dir: searchState.order.dir
                }
            });
            if (subscribed.current) {
                setData(data.data);
                setSearchState((prevState => ({
                    ...prevState,
                    pagination: {
                        ...prevState.pagination,
                        total: data.meta.total
                    }
                })));
            }
        } catch (error) {
            console.log(error);
            if (!categoryHttp.isCancelledRequest(error)) {
                snackbar.enqueueSnackbar('Não foi possível carregar as informações', { variant: 'error' })
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <MyTable
                title="Listagem de categorias"
                columns={columns}
                data={data}
                loading={loading}
                options={{
                    serverSide: true,
                    responsive: 'standard',
                    searchText: searchState.search,
                    page: searchState.pagination.page - 1,
                    rowsPerPage: searchState.pagination.perPage,
                    count: searchState.pagination.total,
                    onSearchChange: (value) => setSearchState((prevState => ({
                        ...prevState,
                        search: value as string
                    }))),
                    onChangePage: (page) => setSearchState((prevState => ({
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            page: page + 1
                        }
                    }))),
                    onChangeRowsPerPage: (perPage) => setSearchState((prevState => ({
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            perPage: perPage
                        }
                    }))),
                    onColumnSortChange: (changedColumn, direction) => setSearchState((prevState => ({
                        ...prevState,
                        order: {
                            sort: changedColumn,
                            dir: direction.includes('desc') ? 'desc' : 'asc'
                        }
                    }))),
                }}
            />
        </MuiThemeProvider>
    )
};

export default Table;