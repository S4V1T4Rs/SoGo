import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Slider,
  Tooltip,
  Typography
} from '@mui/material';
import { IconSettings } from '@tabler/icons-react';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SET_BORDER_RADIUS, SET_FONT_FAMILY, SET_THEME_MODE } from 'store/actions';
import { gridSpacing } from 'store/constant';
import ThemeSwitch from 'components/BotonDark/dark';

// concat 'px'
function valueText(value) {
  return `${value}px`;
}

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  // Agrega el estado darkMode al selector del store
  const [darkMode, setDarkMode] = useState(customization.darkMode);

  const handleToggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    dispatch({ type: SET_THEME_MODE, darkMode: newMode });
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };
  useEffect(() => {
    // Recuperar el estado del almacenamiento local
    const savedMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedMode !== null) {
      setDarkMode(savedMode);
      dispatch({ type: SET_THEME_MODE, darkMode: savedMode });
    }
  }, [dispatch]);

  // drawer on/off
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  // state - border radius
  const [borderRadius, setBorderRadius] = useState(customization.borderRadius);
  const handleBorderRadius = (event, newValue) => {
    setBorderRadius(newValue);
  };

  useEffect(() => {
    dispatch({ type: SET_BORDER_RADIUS, borderRadius });
  }, [dispatch, borderRadius]);

  let initialFont;
  switch (customization.fontFamily) {
    case `'Inter', sans-serif`:
      initialFont = 'Inter';
      break;
    case `'Poppins', sans-serif`:
      initialFont = 'Poppins';
      break;
    case `'Roboto', sans-serif`:
    default:
      initialFont = 'Roboto';
      break;
  }

  // state - font family
  const [fontFamily, setFontFamily] = useState(initialFont);
  useEffect(() => {
    let newFont;
    switch (fontFamily) {
      case 'Inter':
        newFont = `'Inter', sans-serif`;
        break;
      case 'Poppins':
        newFont = `'Poppins', sans-serif`;
        break;
      case 'Roboto':
      default:
        newFont = `'Roboto', sans-serif`;
        break;
    }
    dispatch({ type: SET_FONT_FAMILY, fontFamily: newFont });
  }, [dispatch, fontFamily]);

  return (
    <>
      {/* toggle button */}
      <Tooltip title="Live Customize">
        <Fab
          component="div"
          onClick={handleToggle}
          size="medium"
          variant="circular"
          color="secondary"
          sx={{
            borderRadius: 0,
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '4px',
            top: '25%',
            position: 'fixed',
            right: 10,
            zIndex: theme.zIndex.speedDial
          }}
        >
          <AnimateButton type="rotate">
            <IconButton color="inherit" size="large" disableRipple>
              <IconSettings />
            </IconButton>
          </AnimateButton>
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 280,
            background: customization.darkMode
              ? '#373737'
              : 'linear-gradient(90deg, rgba(255,253,253,1) 0%, rgba(255,255,255,1) 43%, rgba(228,227,227,1) 100%)'
          }
        }}
      >
        <PerfectScrollbar component="div">
          <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
            <Grid item xs={12}>
              {/* font family */}
              <SubCard
                title="Font Family"
                style={{
                  background: customization.darkMode
                    ? 'transparent'
                    : 'linear-gradient(90deg, rgba(255,253,253,1) 0%, rgba(255,255,255,1) 43%, rgba(228,227,227,1) 100%)'
                  // borderColor: customization.darkMode ? 'black' : 'white'
                }}
              >
                <FormControl>
                  <RadioGroup
                    aria-label="font-family"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="Roboto"
                      control={<Radio sx={{ color: customization.darkMode ? 'white' : 'black' }} />}
                      label="Roboto"
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': { color: customization.darkMode ? 'white' : 'black' }
                      }}
                    />
                    <FormControlLabel
                      value="Poppins"
                      control={<Radio sx={{ color: customization.darkMode ? 'white' : 'black' }} />}
                      label="Poppins"
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': { color: customization.darkMode ? 'white' : 'black' }
                      }}
                    />
                    <FormControlLabel
                      value="Inter"
                      control={<Radio sx={{ color: customization.darkMode ? 'white' : 'black' }} />}
                      label="Inter"
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 28 },
                        '& .MuiFormControlLabel-label': { color: customization.darkMode ? 'white' : 'black' }
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </SubCard>
            </Grid>
            <Grid item xs={12}>
              {/* border radius */}
              <SubCard
                title="Border Radius"
                style={{
                  background: customization.darkMode
                    ? 'transparent'
                    : 'linear-gradient(90deg, rgba(255,253,253,1) 0%, rgba(255,255,255,1) 43%, rgba(228,227,227,1) 100%)'
                  // borderColor: customization.darkMode ? 'black' : 'white'
                }}
              >
                <Grid item xs={12} container spacing={2} alignItems="center" sx={{ mt: 2.5 }}>
                  <Grid item>
                    <Typography variant="h6" sx={{ color: customization.darkMode ? 'white' : 'black' }}>
                      4px
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      size="small"
                      value={borderRadius}
                      onChange={handleBorderRadius}
                      getAriaValueText={valueText}
                      valueLabelDisplay="on"
                      aria-labelledby="discrete-slider-small-steps"
                      marks
                      step={2}
                      min={4}
                      max={24}
                      color="secondary"
                      sx={{
                        '& .MuiSlider-valueLabel': {
                          color: customization.darkMode ? 'white' : 'white'
                        }
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" sx={{ color: customization.darkMode ? 'white' : 'black' }}>
                      24px
                    </Typography>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>

            <Grid item xs={12}>
              <SubCard
                title="Modo"
                style={{
                  background: customization.darkMode
                    ? 'transparent'
                    : 'linear-gradient(90deg, rgba(255,253,253,1) 0%, rgba(255,255,255,1) 43%, rgba(228,227,227,1) 100%)'
                  // borderColor: customization.darkMode ? 'black' : 'white'
                }}
              >
                <Grid item xs={12} container spacing={2} alignItems="center" sx={{ mt: 2.5, display: 'flex', justifyContent: 'center' }}>
                  <ThemeSwitch darkMode={darkMode} onToggleTheme={handleToggleTheme} />
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
};

export default Customization;
