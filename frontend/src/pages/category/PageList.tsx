import * as React from 'react';
import { Box, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Table from './Table';
import { Page } from '../../components/Page';

const PageList = () => {
    return (
        <Page title="Categorias">
            <Box dir={'rtl'} paddingBottom={2}>
                <Fab
                    color="secondary"
                    title="Adicionar categoria"
                    size="small"
                    component={Link}
                    to={"categories/new"}
                >
                    <AddIcon />
                </Fab>
            </Box>
            <Box>
                <Table></Table>
            </Box>
        </Page>
    )
};

export default PageList;