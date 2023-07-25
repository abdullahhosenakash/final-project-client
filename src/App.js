import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Authentication/Login/Login';
import SignUp from './Pages/Authentication/SignUp/SignUp';
import Home from './Pages/Home/Home';
import NotFound from './Pages/NotFound/NotFound';
import PasswordReset from './Pages/Authentication/PasswordReset/PasswordReset';
import { Toaster } from 'react-hot-toast';
import RequireAuth from './Pages/Authentication/RequireAuth/RequireAuth';
import AvailableArticles from './Pages/AvailableArticles/AvailableArticles';
import Article from './Pages/Article/Article';
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Pages/Profile/Profile';
import NewMenuScript from './Pages/NewMenuScript.js/NewMenuScript';
import Drafts from './Pages/Drafts/Drafts';
import PreviewMenuscript from './Pages/NewMenuScript.js/PreviewMenuscript';

function App() {
  return (
    <div className='flex'>
      {/* <Header /> */}
      <Dashboard />
      <div className='absolute left-[30%] right-0 inset-y-0 p-[1%]'>
        <Routes>
          <Route
            path='/'
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/resetPassword' element={<PasswordReset />} />

          <Route
            path='/newMenuscript'
            element={
              <RequireAuth>
                <NewMenuScript />
              </RequireAuth>
            }
          />
          <Route
            path='/newMenuscript/preview'
            element={
              <RequireAuth>
                <PreviewMenuscript />
              </RequireAuth>
            }
          />
          <Route
            path='/availableArticles'
            element={
              <RequireAuth>
                <AvailableArticles />
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
            path='/availableArticles/:id'
            element={
              <RequireAuth>
                <Article />
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
