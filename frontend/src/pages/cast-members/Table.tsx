/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import * as yup from "../../util/vendor/yup";
import { useState, useCallback, useRef } from 'react';
import { useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { CastMember, CastMemberTypeMap, ListResponse } from '../../util/models';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { invert } from "lodash";
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import castMemberHttp from '../../util/http/cast-member-http';
import DefaultTable, { makeActionStyles, TableColumn, MuiDataTableRefComponent } from '../../components/Table';
import EditIcon from '@material-ui/icons/Edit';
import useFilter from "../../hooks/useFilter";


const castMemberNames = Object.values(CastMemberTypeMap);

const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'id',
        options: {
            filter: false,
            display: false
        },
        width: '0%'
    },
    {
        name: 'name',
        label: 'Nome',
        width: '50%',
        options: {
            filter: false,
        },
    },
    {
        name: 'type',
        label: 'Tipo',
        options: {
            filterOptions: {
                names: castMemberNames,
            },
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
            filter: false,
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
            filter: false,
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

const debounceTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const extraFilter = {
    createValidationSchema: () => {
        return yup.object().shape({
            type: yup
                .string()
                .nullable()
                .transform((value) => {
                    return !value || !castMemberNames.includes(value)
                        ? undefined
                        : value;
                })
                .default(null),
        });
    },
    formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter
            ? {
                ...(debouncedState.extraFilter.type && {
                    type: debouncedState.extraFilter.type,
                }),
            }
            : undefined;
    },
    getStateFromURL: (queryParams) => {
        return {
            type: queryParams.get("type"),
        };
    },
}

const Table = () => {

    const { enqueueSnackbar } = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<CastMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;

    const {
        columns,
        filterManager,
        cleanSearchText,
        filterState,
        debouncedFilterState,
        totalRecords,
        setTotalRecords,
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: debounceTime,
        rowsPerPage,
        rowsPerPageOptions,
        tableRef,
        extraFilter,
    });

    const searchText = cleanSearchText(debouncedFilterState.search);
    const indexColumnType = columns.findIndex((c) => c.name === "type");
    const columnType = columns[indexColumnType];
    const typeFilterValue = filterState.extraFilter && (filterState.extraFilter.type as never);
    (columnType.options as any).filterList = typeFilterValue ? [typeFilterValue] : [];

    const serverSideFilterList = columns.map((column) => []);
    if (typeFilterValue) {
        serverSideFilterList[indexColumnType] = [typeFilterValue];
    }

    const getData = useCallback(
        async ({ search, page, per_page, sort, dir, type }) => {
            setLoading(true);
            try {
                const { data } = await castMemberHttp.list<ListResponse<CastMember>>({
                    queryParams: {
                        search,
                        page,
                        per_page,
                        sort,
                        dir,
                        ...(type && {
                            type: invert(CastMemberTypeMap)[type],
                        }),
                    },
                });
                if (subscribed.current) {
                    setData(data.data);
                    setTotalRecords(data.meta.total);
                }
            } catch (error) {
                console.error(error);
                if (castMemberHttp.isCancelledRequest(error)) {
                    return;
                }
                enqueueSnackbar("Não foi possível carregar as informações", {
                    variant: "error",
                });
            } finally {
                setLoading(false);
            }
        },
        [enqueueSnackbar, setTotalRecords]
    );

    useEffect(() => {
        subscribed.current = true;
        getData({
            search: searchText,
            page: debouncedFilterState.pagination.page,
            per_page: debouncedFilterState.pagination.per_page,
            sort: debouncedFilterState.order.sort,
            dir: debouncedFilterState.order.dir,
            ...(debouncedFilterState.extraFilter &&
                debouncedFilterState.extraFilter.type && {
                type: debouncedFilterState.extraFilter.type,
            }),
        });
        return () => {
            subscribed.current = false;
        };
    }, [
        getData,
        searchText,
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        debouncedFilterState.extraFilter,
    ]);

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length - 1)}>
            <DefaultTable
                title=""
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={debouncedSearchTime}
                ref={tableRef}
                options={{
                    //serverSideFilterList,
                    serverSide: true,
                    responsive: "standard",
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    rowsPerPageOptions,
                    count: totalRecords,
                    onFilterChange: (column, filterList, type) => {
                        const columnIndex = columns.findIndex((c) => c.name === column);
                        filterManager.changeExtraFilter({
                            [column as string]: filterList[columnIndex].length ? filterList[columnIndex][0] : 'null',
                        });
                    },
                    customToolbar: () => (
                        <FilterResetButton
                            handleClick={() => filterManager.resetFilter()}
                        />
                    ),
                    onSearchChange: (value) => filterManager.changeSearch(value),
                    onChangePage: (page) => filterManager.changePage(page),
                    onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                    onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeColumnSort(changedColumn, direction),
                }}
            />
        </MuiThemeProvider>
    )
};

export default Table;