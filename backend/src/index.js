const express = require('express');
const mysql = require('mysql2');
const mysqlPromise = require('./mysqlPromise');
const app = express();
const port = process.env.PORT || 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0209',
  database: 'sample'
});

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`listening on *:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

/**
 * 一覧情報取得
 */
app.post('/training', (req, res) => {
  // ------------------------------
  // 一覧情報取得
  // ------------------------------
  // SQL文
  let sql = '';
  sql += 'SELECT ';
  sql += '    TRG.TRAINING_NO AS TRAINING_NO ';
  sql += ',   TRG.TRAINING_NM AS TRAINING_NM ';
  sql += ',   TRG.TRAINING_DATE AS TRAINING_DATE ';
  sql += ',   TIME_FORMAT(TIMEDIFF(TRG.TRAINING_END_TIME, TRG.TRAINING_START_TIME), "%H:%i") AS TRAINING_TIME ';
  sql += ',   SUM(TDTL.REP_QTY) AS TOTAL_REP_QTY ';
  sql += 'FROM ';
  sql += '    TRN_TRAINING TRG ';
  sql += 'LEFT JOIN ';
  sql += '    TRN_TRAINING_DTL TDTL ';
  sql += 'ON ';
  sql += '    TRG.TRAINING_NO = TDTL.TRAINING_NO ';
  sql += 'WHERE ';
  sql += '    TRAINING_NM LIKE ? ';
  if (req.body.trainingDateFrom) {
    sql += 'AND ? <= TRAINING_DATE ';
  }
  if (req.body.trainingDateTo) {
    sql += 'AND TRAINING_DATE <= ? ';
  }
  sql += 'GROUP BY ';
  sql += '    TRG.TRAINING_NO ';
  sql += ',   TRG.TRAINING_NM ';
  sql += ',   TRG.TRAINING_DATE ';
  sql += ',   TIMEDIFF(TRG.TRAINING_START_TIME, TRG.TRAINING_END_TIME) ';
  sql += 'ORDER BY '
  sql += '    TRAINING_DATE DESC '
  //sql += ',   TRAINING_NM '
  sql += ',   TRAINING_NO DESC '

  // パラメータ
  let params = [];
  params.push(req.body.trainingNm + '%');
  if (req.body.trainingDateFrom) {
    params.push(req.body.trainingDateFrom);
  }
  if (req.body.trainingDateTo) {
    params.push(req.body.trainingDateTo);
  }
  
  // 実行
  connection.query(
    sql,
    params,
    function(err, results, fields) {
      if(err) {
        console.log('接続終了(異常)');
        throw err;
      }
      res.json({results: results});
    }
  );
});

/**
 * グラフ情報取得
 */
app.post('/graph', (req, res) => {
  // ------------------------------
  // グラフ情報取得
  // ------------------------------
  // SQL文
  let sql = '';
  sql += 'SELECT ';
  sql += '    TRG.TRAINING_NO   AS TRAINING_NO ';
  sql += ',   TRG.TRAINING_NM   AS TRAINING_NM ';
  sql += ',   TRG.TRAINING_DATE AS TRAINING_DATE ';
  sql += ',   SUM(TDTL.REP_QTY) AS TOTAL_REP_QTY ';
  sql += 'FROM ';
  sql += '    TRN_TRAINING TRG  ';
  sql += 'LEFT JOIN ';
  sql += '    TRN_TRAINING_DTL TDTL  ';
  sql += 'ON  TRG.TRAINING_NO = TDTL.TRAINING_NO ';
  sql += 'WHERE ';
  sql += '    TRAINING_NM LIKE ? ';
  if (req.body.trainingDateFrom) {
    sql += 'AND ? <= TRAINING_DATE ';
  }
  if (req.body.trainingDateTo) {
    sql += 'AND TRAINING_DATE <= ? ';
  }
  sql += 'GROUP BY ';
  sql += '    TRAINING_NM ';
  sql += ',   TRAINING_DATE ';
  sql += 'ORDER BY '
  sql += '    TRAINING_DATE '
  sql += ',   TRAINING_NM '
  
  // パラメータ
  let params = [];
  params.push(req.body.trainingNm + '%');
  if (req.body.trainingDateFrom) {
    params.push(req.body.trainingDateFrom);
  }
  if (req.body.trainingDateTo) {
    params.push(req.body.trainingDateTo);
  }

  // 実行
  connection.query(
    sql,
    params,
    function(err, results, fields) {
      if(err) {
        console.log('接続終了(異常)');
        throw err;
      }
      res.json({results: results});
    }
  );
});

/**
 * 詳細情報取得
 */
app.post('/training_dtl', (req, res) => {
  // ------------------------------
  // 詳細情報取得
  // ------------------------------
  // SQL文
  let sql = '';
  sql += 'SELECT ';
  sql += '    TRN.TRAINING_NO ';
  sql += ',   TRN.TRAINING_NM ';
  sql += ',   TRN.TRAINING_START_TIME ';
  sql += ',   TRN.TRAINING_END_TIME ';
  sql += ',   DTL.DTL_NO ';
  sql += ',   DTL.REP_QTY ';
  sql += ',   DTL.TRAINING_CONTENTS ';
  sql += 'FROM ';
  sql += '    TRN_TRAINING TRN ';
  sql += 'LEFT JOIN ';
  sql += '    TRN_TRAINING_DTL DTL ';
  sql += 'ON ';
  sql += '    TRN.TRAINING_NO = DTL.TRAINING_NO ';
  sql += 'WHERE ';
  sql += '    TRN.TRAINING_NO = ? ';

  // パラメータ
  let params = [];
  params.push(req.body.trainingNo);

  // 実行
  connection.query(
    sql,
    params,
    function(err, results, fields) {
      if(err) {
        console.log('接続終了(異常)');
        throw err;
      }
      res.json({results: results});
    }
  );
});

/**
 * 詳細情報　新規作成処理
 */
app.post('/insert', (req, res) => {
  (async () => {
    let result = "NG";
    // トレーニングNo（採番）
    let maxTrainingNo = null;

    try {
      // トランザクション開始
      await mysqlPromise.beginTransaction(connection);

      // ------------------------------
      // トレーニングNoを採番
      // ------------------------------
      // SQL文
      let sql = '';
      sql += 'SELECT ';
      sql += '    LPAD(MAX(TRAINING_NO) + 1, 10, "0") AS MAX_TRAINING_NO ';
      sql += 'FROM ';
      sql += '    TRN_TRAINING ';
      sql += '; ';

      // パラメータ
      let params = [];

      // 実行
      let results = await mysqlPromise.query(connection, sql, params);
      if (results.affectedRows === 0) {
        throw new Error('SQL Execute Error');
      }
      maxTrainingNo = results[0].MAX_TRAINING_NO;

      // ------------------------------
      // トレーニング作成
      // ------------------------------
      // SQL文
      sql = '';
      sql += 'INSERT INTO trn_training(  ';
      sql += '    TRAINING_NO ';
      sql += ',   TRAINING_NM ';
      sql += ',   TRAINING_DATE ';
      sql += ',   TRAINING_START_TIME ';
      sql += ',   TRAINING_END_TIME ';
      sql += ') VALUES (  ';
      sql += '    ? ';
      sql += ',   ? ';
      sql += ',   ? ';
      sql += ',   ? ';
      sql += ',   ? ';
      sql += '); ';
      
      // パラメータ
      params = [];
      params.push(maxTrainingNo);
      params.push(req.body.trainingNm);
      params.push(req.body.trainingDate);
      params.push(req.body.trainingDateBegin);
      params.push(req.body.trainingDateEnd);

      // 実行
      results = await mysqlPromise.query(connection, sql, params);
      if (results.affectedRows === 0) {
        throw new Error('SQL Execute Error');
      }

      // ------------------------------
      // トレーニング明細作成
      // ------------------------------
      // SQL文
      sql = '';
      sql += 'INSERT INTO TRN_TRAINING_DTL( ';
      sql += '    TRAINING_NO ';
      sql += ',   DTL_NO ';
      sql += ',   TRAINING_CONTENTS ';
      sql += ',   REP_QTY ';
      sql += ') VALUES ( ';
      sql += '    ? ';
      sql += ',   ? ';
      sql += ',   ? ';
      sql += ',   ? ';
      sql += '); ';

      let dtl = JSON.parse(req.body.DTL);
      for (let [i, d] of dtl.entries()) {
        // パラメータ
        params = [];
        params.push(maxTrainingNo);
        params.push(String(i + 1).padStart(3, '0'));
        params.push(d.TRAINING_CONTENTS);
        params.push(d.REP_QTY);

        // 実行
        results = await mysqlPromise.query(connection, sql, params);
        if (results.affectedRows === 0) {
          throw new Error('SQL Execute Error');
        }
      }

      // コミット
      await mysqlPromise.commit(connection);

      result = "OK";
    } catch (err) {
      // ロールバック
      await mysqlPromise.rollback(connection, err);
    } finally {
      res.json({results: { result: result, no: maxTrainingNo }});
      //connection.end();
    }
  })().catch((err) => {
    console.error(err);
  });
});

/**
 * 詳細情報　更新処理
 */
app.post('/update', (req, res) => {
  (async () => {
    let result = "NG";

    try {
      // トランザクション開始
      await mysqlPromise.beginTransaction(connection);

      // ------------------------------
      // トレーニング更新
      // ------------------------------
      // SQL文
      let sql = '';
      sql += 'UPDATE ';
      sql += '    TRN_TRAINING ';
      sql += 'SET ';
      sql += '    TRAINING_NM = ? ';
      sql += ',   TRAINING_START_TIME = ? ';
      sql += ',   TRAINING_END_TIME = ? ';
      sql += 'WHERE ';
      sql += '    TRAINING_NO = ? ';

      // パラメータ
      let params = [];
      params.push(req.body.trainingNm);
      params.push(req.body.trainingDateBegin);
      params.push(req.body.trainingDateEnd);
      params.push(req.body.trainingNo);

      // 実行
      let results = await mysqlPromise.query(connection, sql, params);
      if (results.affectedRows === 0) {
        throw new Error('SQL Execute Error');
      }
      
      // ------------------------------
      // トレーニング明細削除
      // ------------------------------
      // SQL文
      sql = '';
      sql += 'DELETE FROM ';
      sql += '    TRN_TRAINING_DTL ';
      sql += 'WHERE ';
      sql += '    TRAINING_NO = ? ';

      // パラメータ
      params = [];
      params.push(req.body.trainingNo);

      // 実行
      results = await mysqlPromise.query(connection, sql, params);

      // ------------------------------
      // トレーニング明細作成
      // ------------------------------
      // SQL文
      sql = '';
      sql += 'INSERT INTO TRN_TRAINING_DTL( ';
      sql += '    TRAINING_NO ';
      sql += ',   DTL_NO ';
      sql += ',   TRAINING_CONTENTS ';
      sql += ',   REP_QTY ';
      sql += ') VALUES ( ';
      sql += '    ? ';
      sql += ',   ? ';
      sql += ',   ? ';
      sql += ',   ? ';
      sql += '); ';

      let dtl = JSON.parse(req.body.DTL);
      for (let [i, d] of dtl.entries()) {
        // パラメータ
        params = [];
        params.push(req.body.trainingNo);
        params.push(String(i + 1).padStart(3, '0'));
        params.push(d.TRAINING_CONTENTS);
        params.push(d.REP_QTY);

        // 実行
        results = await mysqlPromise.query(connection, sql, params);
        if (results.affectedRows === 0) {
          throw new Error('SQL Execute Error');
        }
      }

      // コミット
      await mysqlPromise.commit(connection);

      result = "OK";
    } catch (err) {
      // ロールバック
      await mysqlPromise.rollback(connection, err);
    } finally {
      //connection.end();
      res.json({results: { result: result }});
    }
  })().catch((err) => {
    console.error(err);
  });
});

/**
 * 一覧　削除処理
 */
app.post('/delete', (req, res) => {
  (async () => {
    let result = "NG";

    try {
      // トランザクション開始
      await mysqlPromise.beginTransaction(connection);

      // ------------------------------
      // トレーニング削除
      // ------------------------------
      let dtl = JSON.parse(req.body.trainingNoList);
      for (let [i, trainingNo] of dtl.entries()) {
        // パラメータ
        params = [];
        params.push(trainingNo);

        // ------------------------------
        // トレーニング削除
        // ------------------------------
        // SQL文
        let sql = '';
        sql += 'DELETE FROM ';
        sql += '    TRN_TRAINING ';
        sql += 'WHERE ';
        sql += '    TRAINING_NO = ? ';
        sql += '; ';

        // 実行
        let results = await mysqlPromise.query(connection, sql, params);
        if (results.affectedRows === 0) {
          throw new Error('SQL Execute Error');
        }

        // ------------------------------
        // トレーニング明細削除
        // ------------------------------
        // SQL文
        sql = '';
        sql += 'DELETE FROM ';
        sql += '    TRN_TRAINING_DTL ';
        sql += 'WHERE ';
        sql += '    TRAINING_NO = ? ';
        sql += '; ';

        // 実行
        results = await mysqlPromise.query(connection, sql, params);
        if (results.affectedRows === 0) {
          throw new Error('SQL Execute Error');
        }
      }

      // コミット
      await mysqlPromise.commit(connection);

      result = "OK";
    } catch (err) {
      // ロールバック
      await mysqlPromise.rollback(connection, err);
    } finally {
      //connection.end();
      res.json({results: { result: result }});
    }
  })().catch((err) => {
    console.error(err);
  });
});
