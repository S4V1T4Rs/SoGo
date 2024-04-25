//TableVacante.js

import { Grid, IconButton, Typography } from '@mui/material';
import { IconCheck, IconConfetti, IconMoodSad, IconNews, IconUserCheck } from '@tabler/icons-react';
import { MessageCard } from 'components/Tab/styled';

export const TableVacancie = () => {
  return (
    <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Grid item xs={12} md={12}>
        <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginBottom: '20px' }}>
          <Grid item xs={11} textAlign="left">
            <Typography variant="h4">Programadores</Typography>
            <Typography variant="body1">Descripción: React, Node.js, etc.</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <MessageCard>
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                <IconNews />
              </IconButton>
              NUEVO
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                0
              </IconButton>
            </MessageCard>
          </Grid>
          <Grid item xs={2}>
            <MessageCard>
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                <IconCheck />
              </IconButton>
              ACEPTADO
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                0
              </IconButton>
            </MessageCard>
          </Grid>
          <Grid item xs={2}>
            <MessageCard>
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                <IconUserCheck />
              </IconButton>
              ENTREVISTA
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                0
              </IconButton>
            </MessageCard>
          </Grid>
          <Grid item xs={2}>
            <MessageCard>
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                <IconConfetti />
              </IconButton>
              SELECCIONADO
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                0
              </IconButton>
            </MessageCard>
          </Grid>
          <Grid item xs={2}>
            <MessageCard>
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                <IconMoodSad />
              </IconButton>
              DESCARTADO
              <IconButton size="small" style={{ marginRight: '5px', marginLeft: '5px' }}>
                0
              </IconButton>
            </MessageCard>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" alignItems="center" sx={{ marginTop: '20px' }}>
          <Grid item xs={11} textAlign="left">
            <Typography variant="h4">Tipo Jornada: Temporal</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
