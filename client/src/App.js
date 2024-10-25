import './App.css';
import Home from './components/home/Home';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom';

function App() {
  return (
    <Router>
        <div className='App'>
          <Header/>
          <Routes>
            <Route path="/" element={Home} exact/>
          </Routes>
          <Footer/>
        </div>
    </Router>
  );
}

export default App;
