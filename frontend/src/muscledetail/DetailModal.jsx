import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import MuscleDetail from './MuscleDetail';

const style = {
  bgcolor: 'white',
  m: 2,
  pb: 2,
  height: '95%',
  overflowY: 'scroll',
};

export default function DetailModal(props) {
  const { open, setShowDetail, selectNo } = props;

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <MuscleDetail setShowDetail={setShowDetail} selectNo={selectNo} />
        </Box>
      </Modal>
    </div>
  );
}
