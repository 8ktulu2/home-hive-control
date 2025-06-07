
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import PropertyDetail from './pages/PropertyDetail';
import PropertyEdit from './pages/PropertyEdit';
import Historicos from './pages/Historicos';
import HistoricalPropertyView from './pages/HistoricalPropertyView';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HistoricalPropertyEdit from './pages/HistoricalPropertyEdit';
import { YearProvider } from './contexts/YearContext';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <YearProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/property/edit/:id" element={<PropertyEdit />} />
            <Route path="/historicos" element={<Historicos />} />
            <Route path="/historicos/property/:propertyId/:year" element={<HistoricalPropertyView />} />
            <Route path="/historicos/property/:id/:year/edit" element={<HistoricalPropertyEdit />} />
          </Routes>
          <Toaster />
        </YearProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
