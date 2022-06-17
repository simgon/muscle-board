import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MuscleHome from './musclehome/MuscleHome';
import MuscleDetail from './muscledetail/MuscleDetail';
import NotFound from './components/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MuscleHome />} />
        <Route
          path="/detail/"
          component={MuscleDetail}
          element={<MuscleDetail isCreate={true} />}
        />
        <Route
          path="/detail/:no"
          component={MuscleDetail}
          element={<MuscleDetail isCreate={false} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
