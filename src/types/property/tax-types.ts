
export interface TaxInfo {
  // Información específica de la propiedad
  propertyType?: 'residencial' | 'comercial' | 'industrial' | 'terreno';
  propertyValue?: number; // Valor para cálculo de amortización (3%)
  furnitureValue?: number; // Valor del mobiliario para cálculo de amortización (10%)
  acquisitionCost?: number; // Coste de adquisición del inmueble
  landValue?: number; // Valor del suelo (no amortizable)
  
  // Elegibilidad para deducciones fiscales
  isPrimaryResidence?: boolean; // ¿Es la residencia principal del inquilino?
  isTensionedArea?: boolean; // ¿Está la propiedad en una zona de mercado tensionado?
  hasYoungTenant?: boolean; // ¿El inquilino tiene entre 18-35 años?
  rentReduction?: boolean; // ¿Se ha reducido el alquiler ≥5% respecto al contrato anterior?
  recentlyRenovated?: boolean; // ¿Se reformó la propiedad en los últimos 2 años?
  
  // Valores directos de deducción fiscal
  mortgageInterest?: number; // Intereses anuales de hipoteca (deducibles)
  totalMortgagePayment?: number; // Pago total anual de hipoteca (no deducible)
  subsidies?: number; // Subvenciones anuales recibidas
  otherIncome?: number; // Otros ingresos relacionados con la propiedad
  
  // Información fiscal regional
  autonomousCommunity?: string; // En qué comunidad autónoma está la propiedad
  regionalDeductions?: string[]; // Deducciones regionales aplicables
  
  // Gastos específicos anuales deducibles
  legalExpenses?: number; // Gastos jurídicos
  contractFormalizationExpenses?: number; // Gastos de formalización de contrato
  conservationExpenses?: number; // Gastos de conservación y reparación
  homeSuppliesExpenses?: number; // Gastos de suministros si los paga el propietario
}

export interface TaxReport {
  // Identificación básica de la propiedad
  propertyId: string;
  propertyName: string;
  taxYear: number;
  
  // Sección de ingresos
  rentalIncome: number; // Ingresos anuales por alquiler
  subsidies: number; // Subvenciones gubernamentales
  otherIncome: number; // Cualquier otro ingreso relacionado con la propiedad
  totalIncome: number; // Suma de todos los ingresos
  
  // Sección de gastos
  ibi: number; // Impuesto sobre Bienes Inmuebles (IBI)
  communityFees: number; // Cuotas de comunidad
  mortgageInterest: number; // Solo los intereses son deducibles, no el principal
  homeInsurance: number; // Costes del seguro del hogar
  maintenance: number; // Mantenimiento y reparaciones
  administrativeFees: number; // Gastos administrativos
  agencyFees: number; // Honorarios de agencia inmobiliaria
  propertyDepreciation: number; // 3% del valor de la propiedad (excluyendo el suelo)
  furnitureDepreciation: number; // 10% del valor del mobiliario
  utilities: number; // Suministros no recuperables
  municipalTaxes: number; // Impuestos municipales
  legalFees: number; // Gastos legales
  badDebts: number; // Deudas dudosas (alquileres impagados)
  otherExpenses: number; // Otros gastos deducibles
  totalExpenses: number; // Suma de todos los gastos
  
  // Resultados
  netProfit: number; // Ingresos totales - gastos totales
  applicableReduction: number; // Porcentaje de reducción (50%, 60%, 70%, o 90%)
  reducedNetProfit: number; // Beneficio neto después de la reducción
  
  // Explicación de la reducción
  reductionExplanation: string; // Por qué se aplica este porcentaje de reducción
  
  // Generado en
  generatedDate: string; // Cuándo se generó este informe
}
