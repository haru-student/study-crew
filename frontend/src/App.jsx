import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Meetups from './Meetups';
import Chat from './Chat';
import Newsession from './Newsession';
import EditProfile from './EditProfile';
import Detail from './Detail';
import Blog from './Blog';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Members from './Members';
import Profile from './Profile';
import Terms from './Terms';
import { IpProvider } from "./IpContext";
import TermsOfUse from './TermsOfUse';
import Privacy from './Privacy';

function App() {
  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <IpProvider>
        <div className="d-flex flex-column vh-100">
          <Header user={user} />
          <ToastContainer />
          <main className="flex-grow-1 main-container">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/meetsup" element={<Meetups user={user} />} /> 
              <Route path="/chatgroup" element={<Chat user={user} />} /> 
              <Route path="/createsession" element={<Newsession user={user}/>} /> 
              <Route path="/editprofile" element={<EditProfile user={user}/>} />
              <Route path={`/detail/:id`} element={<Detail user={user}/>} />
              <Route path={`/chat/:id`} element={<Chat user={user}/>} />
              <Route path={`/blog/:id`} element={<Blog user={user}/>} />
              <Route path={`/members/:id`} element={<Members user={user}/>} />
              <Route path={`/profile/:id`} element={<Profile user={user}/>} />
              <Route path="/agreement" element={<Terms user={user}/>} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </IpProvider>
    </BrowserRouter>
  );
}

export default App;
