
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import HistoricalData from '@/components/finances/historical/HistoricalData';
import { mockProperties } from '@/data/mockData';
import HistoricalHeader from './components/HistoricalHeader';
import InfoCards from './components/InfoCards';
import ImportDataModal from './components/ImportDataModal';
import IRPFGuideModal from './components/IRPFGuideModal';

const Historical = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handlePreviousYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
  };

  return (
    <Layout>
      <HistoricalHeader 
        openImportModal={() => setIsImportModalOpen(true)}
        openHelpModal={() => setIsHelpModalOpen(true)}
      />
      
      <InfoCards openHelpModal={() => setIsHelpModalOpen(true)} />

      <HistoricalData
        properties={mockProperties}
        selectedYear={selectedYear}
        onPreviousYear={handlePreviousYear}
        onNextYear={handleNextYear}
      />

      <ImportDataModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />

      <IRPFGuideModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </Layout>
  );
};

export default Historical;
