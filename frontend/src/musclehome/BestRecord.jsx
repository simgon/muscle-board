import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../components/Title';

export default function BestRecord(props) {
  const year = props.data?.TRAINING_DATE.substring(0, 4);
  const month = props.data?.TRAINING_DATE.substring(4, 6);
  const day = props.data?.TRAINING_DATE.substring(6, 8);
  const trainingDate = `${year}/${month}/${day}`;

  return (
    <>
      <Title>最高レップ数</Title>
      <Typography component="p" variant="h4">
        {props.data?.TOTAL_REP_QTY}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {props.data && props.data?.TRAINING_NM + ' ' + trainingDate}
      </Typography>
      <div>
        {props.data && (
          <Link color="primary" href={'/detail/' + props.data?.TRAINING_NO} target="_blank">
            記録を表示
          </Link>
        )}
      </div>
    </>
  );
}
