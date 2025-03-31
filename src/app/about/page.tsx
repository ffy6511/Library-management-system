'use client';

import { Box, Typography } from '@mui/material';

export default function About() {
  return (
    <div style = {{color: 'var(--default-text-color'}} >
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        关于我们
      </Typography>
      <Typography variant="body1">
         关于图书管理系统的介绍内容
      </Typography>
    </Box>
    </div>
  );
}