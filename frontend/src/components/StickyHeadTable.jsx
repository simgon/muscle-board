import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';

import IconButton from '@mui/material/IconButton';
const columns = [
  // {
  //   id: 'TRAINING_NO',
  //   label: 'トレーニング№',
  //   minWidth: 170,
  //   align: 'left',
  // },
  {
    id: 'TRAINING_NM',
    label: 'トレーニング名',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'TRAINING_DATE',
    label: 'トレーニング日',
    minWidth: 100,
    align: 'right',
    format: (value) => `${value.slice(0,4)}/${value.slice(4,6)}/${value.slice(6,8)}`,
  },
  {
    id: 'TRAINING_TIME',
    label: 'トレーニング時間',
    minWidth: 100,
    align: 'right',
    //format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'TOTAL_REP_QTY',
    label: 'トータルREP数',
    minWidth: 100,
    align: 'right',
    //format: (value) => value.toFixed(2),
  },
  {
    id: 'EDIT',
    label: '',
    minWidth: 100,
    align: 'center',
    format: (value, row) => <Link href={"/detail/" + row.TRAINING_NO} target="_blank"><EditIcon /></Link>,
  },
];

// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }

// const rows = [
//   createData('India', 'IN', 1324171354, 3287263),
//   createData('China', 'CN', 1403500365, 9596961),
//   createData('Italy', 'IT', 60483973, 301340),
//   createData('United States', 'US', 327167434, 9833520),
//   createData('Canada', 'CA', 37602103, 9984670),
//   createData('Australia', 'AU', 25475400, 7692024),
//   createData('Germany', 'DE', 83019200, 357578),
//   createData('Ireland', 'IE', 4857000, 70273),
//   createData('Mexico', 'MX', 126577691, 1972550),
//   createData('Japan', 'JP', 126317000, 377973),
//   createData('France', 'FR', 67022000, 640679),
//   createData('United Kingdom', 'GB', 67545757, 242495),
//   createData('Russia', 'RU', 146793744, 17098246),
//   createData('Nigeria', 'NG', 200962417, 923768),
//   createData('Brazil', 'BR', 210147125, 8515767),
// ];

export default function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
    {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}> */}
      <TableContainer sx={{ maxHeight: 690 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.TRAINING_NO}>
                    {columns.map((column, i) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format /*&& typeof value === 'number'*/
                            ? column.format(value, row)
                            : value}
                        </TableCell>
                        
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    {/* </Paper> */}
    </>
  );
}
