import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  linearProgressClasses
} from '@mui/material';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 30,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#fff'
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main
  }
}));

const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.primary.light,
  marginBottom: '22px',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '157px',
    height: '157px',
    background: theme.palette.primary[200],
    borderRadius: '50%',
    top: '-105px',
    right: '-96px'
  }
}));

const MenuCard = () => {
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(timer);
  }, []);

  const dayProgress = ((currentTime.getHours() * 60 + currentTime.getMinutes()) / (24 * 60)) * 100;

  const [secondsColor, setSecondsColor] = useState('#3f51b5'); // Estado para el color de los segundos
  const [minutesColor, setMinutesColor] = useState('#3f51b5'); // Estado para el color de los minutos
  const [hoursColor, setHoursColor] = useState('#3f51b5'); // Estado para el color de las horas

  const secondsProgress = (currentTime.getSeconds() / 60) * 100;
  const minutesProgress = ((currentTime.getMinutes() + currentTime.getSeconds() / 60) / 60) * 100;
  const hoursProgress = ((currentTime.getHours() + currentTime.getMinutes() / 60 + currentTime.getSeconds() / 3600) / 24) * 100;

  useEffect(() => {
    // Colores pasteles
    const pastelColors = ['#FFDAB9', '#ADD8E6', '#FFA07A', '#98FB98', '#FFB6C1'];
    const getRandomColor = () => {
      return pastelColors[Math.floor(Math.random() * pastelColors.length)];
    };

    if (secondsProgress === 100) {
      setSecondsColor(getRandomColor());
    }
    if (minutesProgress === 100) {
      setMinutesColor(getRandomColor());
    }
    if (hoursProgress === 100) {
      setHoursColor(getRandomColor());
    }
  }, [secondsProgress, minutesProgress, hoursProgress]);

  return (
    <CardStyle>
      <CardContent sx={{ p: 2 }}>
        <List sx={{ p: 0, m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
            <ListItemAvatar sx={{ mt: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  color: theme.palette.primary.main,
                  border: 'none',
                  borderColor: theme.palette.primary.main,
                  background: '#fff',
                  marginRight: '12px'
                }}
              >
                <TableChartOutlinedIcon fontSize="inherit" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography variant="subtitle1" sx={{ color: theme.palette.primary[800] }}>
                  Get Extra Space
                </Typography>
              }
              secondary={<Typography variant="caption"> 28/23 GB</Typography>}
            />
          </ListItem>
        </List>
        <LinearProgressWithLabel label="Tiempo del Día" value={dayProgress} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <CircularProgressBar value={secondsProgress} color={secondsColor} />
          <CircularProgressBar value={minutesProgress} color={minutesColor} />
          <CircularProgressBar value={hoursProgress} color={hoursColor} />
        </div>
      </CardContent>
    </CardStyle>
  );
};

const LinearProgressWithLabel = ({ label, value, text }) => {
  const theme = useTheme();

  return (
    <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
      <Grid item>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" sx={{ color: theme.palette.primary[800] }}>
              {label}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="inherit">
              {text || `${Math.round(value)}%`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <BorderLinearProgress variant="determinate" value={value} />
      </Grid>
    </Grid>
  );
};

LinearProgressWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  text: PropTypes.string
};

const CircularProgressBar = ({ value, color }) => {
  return (
    <div style={{ width: 100, height: 100 }}>
      <CircularProgressbarWithChildren
        value={value}
        strokeWidth={10}
        styles={{
          root: {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Efecto de sombra
            borderRadius: '50%', // Borde redondeado
            overflow: 'hidden' // Evita que el borde se solape con la sombra
          },
          path: {
            stroke: color // Color de la barra de progreso
          }
        }}
      >
        <div style={{ fontSize: 16, marginTop: -5 }}>
          <strong>{`${Math.round(value)}%`}</strong>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

CircularProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};

export default MenuCard;
``;
