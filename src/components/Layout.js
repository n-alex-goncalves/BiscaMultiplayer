import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Score = styled.div`
  font-weight: bold;
  right: 4vw;
  font-size: 20px;
  background-color: white;
  border: 3px solid #262722;
  justify-content: center;
  text-align: center;
`;

const CardGroup = styled.div`
  position: relative;
  z-index: auto;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  background-color: green;
  border-radius: 8px;
  display: block;
  overflow: visible;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 3px solid #262722;
  border-radius: 10px;
  margin: 0.25rem auto;
  box-shadow: 5px 5px;
  flex: 1;
  &:hover {
    transform: ${props => props.isPlayer ? 'translateY(-10px)' : 'none'};
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Row = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Column = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 16vw;
  padding: 8px;
  flex: 1;
`;

export { Layout, Score, CardGroup, CardContainer, CardImage, Row, Column };