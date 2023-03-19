import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: forestgreen;
`;

const BoardLayout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
  background-color: green;
`;

const CardLayout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
  box-shadow: 20px 20px darkgreen;
`;


const Row = styled.div`
  display: flex;
  justify-content: center;
`;

const Column = styled.div`
  flex: 33.33%;
  padding: 25px;
`;

export { Layout, BoardLayout, CardLayout, Row, Column };