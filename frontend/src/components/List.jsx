import React from 'react'
import { makeStyles } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';

import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';

export default function List(props) {

    // const useStyles = makeStyles({
    //     table: {
    //         minWidth: 650,
    //     },
    // });
    // const classes = useStyles();

    let rows = [];
    props.searchResult.forEach((result, i) => {
        rows.push(
            <TableRow key={i}>
                <TableCell component="th" scope="row">
                    {result.TRAINING_NO}
                </TableCell>
                <TableCell align="right">{result.TRAINING_NM}</TableCell>
                <TableCell align="right">{result.TRAINING_DATE}</TableCell>
                <TableCell align="right">{result.TRAINING_TIME}</TableCell>
                <TableCell align="right">{result.TOTAL_REP_QTY}</TableCell>
                <TableCell align="center">
                    <Link href="/"><EditIcon /></Link>
                </TableCell>
            </TableRow>
        );
    });
    const tableBody = props.displayFlag ? <TableBody>{rows}</TableBody> : null;

    return (
        <Container component="main" maxWidth="xl">
            <CssBaseline />
            <TableContainer component={Paper}>
                <Table style={{minWidth: "650px"}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">トレーニング№</TableCell>
                            <TableCell align="right">トレーニング名</TableCell>
                            <TableCell align="right">トレーニング日</TableCell>
                            <TableCell align="right">トレーニング時間</TableCell>
                            <TableCell align="right">トータルREP数</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    {tableBody}
                </Table>
            </TableContainer>
        </Container>
    );
}
