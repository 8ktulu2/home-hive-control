import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import PropertyEdit from './pages/PropertyEdit';
import DuplicateProperty from './pages/DuplicateProperty';
import Historicos from './pages/Historicos';
import HistoricalPropertyView from './pages/HistoricalPropertyView';
import { Toaster } from 'sonner';
import { QueryClient } from 'react-query';
import HistoricalPropertyEdit from './pages/HistoricalPropertyEdit';

function App() {
  return (
    <Router>
      <QueryClient>
        <Routes>
          <Route path="/" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/property/edit/:id" element={<PropertyEdit />} />
          <Route path="/property/:id/duplicate" element={<DuplicateProperty />} />
          <Route path="/historicos" element={<Historicos />} />
          <Route path="/historicos/property/:propertyId/:year" element={<HistoricalPropertyView />} />
          <Route path="/historicos/property/:id/:year/edit" element={<HistoricalPropertyEdit />} />
        </Routes>
        <Toaster />
      </QueryClient>
    </Router>
  );
}

export default App;
