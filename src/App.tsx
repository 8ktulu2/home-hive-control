
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';  // Fixed import path
import Finances from './pages/Finances';
import PropertyDetail from './pages/PropertyDetail';
import PropertyEdit from './pages/PropertyEdit';
import Documents from './pages/Documents';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';
import './App.css';
import Historical from './pages/historical';
import FiscalReport from './pages/fiscal-report/FiscalReport';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/property/:propertyId" element={<PropertyDetail />} />
          <Route path="/property/:propertyId/edit" element={<PropertyEdit />} />
          <Route path="/property/new" element={<PropertyEdit />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/historical" element={<Historical />} /> 
          <Route path="/fiscal-report" element={<FiscalReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;
