import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import * as functions from '../common/functions';
import Header from '../components/Header';
import LoadingModal from '../components/LoadingModal';
import Title from '../components/Title';
import Copyright from '../components/Copyright';
import DetailToolbar from './DetailToolbar';
import ValidationMessage from './ValidationMessage';
import { useInterval } from '../common/useInterval';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { deepOrange } from '@mui/material/colors';
import Divider from '@mui/material/Divider';

export default function MuscleDetail(props) {
  const { isCreate } = props;

  const [open, setOpen] = useState(false);
  const [trainingNm, setTrainingNm] = useState('');
  const [trainingTime, setTrainingTime] = useState('');
  const [trainingDateBegin, setTrainingDateBegin] = useState('');
  const [trainingDateEnd, setTrainingDateEnd] = useState('');
  const [dtlRows, setDtlRows] = useState([]);
  const [message, setMessage] = useState({
    trainingNm: '',
    trainingDateBegin: '',
    trainingDateEnd: '',
    repQty0: '',
  });

  // メッセージ更新
  const setValidateMessage = (key, value) => {
    setMessage({
      ...message,
      [key]: validation.formValidate(key, value),
    });
  };

  // 検証チェック
  const validation = (() => {
    const trainingNmValidation = (trainingNm) => {
      if (!trainingNm) return 'トレーニング名を入力してください';

      return '';
    };

    const trainingDateBeginValidation = (trainingDateBegin) => {
      if (!trainingDateBegin) return 'トレーニング開始日を入力してください';

      return '';
    };

    const trainingDateEndValidation = (trainingDateEnd) => {
      if (!trainingDateEnd) return 'トレーニング終了日を入力してください';

      return '';
    };

    const repQtyValidation = (repQty) => {
      if (!repQty) return 'REP数を入力してください';

      return '';
    };

    function formValidate(type, value) {
      switch (type) {
        case 'trainingNm':
          return trainingNmValidation(value);
        case 'trainingDateBegin':
          return trainingDateBeginValidation(value);
        case 'trainingDateEnd':
          return trainingDateEndValidation(value);
        default:
          // repQty0~X
          if (type.indexOf('repQty') === 0) {
            return repQtyValidation(value);
          }
      }
    }

    function allValidate() {
      let tmpMessage = {
        ...message,
        trainingNm: formValidate('trainingNm', trainingNm),
        trainingDateBegin: formValidate('trainingDateBegin', trainingDateBegin),
        trainingDateEnd: formValidate('trainingDateEnd', trainingDateEnd),
      };
      dtlRows.forEach((row, i) => {
        tmpMessage[`repQty${i}`] = formValidate(`repQty${i}`, row.REP_QTY);
      });
      setMessage(tmpMessage);

      const validMessage =
        Object.values(tmpMessage).filter((value) => {
          return Array.isArray(value) ? value.filter((x) => x !== '').length : value !== '';
        }).length === 0;

      return validMessage;
    }

    return { allValidate, formValidate };
  })();

  // URLパラメータ
  const urlParams = useParams();

  // 初回処理
  useEffect(() => {
    switch (isCreate) {
      // 新規
      case true:
        let rows = dtlRows.slice(0, 0);
        rows.push({
          REP_QTY: '',
          TRAINING_CONTENTS: '',
        });
        setDtlRows(rows);
        break;
      // 更新
      case false:
        // 読込モーダル表示
        //setOpen(true);

        try {
          // 詳細情報取得
          const postTrainingDtl = async () => {
            const params = new URLSearchParams();
            params.append('trainingNo', urlParams.no);
            let res = await axios.post('/training_dtl', params);
            setDtlRows(res.data.results);
            setTrainingNm(res.data.results[0].TRAINING_NM);
            setTrainingDateBegin(functions.toDateValue(res.data.results[0].TRAINING_START_TIME));
            setTrainingDateEnd(functions.toDateValue(res.data.results[0].TRAINING_END_TIME));
          };
          postTrainingDtl();

          // 読込モーダル非表示
          //setOpen(false);
        } catch (e) {
          console.log(e);
        }
        break;
      default:
        break;
    }
  }, []);

  // 定期処理（トレーニング時間）
  const handleTrainingTimeUpdate = () => {
    let begin = trainingDateBegin ? new Date(trainingDateBegin).getTime() : new Date().getTime();
    let end = trainingDateEnd ? new Date(trainingDateEnd).getTime() : new Date().getTime();
    let hour = String(Math.floor((end - begin) / 1000 / 60 / 60)).padStart(2, '0');
    let minute = String(Math.floor(((end - begin) / 1000 / 60) % 60)).padStart(2, '0');
    setTrainingTime(`${hour}:${minute}`);
  };
  useInterval({ onUpdate: handleTrainingTimeUpdate });

  // 更新処理
  const handleUpdateClick = async () => {
    // 検証チェック
    if (!validation.allValidate()) {
      return;
    }

    // 読込モーダル表示
    setOpen(true);

    // パラメータ
    const params = new URLSearchParams();
    params.append('trainingNo', urlParams.no);
    params.append('trainingNm', trainingNm);
    params.append('trainingDate', functions.toDateDB(trainingDateBegin, 'yyyyMMdd'));
    params.append('trainingDateBegin', functions.toDateDB(trainingDateBegin, 'yyyyMMddHHmmss'));
    params.append('trainingDateEnd', functions.toDateDB(trainingDateEnd, 'yyyyMMddHHmmss'));
    params.append('DTL', JSON.stringify(dtlRows));

    try {
      // 更新処理
      let res = await axios.post(isCreate ? '/insert' : '/update', params);
      if (res.data.results.result === 'OK') {
        switch (isCreate) {
          // 新規
          case true:
            // 画面読込
            window.location.replace(`/detail/${res.data.results.no}`);
            break;
          // 更新
          case false:
            // 読込モーダル非表示
            setTimeout(() => setOpen(false), 500);
            break;
          default:
            break;
        }
      } else {
        alert('サーバ エラー');
        setOpen(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // State値をセット
  const handleChangeState = (e, setState) => {
    setState(() => e.target.value);

    // メッセージ更新
    setValidateMessage(e.target.id, e.target.value);
  };

  // テンプレート押下処理
  const handleTemplateClick = (e) => {
    setTrainingNm('懸垂');
    setTrainingDateBegin('');
    setTrainingDateEnd('');

    let rows = dtlRows.slice();
    rows.splice(0);
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: 'ワイド' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: '順手' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: '逆手' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: 'ワイド' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: '順手' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: '逆手' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: 'ワイド' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: '順手' });
    rows.push({ REP_QTY: '', TRAINING_CONTENTS: '逆手' });
    setDtlRows(rows);
  };

  // ダブルクリック時処理（日付項目）
  const handleDateDoubleClick = (e, setState) => {
    let d = new Date();
    let year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let hour = d.getHours().toString().padStart(2, '0');
    let minute = d.getMinutes().toString().padStart(2, '0');
    let value = `${year}-${month}-${day}T${hour}:${minute}`;
    setState(value);

    // メッセージ更新
    setValidateMessage(e.target.id, value);
  };

  return (
    <>
      <CssBaseline />

      {/* ヘッダー */}
      <Header />

      {/* 上部ツールバー */}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <DetailToolbar
          handleTemplateClick={handleTemplateClick}
          handleUpdateClick={handleUpdateClick}
        />
        <Divider sx={{ mb: 1 }} />
      </Container>

      {/* メイン */}
      <Container component="main" maxWidth="xl">
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* トレーニングアイコン */}
          <Avatar sx={{ m: 1, bgcolor: deepOrange[500] }}>
            <FitnessCenterIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            トレーニング
          </Typography>

          {/* 入力フォーム */}
          <Box component="form" sx={{ mt: 3 }}>
            {/*
            <DetailForm
              {...{
                trainingNm,
                setTrainingNm,
                trainingDateBegin,
                setTrainingDateBegin,
                trainingDateEnd,
                setTrainingDateEnd,
                dtlRows,
                setDtlRows,
                trainingTime,
                setTrainingTime,
                message,
                setMessage,
                handleChangeState,
                handleDateDoubleClick,
                ValidationMessage,
                setValidateMessage,
              }}
            />
            */}
            <Grid container spacing={2}>
              {/* トレーニング名 */}
              <Grid item xs={12}>
                <TextField
                  name="trainingNm"
                  required
                  fullWidth
                  id="trainingNm"
                  label="トレーニング名"
                  value={trainingNm}
                  onChange={(e) => handleChangeState(e, setTrainingNm)}
                />
                <ValidationMessage message={message.trainingNm} />
              </Grid>
              {/* トータルREP数 */}
              <Grid item xs={12} sm={2}>
                <TextField
                  name="totalRepQty"
                  fullWidth
                  disabled
                  id="totalRepQty"
                  label="トータルREP数"
                  value={dtlRows?.map((x) => x.REP_QTY).reduce((x, y) => Number(x) + Number(y), 0)}
                />
              </Grid>
              {/* トレーニング時間 */}
              <Grid item xs={12} sm={2}>
                <TextField
                  name="trainingTime"
                  fullWidth
                  disabled
                  id="trainingTime"
                  label="トレーニング時間"
                  value={trainingTime}
                />
              </Grid>
              {/* トレーニング開始日 */}
              <Grid item xs={12} sm={4}>
                <TextField
                  name="trainingDateBegin"
                  required
                  fullWidth
                  id="trainingDateBegin"
                  label="トレーニング開始日"
                  value={trainingDateBegin}
                  onChange={(e) => handleChangeState(e, setTrainingDateBegin)}
                  onDoubleClick={(e) => handleDateDoubleClick(e, setTrainingDateBegin)}
                  type="datetime-local"
                  // sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <ValidationMessage message={message.trainingDateBegin} />
              </Grid>
              {/* トレーニング終了日 */}
              <Grid item xs={12} sm={4}>
                <TextField
                  name="trainingDateEnd"
                  required
                  fullWidth
                  id="trainingDateEnd"
                  label="トレーニング終了日"
                  value={trainingDateEnd}
                  onChange={(e) => handleChangeState(e, setTrainingDateEnd)}
                  onDoubleClick={(e) => handleDateDoubleClick(e, setTrainingDateEnd)}
                  type="datetime-local"
                  // sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <ValidationMessage message={message.trainingDateEnd} />
              </Grid>

              {/* セット（明細） */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Title>セット</Title>

                  <Grid container spacing={2}>
                    {dtlRows.map((row, i) => {
                      return (
                        <Grid container item spacing={2} key={i}>
                          {/* REP数 */}
                          <Grid item xs={5}>
                            <TextField
                              type="number"
                              name={`repQty${i}`}
                              required
                              fullWidth
                              id={`repQty${i}`}
                              label="REP数"
                              value={row.REP_QTY}
                              onChange={(e) => {
                                // State値をセット
                                row.REP_QTY = e.target.value;
                                let rows = dtlRows.slice();
                                rows.splice(i, 1, row);
                                setDtlRows(rows);

                                // メッセージ更新
                                setValidateMessage(e.target.id, e.target.value);
                              }}
                            />
                            <ValidationMessage message={message[`repQty${i}`]} />
                          </Grid>
                          {/* トレーニングメモ */}
                          <Grid item xs={6}>
                            <TextField
                              name="trainingContents"
                              fullWidth
                              id="trainingContents"
                              label="トレーニングメモ"
                              value={row.TRAINING_CONTENTS}
                              onChange={(e) => {
                                // State値をセット
                                row.TRAINING_CONTENTS = e.target.value;
                                let rows = dtlRows.slice();
                                rows.splice(i, 1, row);
                                setDtlRows(rows);
                              }}
                            />
                          </Grid>
                          {/* 行削除ボタン */}
                          <Grid item xs={1}>
                            <IconButton
                              sx={{ ml: -1, mt: 1 }}
                              color="primary"
                              onClick={() => {
                                // 行削除
                                let rows = dtlRows.slice();
                                rows.splice(i, 1);
                                setDtlRows(rows);

                                // REP数のエラーメッセージを全て削除
                                let tmp = Object.assign(message);
                                for (let i = 0; i < dtlRows.length; i++) {
                                  delete tmp[`repQty${i}`];
                                }
                                setMessage(tmp);
                              }}
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* 行追加ボタン */}
                  <Grid container>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => {
                          let rows = dtlRows.slice();
                          rows.push({
                            REP_QTY: '',
                            TRAINING_CONTENTS: '',
                          });
                          setDtlRows(rows);
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            {/* <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid> */}
          </Box>
        </Box>

        <Copyright sx={{ mt: 5 }} />
      </Container>

      {/* 読込モーダル */}
      <LoadingModal open={open} />
    </>
  );
}
