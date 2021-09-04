import { createMuiTheme } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { PaletteOptions, SimplePaletteColorOptions } from "@material-ui/core/styles/createPalette";

const palette: PaletteOptions = {
    primary: {
        main: '#79aec8',
        contrastText: '#fff'
    },
    secondary: {
        main: '#4db5ab',
        dark: '#055a52',
        contrastText: '#fff'
    },
    background: {
        default: '#fafafa'
    },
    error: {
        main: red.A400
    },
    success: {
        main: green[500]
    }
};

const theme = createMuiTheme({
    palette: palette,
    overrides: {
        MUIDataTable: {
            paper: {
                boxShadow: 'none'
            }
        },
        MUIDataTableToolbar: {
            root: {
                minHeight: '58px',
                backgroundColor: palette?.background?.default
            },
            icon: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
                '&:hover, &:active, &:focus': {
                    color: (palette!.secondary as SimplePaletteColorOptions).dark
                },
            },
            iconActive: {
                '&:hover, &:active, &:focus': {
                    color: (palette!.secondary as SimplePaletteColorOptions).dark
                },
            },
        },
        MUIDataTableHeadCell: {
            fixedHeader: {
                paddingTop: 7,
                paddingBottom: 7,
                color: '#fff !important',
                backgroundColor: (palette!.primary as SimplePaletteColorOptions).main,
                '&[aria-sort]': {
                    backgroundColor: '#459ac4',
                },
            },
            sortActive: {
                color: '#fff',
            },
            sortAction: {
                alignItems: 'center'
            },
            sortLabelRoot: {
                '& svg': {
                    color: '#fff !important',
                }
            }
        },
        MUIDataTableSelectCell: {
            headerCell: {
                backgroundColor: (palette!.primary as SimplePaletteColorOptions).main,
                '& span': {
                    color: '#fff !important',
                }
            }
        },
        MUIDataTableBodyCell: {
            root: {
                color: (palette!.secondary as SimplePaletteColorOptions).main,
                '&:hover, &:active, &:focus': {
                    color: (palette!.secondary as SimplePaletteColorOptions).main,
                }
            }
        },
        MUIDataTableToolbarSelect: {
            title: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
            },
            iconButton: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
            },
        },
        MUIDataTableBodyRow: {
            root: {
                '&:nth-child(odd)': {
                    backgroundColor: palette!.background!.default
                }
            }
        },
        MUIDataTablePagination: {
            root: {
                color: (palette!.primary as SimplePaletteColorOptions).main,
            }
        },
        MUIDataTableFilterList: {
            root: {
                marginBottom: '16px'
            }
        }
    }
});

export default theme;