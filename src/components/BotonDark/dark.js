import styled from 'styled-components';
import PropTypes from 'prop-types';
const ThemeSwitchContainer = styled.div`
  --toggle-size: 30px;
  --container-width: 5.625em;
  --container-height: 3.2em;
  --container-radius: 6.25em;
  --container-light-bg: #3d7eae;
  --container-night-bg: #1d1f2c;
  --circle-container-diameter: 3.375em;
  --sun-moon-diameter: 2.125em;
  --sun-bg: #ecca2f;
  --moon-bg: #c4c9d1;
  --spot-color: #959db1;
  --circle-container-offset: calc((var(--circle-container-diameter) - var(--container-height)) / 2 * -1);
  --transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
  --circle-transition: 0.3s cubic-bezier(0, -0.02, 0.35, 1.17);

  width: var(--container-width);
  height: var(--container-height);
  background-color: ${(props) => (props.checked ? 'var(--container-night-bg)' : 'var(--container-light-bg)')};
  border-radius: var(--container-radius);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 2px solid #673ab7;
`;

const ThemeSwitchCheckbox = styled.input`
  display: none;
`;

const CircleContainer = styled.div`
  width: var(--circle-container-diameter);
  height: var(--circle-container-diameter);
  background-color: rgba(255, 255, 255, 0.1);
  position: absolute;
  left: ${(props) =>
    props.checked ? 'calc(100% - var(--circle-container-offset) - var(--circle-container-diameter))' : 'var(--circle-container-offset)'};
  top: var(--circle-container-offset);
  border-radius: var(--container-radius);
  display: flex;
  transition: var(--circle-transition);
  pointer-events: none;
`;

const SunMoonContainer = styled.div`
  pointer-events: auto;
  position: relative;
  z-index: 2;
  width: var(--sun-moon-diameter);
  height: var(--sun-moon-diameter);
  margin: auto;

  border-radius: var(--container-radius);
  background-color: var(--sun-bg);
  overflow: hidden;
  transition: var(--transition);
`;

const Moon = styled.div`
  transform: ${(props) => (props.checked ? 'translate(0)' : 'translateX(100%)')};
  width: 100%;
  height: 100%;

  background-color: var(--moon-bg);
  border-radius: inherit;
  transition: var(--transition);
  position: relative;
`;

const Spot = styled.div`
  position: absolute;
  top: 0.75em;
  left: 0.312em;
  width: 0.75em;
  height: 0.75em;
  border-radius: var(--container-radius);
  background-color: var(--spot-color);
`;

const ThemeSwitch = ({ darkMode, onToggleTheme }) => {
  const handleToggle = () => {
    onToggleTheme();
  };

  return (
    <ThemeSwitchContainer checked={darkMode} onClick={handleToggle}>
      <ThemeSwitchCheckbox type="checkbox" checked={darkMode} />
      <CircleContainer checked={darkMode}>
        <SunMoonContainer>
          <Moon checked={darkMode}>
            <Spot />
            <Spot />
            <Spot />
          </Moon>
        </SunMoonContainer>
      </CircleContainer>
    </ThemeSwitchContainer>
  );
};
ThemeSwitch.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired
};
export default ThemeSwitch;
