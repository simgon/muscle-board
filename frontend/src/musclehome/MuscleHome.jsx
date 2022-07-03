import React, { useState } from 'react';
import Header from '../components/Header';
import SearchForm from './SearchForm';
import Dashboard from './Dashboard';
import LoadingModal from '../components/LoadingModal';
import CssBaseline from '@mui/material/CssBaseline';

import DetailModal from '../muscledetail/DetailModal';

export default function MuscleHome() {
  const [trainingData, setTrainingData] = useState([]);
  const [trainingGraphData, setTrainingGraphData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);

  const [showDetail, setShowDetail] = useState(false);
  const [selectNo, setSelectNo] = useState(null);

  return (
    <>
      <CssBaseline />
      {/* ヘッダー */}
      <Header />
      {/* 検索フォーム */}
      <SearchForm
        setTrainingData={setTrainingData}
        setTrainingGraphData={setTrainingGraphData}
        setShowLoading={setShowLoading}
        setShowDetail={setShowDetail}
        setSelectNo={setSelectNo}
      />
      {/* ダッシュボード */}
      <Dashboard
        rows={trainingData}
        graphData={trainingGraphData}
        setShowDetail={setShowDetail}
        setSelectNo={setSelectNo}
      />

      {/* 読込モーダル */}
      <LoadingModal open={showLoading} />

      <DetailModal open={showDetail} setShowDetail={setShowDetail} selectNo={selectNo} />
    </>
  );
}
