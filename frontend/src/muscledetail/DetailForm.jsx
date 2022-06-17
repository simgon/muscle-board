import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Title from '../components/Title';

export default function DetailToolbar(props) {
  const {
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
  } = props;

  return (
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
  );
}
