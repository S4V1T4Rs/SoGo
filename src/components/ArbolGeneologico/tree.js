import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
`;

const Tree = styled.div`
  width: 100%;
  height: auto;
  /* text-align: center; */
  /* background-color: aliceblue; */
  display: flex;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); Agregamos sombra */
  justify-content: center;
`;

const TreeUl = styled.ul`
  padding-top: 10px;
  position: relative;
  transition: 0.5s;
  /* background-color: red; */
`;

const TreeLi = styled.li`
  display: inline-block; /* Cambiado a inline-block */
  /* text-align: center; */
  list-style-type: none;
  position: relative;
  /* background-color: rebeccapurple; */

  padding: 10px;
  transition: 0.5s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 46%;
    border-top: 1px solid #be6fff;
    width: 55%;
    height: 10px;
  }

  &::after {
    right: auto;
    left: 53%;
    border-left: 1px solid #be6fff;
  }

  &:only-child::after,
  &:only-child::before {
    display: none;
  }

  &:only-child {
    padding-top: 0;
  }

  &:first-child::before,
  &:last-child::after {
    border: 0 none;
  }

  &:last-child::before {
    border-right: 1px solid #be6fff;
    border-radius: 0 5px 0 0;
    -webkit-border-radius: 0 5px 0 0;
    -moz-border-radius: 0 5px 0 0;
  }

  &:first-child::after {
    border-radius: 5px 0 0 0;
    -webkit-border-radius: 5px 0 0 0;
    -moz-border-radius: 5px 0 0 0;
  }

  ul::before {
    content: '';
    position: absolute;
    top: 0;
    left: 54.2%;
    border-left: 1px solid #be6fff;
    width: 0;
    height: 10px;
  }
`;

const TreeLink = styled.a`
  border: 1px solid #be6fff;
  padding: 50px;
  /* background-color: yellow; */
  display: inline-grid;
  border-radius: 5px;
  text-decoration-line: none;
  border-radius: 5px;
  transition: 0.5s;
  margin-left: 8%;
  box-shadow:
    -4px -4px 15px #eeeeee,
    4px 4px 15px #9c9c9c;
  &:hover {
    background: #f2eefe;
    color: #000;
    border: 1px solid #4b0287;
  }
`;

const TreeImage = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px !important;
  /* border-radius: 100px; */
  margin: auto;
`;

const TreeSpan = styled.span`
  border: 1px solid #be6fff;
  border-radius: 5px;
  color: #666;
  padding: 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`;
const QuestionButton = styled.div`
  position: relative;
  top: -40px;
  left: 100%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #be6fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;
`;

const Popper = styled.div`
  position: absolute;
  background-color: #fff;
  border: 1px solid #be6fff;
  padding: 10px;
  border-radius: 5px;
  z-index: 2;
  display: ${({ visible }) => (visible ? 'block' : 'none')};

  /* Ajustes de posición específicos para roles */
  top: ${({ role }) => (role === 'Administrador' || role === 'RR.HH.' ? 'calc(4% - 10px)' : 'calc(5% - 10px)')};
  left: ${({ role }) => (role === 'Administrador' || role === 'RR.HH.' ? 'calc(70% + 30px)' : 'calc(100% + 10px)')};
`;

const BinaryTree = ({ data }) => {
  const [descriptions, setDescriptions] = useState({});

  const toggleDescription = (index) => {
    setDescriptions((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  const renderTree = (items, parentIndex = '') => {
    return (
      <TreeUl>
        {items.map((item, index) => {
          const currentIndex = parentIndex + index.toString();
          return (
            <TreeLi key={index}>
              <TreeLink href="#">
                <QuestionButton onMouseEnter={() => toggleDescription(currentIndex)} onMouseLeave={() => toggleDescription(currentIndex)}>
                  ?
                </QuestionButton>

                <TreeImage src={item.image} />
                <TreeSpan>{item.name}</TreeSpan>
              </TreeLink>
              <Popper visible={descriptions[currentIndex]} role={item.name}>
                {item.description}
              </Popper>

              {item.children && renderTree(item.children, currentIndex)}
            </TreeLi>
          );
        })}
      </TreeUl>
    );
  };

  return (
    <Container>
      <Tree>{renderTree(data)}</Tree>
    </Container>
  );
};
BinaryTree.propTypes = {
  data: PropTypes.array.isRequired
};
export default BinaryTree;
