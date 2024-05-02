import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Typography } from '@mui/material';
import { IconCheck, IconConfetti, IconMoodSad, IconNews, IconUserCheck } from '@tabler/icons-react';
import { getVacantes } from 'api/Controller/VacancieController';
import { FormContent, MessageCard } from 'components/Tab/styled';
import { useSelector } from 'react-redux';

export const TableVacancie = () => {
  const [vacanciesData, setVacanciesData] = useState([]);

  const customization = useSelector((state) => state.customization);

  useEffect(() => {
    const fetchVacanciesData = async () => {
      try {
        const data = await getVacantes();
        setVacanciesData(data);
      } catch (error) {
        console.error('Error fetching vacancies data:', error);
      }
    };

    fetchVacanciesData();
  }, []);

  // Si no hay una vacante seleccionada, mostrar la lista de todas las vacantes
  return (
    <Grid container spacing={2} justifyContent="center">
      {vacanciesData.map((vacancy, index) => (
        <Grid key={index} item xs={12} md={8}>
          <FormContent
            $darkMode={customization.darkMode}
            style={{ borderRadius: `${customization.borderRadius}px`, padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
          >
            <Typography variant="h4">{vacancy['Informe Vacantes']?.NombreVacante}</Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              Descripción: {vacancy['Informe Vacantes']?.Descripcion}
            </Typography>
            <Grid container spacing={2} justifyContent="space-around" alignItems="center">
              <Grid item xs={2}>
                <MessageCard>
                  <IconButton size="small">
                    <IconNews />
                  </IconButton>
                  NUEVO
                  <IconButton size="small">0</IconButton>
                </MessageCard>
              </Grid>
              <Grid item xs={2}>
                <MessageCard>
                  <IconButton size="small">
                    <IconCheck />
                  </IconButton>
                  ACEPTADO
                  <IconButton size="small">0</IconButton>
                </MessageCard>
              </Grid>
              <Grid item xs={2}>
                <MessageCard>
                  <IconButton size="small">
                    <IconUserCheck />
                  </IconButton>
                  ENTREVISTA
                  <IconButton size="small">0</IconButton>
                </MessageCard>
              </Grid>
              <Grid item xs={2}>
                <MessageCard>
                  <IconButton size="small">
                    <IconConfetti />
                  </IconButton>
                  SELECCIONADO
                  <IconButton size="small">0</IconButton>
                </MessageCard>
              </Grid>
              <Grid item xs={2}>
                <MessageCard>
                  <IconButton size="small">
                    <IconMoodSad />
                  </IconButton>
                  DESCARTADO
                  <IconButton size="small">0</IconButton>
                </MessageCard>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: '20px' }}>
              <Grid item>
                <Typography variant="h6">Tipo Jornada: {vacancy['Informe Vacantes']?.TipoJornada}</Typography>
              </Grid>
            </Grid>
          </FormContent>
        </Grid>
      ))}
    </Grid>
  );
};
