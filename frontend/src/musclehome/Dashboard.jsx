import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Chart from './Chart';
import BestRecord from './BestRecord';
import TrainingTable from './TrainingTable';
import Copyright from '../components/Copyright';

export default function Dashboard(props) {
  const { rows, graphData, setShowDetail, setSelectNo } = props;

  const toMMdd = (date) => `${date.slice(4, 6)}/${date.slice(6, 8)}`;

  // グラフ（レップ数）
  let graphDataDisp = graphData.map((data) => {
    return {
      XAXIS_DATA: `${data.TRAINING_NM}(${toMMdd(data.TRAINING_DATE)})`,
      LINE_DATA: data.TOTAL_REP_QTY,
    };
  });

  // 最高レップ数
  let maxRepQtyData = null;
  if (graphData.length > 0) {
    maxRepQtyData = graphData?.reduce((x, y) =>
      Number(x.TOTAL_REP_QTY) > Number(y.TOTAL_REP_QTY) ? x : y
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <CssBaseline /> */}
      <Box component="main" sx={{ width: '100%' }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* グラフ（レップ数） */}
            <Grid item xs={12} md={12} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <Chart data={graphDataDisp} />
              </Paper>
            </Grid>
            {/* 最高レップ数 */}
            <Grid item xs={12} md={12} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <BestRecord data={maxRepQtyData} />
              </Paper>
            </Grid>
            {/* トレーニング一覧 */}
            <Grid item xs={12}>
              <TrainingTable rows={rows} setShowDetail={setShowDetail} setSelectNo={setSelectNo} />
            </Grid>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}
