import './App.css';
import Sidebar from './Components/Sidebar/Sidebar';
import Chat from './Components/Chat/Chat'
import Login from './Components/Login/Login';
import { useSelector } from 'react-redux';

function App() {
  const { isLoggedIn } = useSelector(state => state.loggedInUser)
  // //console.log(data, isLoggedIn)
  return (
    <div className="app">
      {!isLoggedIn ? <Login />
        : <div className="app__body">
          <Sidebar />
          <Chat />

        </div>}
    </div>
  );
}

export default App;
