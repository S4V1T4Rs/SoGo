import React, { useEffect, useState } from 'react';
/**/

import { Grid, Typography } from '@mui/material';
import { getVacancies } from 'views/pages/Vacantes/Controller/VacancieController';
import { FormContent } from 'Style/Tab/styled';
import { useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import {
  BackButton,
  Card,
  ColorIcon,
  ColorPickerContainer,
  Container,
  ProgressBar,
  ProgressContainer,
  ProgressText,
  StyledButton,
  StyledInput
} from './Styledss';

// function hexToRgb(hex) {
//   if (!hex.startsWith('#')) return null;
//   hex = hex.substring(1); // Elimina el #
//   const bigint = parseInt(hex, 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;
//   return `${r}, ${g}, ${b}`;
// }

const TableVacancie = () => {
  const [vacanciesData, setVacanciesData] = useState([]);
  const customization = useSelector((state) => state.customization);
  const [vacancyColors, setVacancyColors] = useState({});
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#34D399');
  const [selectedCardName, setSelectedCardName] = useState('');
  // const [selectedState, setSelectedState] = useState('');
  const [candidatesData, setCandidatesData] = useState([]); // Estado para almacenar los datos de los candidatos
  // const [dataCounts, setDataCounts] = useState({});

  useEffect(() => {
    const fetchVacanciesData = async () => {
      try {
        const data = await getVacancies();
        setCandidatesData(data);
      } catch (error) {
        console.error('Error fetching vacancies data:', error);
      }
    };

    fetchVacanciesData();
  }, []);

  useEffect(() => {
    // Cuando se cargan los datos, calcula la cantidad de datos para cada estado y cada vacante
    const calculateDataCounts = () => {
      const newDataCounts = {};
      vacanciesData.forEach((vacancy) => {
        const vacancyName = vacancy['Detalles de Vacantes']?.vacancyName;
        const vacancyCounts = {};
        ['Nuevo', 'Aceptado', 'Entrevista', 'Seleccionado', 'Descartado'].forEach((status) => {
          // Filtra los datos para obtener solo los asociados con la vacante y el estado actual
          const filteredData = candidatesData.filter(
            (candidate) =>
              candidate['Detalles de Vacantes']?.vacancyName === vacancyName && candidate['Detalles de Vacantes']?.Estado === status
          );
          // Almacena la cantidad de datos asociados con la vacante y el estado actual
          vacancyCounts[status] = filteredData.length;
        });
        // Almacena la cantidad de datos asociados con la vacante actual
        newDataCounts[vacancyName] = vacancyCounts;
      });
      // setDataCounts(newDataCounts);
    };

    calculateDataCounts();
  }, [candidatesData, vacanciesData]);

  useEffect(() => {
    const fetchVacanciesData = async () => {
      try {
        const data = await getVacancies();
        setVacanciesData(data);
        const savedColors = JSON.parse(localStorage.getItem('vacancyColors')) || {};
        setVacancyColors(savedColors);
        // Verificar si hay un color seleccionado guardado en el almacenamiento local
        const selectedVacancyColor = savedColors[selectedVacancy]?.[selectedCardName];
        if (selectedVacancyColor) {
          setSelectedColor(selectedVacancyColor);
        }
      } catch (error) {
        console.error('Error fetching vacancies data:', error);
      }
    };

    fetchVacanciesData();
  }, [selectedCardName, selectedVacancy]);

  // const handleColorIconClick = (vacancyName) => {
  //   setSelectedVacancy(vacancyName);

  //   setSelectedColor(vacancyColors[vacancyName] || '#34D399');
  //   setIsPickerVisible(true);
  // };
  const handleColorIconClick = (vacancyName) => {
    setSelectedVacancy(vacancyName);
    setSelectedColor(vacancyColors[vacancyName]?.[selectedCardName] || '#34D399');
    setIsPickerVisible(true);
  };

  // const handleColorIconClick = (vacancyName) => {
  //   setSelectedVacancy(vacancyName);
  //   setSelectedColor(vacancyColors[vacancyName] || '#34D399');
  //   setIsPickerVisible(true);
  // };

  const handlePickerClose = () => {
    setIsPickerVisible(false);
  };
  const handleSaveColor = () => {
    if (selectedVacancy && selectedColor && selectedCardName) {
      // Verificar si la vacante y el estado seleccionados son válidos
      if (
        vacanciesData.some((vacancy) => vacancy['Detalles de Vacantes']?.vacancyName === selectedVacancy) &&
        ['Nuevo', 'Aceptado', 'Entrevista', 'Seleccionado', 'Descartado'].includes(selectedCardName)
      ) {
        const updatedColors = {
          ...vacancyColors,
          [selectedVacancy]: {
            ...vacancyColors[selectedVacancy],
            [selectedCardName]: selectedColor
          }
        };
        setVacancyColors(updatedColors);
        localStorage.setItem('vacancyColors', JSON.stringify(updatedColors));
        setIsPickerVisible(false);
      } else {
        alert('La vacante o el estado seleccionado no son válidos.');
      }
    }
  };

  // const handleSaveColor = () => {
  //   if (selectedVacancy && selectedColor) {
  //     const updatedColors = { ...vacancyColors, [selectedVacancy]: selectedColor };
  //     setVacancyColors(updatedColors);
  //     localStorage.setItem('vacancyColors', JSON.stringify(updatedColors));
  //     setIsPickerVisible(false);
  //   }
  // };

  const handleInputChange = (event) => {
    setSelectedCardName(event.target.value);
  };
  const [showTablas, setShowTablas] = useState(false); // Estado para controlar la visibilidad del segundo componente

  const handleCardClick = (vacancyName, cardName) => {
    setSelectedVacancy(vacancyName);
    setSelectedCardName(cardName);
    setShowTablas(true); // Mostrar el segundo componente cuando se hace clic en un card
  };
  return (
    <>
      {!showTablas && (
        <Grid container spacing={2} justifyContent="center">
          {vacanciesData.map((vacancy, index) => (
            <Grid key={index} item xs={12} md={8}>
              <FormContent
                $darkMode={customization.darkMode}
                style={{
                  borderRadius: `${customization.borderRadius}px`,
                  padding: '20px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Grid container>
                  <Grid item xs={11} sx={{ alignItems: 'center' }}>
                    <Typography variant="h4">{vacancy['Detalles de Vacantes']?.vacancyName}</Typography>
                    <Typography variant="body1" style={{ marginBottom: '0px' }}>
                      Descripción: {vacancy['Detalles de Vacantes']?.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ColorIcon
                      color={
                        selectedVacancy === vacancy['Detalles de Vacantes']?.vacancyName
                          ? vacancyColors[selectedVacancy]?.[selectedCardName] || '#34D399'
                          : '#34D399'
                      }
                      onClick={() => handleColorIconClick(vacancy['Detalles de Vacantes']?.vacancyName)}
                    />
                    {isPickerVisible && selectedVacancy === vacancy['Detalles de Vacantes']?.vacancyName && (
                      <ColorPickerContainer>
                        <Grid container>
                          <Grid item xs={12}>
                            <StyledInput
                              type="text"
                              placeholder="Ingrese el nombre del card"
                              value={selectedVacancy}
                              onChange={handleInputChange}
                              disabled
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <StyledInput
                              type="text"
                              placeholder="Ingrese el nombre del card"
                              value={selectedCardName}
                              onChange={handleInputChange}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <StyledButton onClick={handleSaveColor}>Guardar</StyledButton>
                          </Grid>
                        </Grid>
                        <SketchPicker color={selectedColor} onChange={(color) => setSelectedColor(color.hex)} />
                      </ColorPickerContainer>
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="space-around" alignItems="center" marginTop={1}>
                  <Grid item xs={2}>
                    <ProgressContainer
                      color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Nuevo || 'transparent'}
                      onClick={() => handleCardClick(vacancy['Detalles de Vacantes']?.vacancyName, 'Nuevo')}
                    >
                      <ProgressBar color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Nuevo || 'transparent'} />
                      <ProgressText>0</ProgressText>
                      <div>{status}</div>
                      <div>Nuevo</div>
                    </ProgressContainer>
                  </Grid>
                  <Grid item xs={2}>
                    <ProgressContainer
                      color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Aceptado || 'transparent'}
                      onClick={() => handleCardClick(vacancy['Detalles de Vacantes']?.vacancyName, 'Aceptado')}
                    >
                      <ProgressBar color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Aceptado || 'transparent'} />
                      <ProgressText>0</ProgressText>
                      <div>Aceptado</div>
                    </ProgressContainer>
                  </Grid>
                  <Grid item xs={2}>
                    <ProgressContainer
                      color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Entrevista || 'transparent'}
                      onClick={() => handleCardClick(vacancy['Detalles de Vacantes']?.vacancyName, 'Entrevista')}
                    >
                      <ProgressBar color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Entrevista || 'transparent'} />
                      <ProgressText>0</ProgressText>
                      <div>Entrevista</div>
                    </ProgressContainer>
                  </Grid>
                  <Grid item xs={2}>
                    <ProgressContainer
                      color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Seleccionado || 'transparent'}
                      onClick={() => handleCardClick(vacancy['Detalles de Vacantes']?.vacancyName, 'Seleccionado')}
                    >
                      <ProgressBar color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Seleccionado || 'transparent'} />
                      <ProgressText>0</ProgressText>
                      <div>Seleccionado</div>
                    </ProgressContainer>
                  </Grid>
                  <Grid item xs={2}>
                    <ProgressContainer
                      color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Descartado || 'transparent'}
                      onClick={() => handleCardClick(vacancy['Detalles de Vacantes']?.vacancyName, 'Descartado')}
                    >
                      <ProgressBar color={vacancyColors[vacancy['Detalles de Vacantes']?.vacancyName]?.Descartado || 'transparent'} />
                      <ProgressText>0</ProgressText>
                      <div>Descartado</div>
                    </ProgressContainer>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: '20px' }}>
                  <Grid item>
                    <Typography variant="h6">Tipo Jornada: {vacancy['Detalles de Vacantes']?.workType}</Typography>
                    <Typography variant="h6">Fecha de Creación: {vacancy['Detalles de Vacantes']?.creationDate}</Typography>
                  </Grid>
                </Grid>
              </FormContent>
            </Grid>
          ))}
        </Grid>
      )}

      {showTablas && (
        <Container>
          <Grid container spacing={2}>
            <>
              <Grid item xs={12}>
                <BackButton variant="contained" onClick={() => setShowTablas(false)}>
                  Regresar
                </BackButton>
              </Grid>

              {selectedVacancy &&
                Object.keys(vacancyColors[selectedVacancy] || {}).map((status, index) => (
                  <Card buttonColor={vacancyColors[selectedVacancy]?.[status]} key={index}>
                    <div className="header">
                      <h2>{status}</h2>
                      <StyledButton color={vacancyColors[selectedVacancy]?.[status]}>+ Añadir</StyledButton>
                    </div>

                    <div className="content">0</div>
                  </Card>
                ))}
            </>
          </Grid>
        </Container>
      )}

      {isPickerVisible && (
        <div
          onClick={handlePickerClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handlePickerClose();
          }}
          style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
          tabIndex={0}
          role="button"
          aria-label="Cerrar selector de color"
        />
      )}
    </>
  );
};

export default TableVacancie;
