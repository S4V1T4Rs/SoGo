import PropTypes from 'prop-types';
import { StyledButton } from './styledButton';
import { useEffect, useState } from 'react';

const ButtonSave = ({ onClick, children, isFormEmpty }) => {
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

  useEffect(() => {
    setIsSaveButtonDisabled(isFormEmpty);
  }, [isFormEmpty]);

  return (
    <StyledButton onClick={onClick} disabled={isSaveButtonDisabled}>
      {children}
    </StyledButton>
  );
};

ButtonSave.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  isFormEmpty: PropTypes.func
};

export default ButtonSave;
