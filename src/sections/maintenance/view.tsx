'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { MaintenanceIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function MaintenanceView() {
  const { t: tmaintenance } = useTranslate('maintenance');

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <Typography variant="h3" sx={{ mb: 2 }}>
        {tmaintenance('title')}
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>{tmaintenance('description')} </Typography>

      <MaintenanceIllustration sx={{ my: { xs: 5, sm: 10 } }} />

      <Button component={RouterLink} href="/" size="large" variant="contained">
        {tmaintenance('button_text')}
      </Button>
    </Box>
  );
}
