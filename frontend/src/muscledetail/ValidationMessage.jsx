import React from 'react';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';

export default function ValidationMessage(props) {
  const { message } = props;

  return (
    <Typography sx={{ color: 'red' }}>
      {message ? <ErrorIcon fontSize="small" sx={{ verticalAlign: 'text-bottom' }} /> : ''}
      {message}
    </Typography>
  );
}
