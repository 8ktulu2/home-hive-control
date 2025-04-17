
import { Property } from '@/types/property';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Apartamento Centro',
    address: 'Calle Mayor 10, 3B, Madrid',
    image: '/placeholder.svg',
    rent: 850,
    rentPaid: true,
    expenses: 220,
    netIncome: 630,
    cadastralReference: '1234567890123456789AB',
    insuranceCompany: 'Mapfre',
    communityManager: 'Administraciones García',
    waterProvider: 'Canal Isabel II',
    electricityProvider: 'Iberdrola',
    ibi: 350,
    tenants: [
      {
        id: '1',
        name: 'Ana López',
        phone: '600123456',
        email: 'ana.lopez@email.com',
        identificationNumber: '12345678A'
      }
    ],
    mortgage: {
      bank: 'BBVA',
      monthlyPayment: 450,
      endDate: '2040-05-15'
    },
    documents: [
      {
        id: '1',
        name: 'Contrato de Alquiler',
        type: 'pdf',
        url: '#',
        uploadDate: '2023-01-15'
      },
      {
        id: '2',
        name: 'Seguro del Hogar',
        type: 'pdf',
        url: '#',
        uploadDate: '2023-02-10'
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Revisar caldera',
        description: 'Llamar al técnico para revisión anual',
        completed: false,
        dueDate: '2025-05-20'
      },
      {
        id: '2',
        title: 'Pintar salón',
        description: 'Pintura blanca para paredes',
        completed: true,
        dueDate: '2025-03-10'
      }
    ]
  },
  {
    id: '2',
    name: 'Chalet Alameda',
    address: 'Avda. Alameda 25, Pozuelo, Madrid',
    image: '/placeholder.svg',
    rent: 1500,
    rentPaid: false,
    expenses: 450,
    netIncome: 1050,
    cadastralReference: '9876543210987654321CD',
    insuranceCompany: 'AXA',
    communityManager: 'Fincas Hernández',
    waterProvider: 'Canal Isabel II',
    electricityProvider: 'Endesa',
    ibi: 780,
    tenants: [
      {
        id: '2',
        name: 'Pedro Gómez',
        phone: '600789012',
        email: 'pedro.gomez@email.com',
        identificationNumber: '87654321B'
      },
      {
        id: '3',
        name: 'Sara Martín',
        phone: '600456789',
        email: 'sara.martin@email.com',
        identificationNumber: '23456789C'
      }
    ],
    mortgage: {
      bank: 'Santander',
      monthlyPayment: 850,
      endDate: '2042-08-20'
    },
    documents: [
      {
        id: '3',
        name: 'Contrato de Alquiler',
        type: 'pdf',
        url: '#',
        uploadDate: '2024-01-20'
      }
    ],
    tasks: [
      {
        id: '3',
        title: 'Arreglar jardín',
        description: 'Contactar con jardinero para poda',
        completed: false,
        dueDate: '2025-05-30'
      }
    ]
  },
  {
    id: '3',
    name: 'Estudio Plaza',
    address: 'Plaza Mayor 3, 1A, Toledo',
    image: '/placeholder.svg',
    rent: 600,
    rentPaid: true,
    expenses: 150,
    netIncome: 450,
    cadastralReference: '5678901234567890123EF',
    insuranceCompany: 'Allianz',
    communityManager: 'Fincas Toledo',
    waterProvider: 'Aguas de Toledo',
    electricityProvider: 'Naturgy',
    ibi: 220,
    tenants: [
      {
        id: '4',
        name: 'Miguel Ruiz',
        phone: '600234567',
        email: 'miguel.ruiz@email.com',
        identificationNumber: '34567890D'
      }
    ],
    documents: [
      {
        id: '4',
        name: 'Contrato de Alquiler',
        type: 'pdf',
        url: '#',
        uploadDate: '2023-09-01'
      }
    ],
    tasks: []
  }
];
