import React, { useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function SearchForm(props) {
  const { setTrainingData, setTrainingGraphData, setShowLoading, setShowDetail, setSelectNo } =
    props;

  const [trainingNm, setTrainingNm] = useState('');
  const [trainingDateFrom, setTrainingDateFrom] = useState('');
  const [trainingDateTo, setTrainingDateTo] = useState('');

  // State更新
  const handleStateChange = (e, setState) => {
    setState(() => e.target.value);
  };

  // 新規ボタン
  const handleNewClick = () => {
    // 新規タブで詳細画面を開く
    //window.open('/detail', '_blank');
    setShowDetail(true);
    setSelectNo(null);
  };

  // 検索ボタン
  const handleSearch = async () => {
    // 読込モーダル表示
    setShowLoading(true);

    // パラメータ
    const params = new URLSearchParams();
    params.append('trainingNm', trainingNm);
    params.append('trainingDateFrom', trainingDateFrom.replace(/-/g, ''));
    params.append('trainingDateTo', trainingDateTo.replace(/-/g, ''));

    try {
      // 一覧情報取得
      let resTraining = await axios.post('/training', params);
      setTrainingData(resTraining.data.results);

      // グラフ情報取得
      let resGraph = await axios.post('/graph', params);
      setTrainingGraphData(resGraph.data.results);

      // 読込モーダル非表示
      //setTimeout(() => setShowLoading(false), 500);
      setShowLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container component="main" maxWidth="xl">
      {/* <CssBaseline /> */}

      <Grid container spacing={1}>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            name="trainingNm"
            margin="normal"
            label="トレーニング名"
            value={trainingNm}
            onChange={(e) => handleStateChange(e, setTrainingNm)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            type="date"
            name="trainingDateFrom"
            margin="normal"
            label="トレーニング日(FROM)"
            value={trainingDateFrom}
            onChange={(e) => handleStateChange(e, setTrainingDateFrom)}
            variant="outlined"
            // defaultValue="2017-05-24"
            sx={{ width: '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            type="date"
            name="trainingDateTo"
            margin="normal"
            label="トレーニング日(To)"
            value={trainingDateTo}
            onChange={(e) => handleStateChange(e, setTrainingDateTo)}
            variant="outlined"
            // defaultValue="2017-05-24"
            sx={{ width: '100%' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <div style={{ flexGrow: 1 }}></div>
        <Box style={{ alignItems: 'end', display: 'flex' }}>
          <Button variant="contained" onClick={handleNewClick} sx={{ mb: 1, ml: 1, mr: 2 }}>
            新規
          </Button>
          <Button variant="outlined" onClick={handleSearch} sx={{ mb: 1 }}>
            検索
          </Button>
        </Box>
      </Grid>

      <Divider sx={{ mb: 1 }} />
    </Container>
  );
}
