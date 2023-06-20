import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Authentication/Login/Login';
import SignUp from './Pages/Authentication/SignUp/SignUp';
import Header from './Pages/Header/Header';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import PasswordReset from './Pages/Authentication/PasswordReset/PasswordReset';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/resetPassword' element={<PasswordReset />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
