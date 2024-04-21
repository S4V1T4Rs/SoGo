// styledButton.js
import styled from 'styled-components';

export const StyledButton = styled.button.attrs((props) => ({
  buttoncolors: props.buttoncolors
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  width: 150px;
  height: 50px;
  //margin-top: -12px;
  //background-color: ${(props) => (props.buttoncolors === 'green' ? 'green' : 'red')};
  border-radius: 30px;
  border: 1px solid #8f9092;
  transition: all 0.2s ease;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #000;
  text-shadow: 0 1px #fff;

  &:hover {
    //background-color: ${(props) => (props.buttoncolors === 'green' ? 'green' : 'red')};
    box-shadow:
      0 4px 3px 1px #fcfcfc,
      0 6px 8px #d6d7d9,
      0 -4px 4px #cecfd1,
      0 -6px 4px #fefefe,
      inset 0 0 3px 3px #cecfd1;
  }

  &:active {
    box-shadow:
      0 4px 3px 1px #fcfcfc,
      0 6px 8px #d6d7d9,
      0 -4px 4px #cecfd1,
      0 -6px 4px #fefefe,
      inset 0 0 5px 3px #999,
      inset 0 0 30px #aaa;
  }

  &:focus {
    box-shadow:
      0 4px 3px 1px #fcfcfc,
      0 6px 8px #d6d7d9,
      0 -4px 4px #cecfd1,
      0 -6px 4px #fefefe,
      inset 0 0 5px 3px #999,
      inset 0 0 30px #aaa;
  }
`;
