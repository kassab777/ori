'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

import { useCountdownDate } from 'src/hooks/use-countdown';

import { useTranslate } from 'src/locales';
import { varAlpha } from 'src/theme/styles';
import { ComingSoonIllustration } from 'src/assets/illustrations';

import { SocialIcon } from 'src/components/iconify';

// ----------------------------------------------------------------------

const SOCIAL: { name: string }[] = [];

export function ComingSoonView() {
  const { t: tcomingsoon } = useTranslate('coming-soon');

  const countdown = useCountdownDate(new Date('08/08/2025 21:30'));

  const showNotifyButtton = false;

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {tcomingsoon('title')}
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>{tcomingsoon('description')}</Typography>

      <ComingSoonIllustration sx={{ my: { xs: 5, sm: 10 } }} />

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Box sx={{ mx: { xs: 1, sm: 2.5 } }}>:</Box>}
        sx={{ typography: 'h2' }}
      >
        <TimeBlock label={tcomingsoon('days')} value={countdown.days} />
        <TimeBlock label={tcomingsoon('hours')} value={countdown.hours} />
        <TimeBlock label={tcomingsoon('minutes')} value={countdown.minutes} />
        <TimeBlock label={tcomingsoon('seconds')} value={countdown.seconds} />
      </Stack>

      {showNotifyButtton && (
        <TextField
          fullWidth
          placeholder="Enter your email"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" size="large">
                  {tcomingsoon('button_text')}
                </Button>
              </InputAdornment>
            ),
            sx: {
              pr: 0.5,
              [`&.${outlinedInputClasses.focused}`]: {
                boxShadow: (theme) => theme.customShadows.z20,
                transition: (theme) =>
                  theme.transitions.create(['box-shadow'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                [`& .${outlinedInputClasses.notchedOutline}`]: {
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
                },
              },
            },
          }}
          sx={{ my: 5 }}
        />
      )}

      <Stack spacing={1} alignItems="center" justifyContent="center" direction="row">
        {SOCIAL.map((social) => (
          <IconButton key={social.name}>
            <SocialIcon icon={social.name} />
          </IconButton>
        ))}
      </Stack>
    </Container>
  );
}

// ----------------------------------------------------------------------

type TimeBlockProps = {
  label: string;
  value: string;
};

function TimeBlock({ label, value }: TimeBlockProps) {
  return (
    <div>
      <div> {value} </div>
      <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box>
    </div>
  );
}
