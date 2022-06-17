import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function DetailToolbar(props) {
  const { handleTemplateClick, handleUpdateClick } = props;

  return (
    <Grid container spacing={1}>
      <Grid item xs={6} md={2}>
        <Button variant="outlined" onClick={handleTemplateClick} sx={{ mb: 1 }}>
          テンプレート
        </Button>
      </Grid>

      <div style={{ flexGrow: 1 }}></div>
      <Box style={{ alignItems: 'end', display: 'flex' }}>
        <Button variant="outlined" onClick={handleUpdateClick} sx={{ mt: 1, mb: 1 }}>
          更新
        </Button>
      </Box>
    </Grid>
  );
}
