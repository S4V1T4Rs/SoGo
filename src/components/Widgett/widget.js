import React, { useEffect, useState } from 'react';
/**/
import styled from 'styled-components';
import { Grid, Typography } from '@mui/material';
import { getVacancies } from 'views/pages/Vacantes/Controller/VacancieController';
import { FormContent } from 'Style/Tab/styled';
import { useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import { getUsuarios } from 'api/Controller/fireController';

const ProgressContainer = styled.div`
  padding: 2rem;
  box-shadow:
    10px 10px 10px -2px rgba(0, 0, 0, 0.15),
    -10px -10px 10px -2px rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease;
  border: 0.05px solid ${({ color }) => color};
  &:hover {
    background-color: ${({ color }) => (color ? `rgba(${hexToRgb(color)}, 0.3)` : 'rgba(255, 255, 255, 0.3)')};
    cursor: pointer;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.125rem;
  background-color: ${({ color }) => color};
  border-radius: 0.125rem;
  margin-bottom: 1.09rem;
  margin-top: -20px;
`;

const ProgressText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const ColorIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  cursor: pointer;
`;

const ColorPickerContainer = styled.div`
  position: absolute;
  margin-top: 310px;
  margin-left: 250px;
  z-index: 999;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const StyledButton = styled.button`
  padding: 10px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
// function hexToRgb(hex) {
//   if (!hex.startsWith('#')) return null;
//   hex = hex.substring(1); // Elimina el #
//   const bigint = parseInt(hex, 16);
//   const r = (bigint >> 16) & 255;
//   const g = (bigint >> 8) & 255;
//   const b = bigint & 255;
//   return `${r}, ${g}, ${b}`;
// }
// Función para convertir un color hexadecimal a rgba
function hexToRgb(hex) {
  // Verificar si hex es una cadena de texto
  if (typeof hex !== 'string' || !hex.startsWith('#')) return null;
  hex = hex.substring(1); // Elimina el #
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${(props) => props.buttonColor};
  border-radius: 0.5rem;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    button {
      background-color: ${(props) => props.buttonColor};
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      cursor: pointer;

      &:hover {
        filter: brightness(110%);
      }
    }
  }

  .content {
    text-align: center;
    font-size: 0.875rem;
  }

  .info {
    margin-top: 1rem;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    font-weight: 600;

    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 600px) {
    min-width: auto;
    max-width: 100%;
  }
`;
const BackButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    3px 3px 10px rgba(0, 0, 0, 0.2),
    -3px -3px 10px rgba(255, 255, 255, 0.5);

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    border-color: ${({ theme }) => theme.buttonHoverBorder};
    color: ${({ theme }) => theme.buttonHoverText};
    box-shadow:
      5px 5px 10px rgba(0, 0, 0, 0.2),
      -5px -5px 10px rgba(255, 255, 255, 0.5);
  }
`;

const Widget = () => {
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
        const data = await getUsuarios();
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
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <BackButton variant="contained" onClick={() => setShowTablas(false)}>
                Regresar
              </BackButton>
            </Grid>
            {selectedVacancy &&
              Object.keys(vacancyColors[selectedVacancy] || {}).map((status, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card buttonColor={vacancyColors[selectedVacancy]?.[status]}>
                    <div className="header">
                      <h2>{status}</h2>
                      <StyledButton color={vacancyColors[selectedVacancy]?.[status]}>+ Añadir</StyledButton>
                    </div>
                    {status === 'Nuevo' &&
                      selectedCardName === 'Nuevo' && ( // Verificar si el estado es "Nuevo"
                        <>
                          {candidatesData.map((candidate, index) => (
                            <Card key={index}>
                              <div className="header">
                                <h2>
                                  {candidate['Datos Personales']?.Nombre} {candidate['Datos Personales']?.Apellido}
                                </h2>
                              </div>
                              <div className="content">
                                <p>Tipo de Documento: {candidate['Datos Personales']?.TipoDocumento}</p>
                                <p>Número de Documento: {candidate['Datos Personales']?.NumeroDocumento}</p>
                                {/* Mostrar más información del candidato si es necesario */}
                              </div>
                            </Card>
                          ))}
                        </>
                      )}
                    <div className="content">0</div>
                  </Card>
                </Grid>
              ))}
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

export default Widget;
