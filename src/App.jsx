import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Portfolios from './pages/Portfolios';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/portfolios" element={<Portfolios />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;