import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function Header(props) {
  const { setShowDetail } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" color="inherit" underline="none">
              Muscle Board
            </Link>
          </Typography>

          <div style={{ flexGrow: 1 }}></div>
          <Box style={{ alignItems: 'end', display: 'flex' }}>
            {setShowDetail !== undefined && (
              <Button
                onClick={() => setShowDetail(false)}
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
              >
                <CloseIcon />
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
