import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Authentication/Login/Login';
import SignUp from './Pages/Authentication/SignUp/SignUp';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import PasswordReset from './Pages/Authentication/PasswordReset/PasswordReset';
import { Toaster } from 'react-hot-toast';
import RequireAuth from './Pages/Authentication/RequireAuth/RequireAuth';
import ManuscriptsAsCoAuthor from './Pages/ManuscriptsAsCoAuthor/ManuscriptsAsCoAuthor';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import Drafts from './Pages/Drafts/Drafts';
import PreviewManuscript from './Pages/NewManuscript/PreviewManuscript';
import ManuscriptsAsReviewer from './Pages/ManuscriptsAsReviewer/ManuscriptsAsReviewer';
import NewManuscript from './Pages/NewManuscript/NewManuscript';

function App() {
  return (
    <div className='flex'>
      {/* <Header /> */}
      <Dashboard />
      <div className='absolute left-[30%] right-0 inset-y-0 p-[1%]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/resetPassword' element={<PasswordReset />} />

          <Route
            path='/newManuscript'
            element={
              <RequireAuth>
                <NewManuscript />
              </RequireAuth>
            }
          />
          <Route
            path='/newManuscript/preview'
            element={
              <RequireAuth>
                <PreviewManuscript />
              </RequireAuth>
            }
          />
          <Route
            path='/manuscriptsAsCoAuthor'
            element={
              <RequireAuth>
                <ManuscriptsAsCoAuthor />
              </RequireAuth>
            }
          />

          <Route
            path='/manuscriptsAsCoAuthor/reviseManuscript'
            element={
              <RequireAuth>
                <NewManuscript />
              </RequireAuth>
            }
          />
          <Route
            path='/manuscriptsAsReviewer'
            element={
              <RequireAuth>
                <ManuscriptsAsReviewer />
              </RequireAuth>
            }
          />
          <Route
            path='/drafts'
            element={
              <RequireAuth>
                <Drafts />
              </RequireAuth>
            }
          />
          <Route
            path='/profile'
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster containerStyle={{ position: 'absolute' }} />
      </div>
    </div>
  );
}

export default App;
