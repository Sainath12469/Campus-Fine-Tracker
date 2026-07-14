import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home';
import PrivateRoute from './PrivateRoute';
import Admin from './pages/Admin';
import Student from './pages/Student';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
          <Route path="/student/:studentId" element={<Student />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;