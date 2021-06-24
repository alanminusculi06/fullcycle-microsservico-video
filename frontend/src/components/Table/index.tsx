import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps } from 'mui-datatables';
import _, { merge, omit, cloneDeep } from 'lodash';
import { MuiThemeProvider, useMediaQuery, useTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core';

const defaultOptions: MUIDataTableOptions = {
    print: false,
    download: false,
    textLabels: {
        body: {
            noMatch: "Nenhum registro encontrado",
            toolTip: "Classificar",
        },
        pagination: {
            next: "Próxima página",
            previous: "Página anterior",
            rowsPerPage: "Por página:",
            displayRows: "de",
        },
        toolbar: {
            search: "Busca",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Ver colunas",
            filterTable: "Filtrar tabelas",
        },
        filter: {
            all: "Todos",
            title: "FILTROS",
            reset: "LIMPAR",
        },
        viewColumns: {
            title: "Ver colunas",
            titleAria: "Ver/Esconder colunas da tabela",
        },
        selectedRows: {
            text: "registro(s) selecionado(s)",
            delete: "Excluir",
            deleteAria: "Excluir registros selecionados"
        }
    }
}

export interface TableColumn extends MUIDataTableColumn {
    width?: string
}

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    loading?: boolean;
}

const MyTable: React.FC<TableProps> = (props) => {

    function extractMuiDataTableColumns(columns: TableColumn[]) {
        setColumnsWidth(columns);
        return columns.map(column => omit(column, 'width'));
    }

    function setColumnsWidth(columns: TableColumn[]) {
        columns.forEach((column, key) => {
            if (column.width) {
                const overrides = theme.overrides as any;
                overrides.MUIDataTableHeadCell.fixedHeader[`&:nth-child(${key + 1})`] = {
                    width: column.width
                }
            }
        })
    }

    function applyLoading() {
        const textLabels = (newProps.options as any).textLabels;
        textLabels.body.noMatch = newProps.loading === true
            ? "Carregando..."
            : textLabels.body.noMatch;
    }

    function applyResponsive() {
        newProps.options.responsive = isSmOrDown === true ? 'standard' : 'simple';
    }

    function getOriginalMuiDataTableProps() {
        return _.omit(newProps, 'isLoading');
    }

    const theme = cloneDeep<Theme>(useTheme());
    const isSmOrDown = useMediaQuery(theme.breakpoints.down('sm'));

    const newProps = merge(
        { options: cloneDeep(defaultOptions) },
        props,
        { columns: extractMuiDataTableColumns(props.columns) }
    );

    applyLoading();
    applyResponsive();
    const originalProps = getOriginalMuiDataTableProps();

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable {...originalProps} />
        </MuiThemeProvider>
    );
};

export default MyTable;

export function makeActionStyles(column) {
    return theme => {
        const copyTheme = cloneDeep(theme);
        const selector = `&[data-testid^="MuiDataTableBodyCell-${column}"]`;
        (copyTheme.overrides as any).MUIDataTableBodyCell.root[selector] = {
            paddingTop: '0px',
            paddingBottom: '0px'
        };
        return copyTheme;
    }
}