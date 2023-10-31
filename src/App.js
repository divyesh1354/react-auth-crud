import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import TaskList from './pages/TaskList';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login />}></Route>
        <Route exact path='/signup' element={<Registration />}></Route>
        <Route exact path="/dashboard" element={<TaskList />} />
      </Routes>
    </Router>
  );
}

export default App;
