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

function App() {
  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column vh-100">
        <Header user={user} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/meetsup" element={<Meetups user={user} />} /> 
            <Route path="/chatgroup" element={<Chat user={user} />} /> 
            <Route path="/createsession" element={<Newsession user={user} />} /> 
            <Route path="/editprofile" element={<EditProfile user={user}/>} />
            <Route path={`/detail/:id`} element={<Detail user={user}/>} />
            <Route path={`/chat/:id`} element={<Chat user={user}/>} />
            <Route path={`/blog/:id`} element={<Blog user={user}/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
