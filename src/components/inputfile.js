//inputfilecv.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import fileIcon from 'assets/images/icons/file.png'; // Ruta de la imagen del archivo

const flickerAnimation = keyframes`
  0% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252), inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
  }
  5% {
    border: none;
    box-shadow: none;
  }
  10% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252), inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
  }
  25% {
    border: none;
    box-shadow: none;
  }
  30% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252), inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
  }
  100% {
    border: 2px solid rgb(1, 235, 252);
    box-shadow: 0px 0px 100px rgb(1, 235, 252), inset 0px 0px 10px rgb(1, 235, 252), 0px 0px 5px rgb(255, 255, 255);
  }
`;

const InputDiv = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid rgb(1, 235, 252);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow:
    0px 0px 100px rgb(1, 235, 252),
    inset 0px 0px 10px rgb(1, 235, 252),
    0px 0px 5px rgb(255, 255, 255);
  animation: ${({ pulse }) => (pulse ? flickerAnimation : 'none')} 2s linear infinite;
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer !important;
`;

const FileIcon = styled.img`
  width: 50px; /* Ajusta el tamaño de la imagen según sea necesario */
`;

const FileUpload = (handleFileChange) => {
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileSelect = (event) => {
    setFileSelected(true);
    handleFileChange(event.target.files[0]);
  };

  return (
    <InputDiv pulse={fileSelected.toString()}>
      <Input className="input" name="file" type="file" onChange={handleFileSelect} />
      <FileIcon src={fileIcon} alt="File Icon" /> {/* Agrega la imagen del archivo */}
    </InputDiv>
  );
};

export default FileUpload;
