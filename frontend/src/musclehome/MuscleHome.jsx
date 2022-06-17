import React, { useState } from 'react';
import Header from '../components/Header';
import SearchForm from './SearchForm';
import Dashboard from './Dashboard';
import LoadingModal from '../components/LoadingModal';
import CssBaseline from '@mui/material/CssBaseline';

export default function MuscleHome() {
  const [trainingData, setTrainingData] = useState([]);
  const [trainingGraphData, setTrainingGraphData] = useState([]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <CssBaseline />
      {/* ヘッダー */}
      <Header />
      {/* 検索フォーム */}
      <SearchForm
        setTrainingData={setTrainingData}
        setTrainingGraphData={setTrainingGraphData}
        setOpen={setOpen}
      />
      {/* ダッシュボード */}
      <Dashboard rows={trainingData} graphData={trainingGraphData} />

      {/* 読込モーダル */}
      <LoadingModal open={open} />
    </>
  );
}
