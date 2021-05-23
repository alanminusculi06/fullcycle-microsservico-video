import * as React from 'react';
import { Box, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import AddIcon from '@material-ui/icons/Add';
import Table from './Table';

const PageList = () => {
    return (
        <Page title="Gêneros">
            <Box dir={'rtl'}>
                <Fab
                    title="Adicionar gênero"
                    size="small"
                    component={Link}
                    to={"genres/new"}
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