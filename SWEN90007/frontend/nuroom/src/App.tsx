import './App.css';
import { Navigate } from 'react-router-dom';

function App() {
  let token = sessionStorage.getItem("customerInfo")
  
  return (
    <div className='App'>
      <Navigate to='/homepage' />
      {/* {token ? <Navigate to='/homepage' />: <Navigate to='/loginpage' />} */}
    </div>
  );
}

export default App;
