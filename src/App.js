import logo from './logo.svg';
import './App.css';
import CardGameBoard from './components/CardGameBoard'
import { Layout } from './components/layout';

function App() {
  return (
    <div className="App">
      <header>CARD GAME</header>
      <Layout>
      <CardGameBoard></CardGameBoard>
      </Layout>
    </div>
  );
}

export default App;
