import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import './App.css';
import socketConnection from './utilities/socketConnection'
import MainVideoPage from './videoComponents/MainVideoPage';
import ProDashboard from './siteComponents/ProDashBoard';
import ProMainVideoPage from './videoComponents/ProMainVideoPage'
const Home=()=><h1>Hi home hehre</h1>
function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route exact path='/' Component={Home}/>
    <Route exact path='/join-video' Component={MainVideoPage}/>
    <Route exact path='/dashboard' Component={ProDashboard}/>
    <Route exact path='/join-video-pro' Component={ProMainVideoPage}/>

  </Routes>

  </BrowserRouter>
    
  )
}

export default App;
