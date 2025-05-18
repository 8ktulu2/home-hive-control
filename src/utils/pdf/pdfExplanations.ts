
import jsPDF from 'jspdf';
import { addSectionTitle } from './pdfCommonUtils';

/**
 * Adds detailed explanations about tax deductions
 */
export const addDetailedExplanations = (doc: jsPDF, y: number) => {
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text("Guía Detallada para la Declaración de la Renta", 105, y, { align: 'center' });
  y += 10;
  
  // Add explanations for each expense type
  const explanations = [
    {
      title: "Amortización del Inmueble (3%)",
      content: "La amortización del inmueble es uno de los gastos más importantes a nivel fiscal para el propietario. Se calcula aplicando un 3% anual sobre el mayor de estos valores: (1) el valor catastral de la construcción (excluyendo el valor del suelo), o (2) el coste de adquisición de la construcción (también excluyendo el suelo). Es fundamental entender que SOLO se amortiza la construcción, nunca el suelo, ya que este no se deteriora con el tiempo. Para calcular correctamente esta amortización, debe disponer del valor catastral desglosado entre suelo y construcción (disponible en el recibo del IBI o solicitándolo al Catastro). Si utiliza el coste de adquisición, debe aplicar el porcentaje que corresponde a la construcción según la escritura o, en su defecto, un porcentaje estimado basado en la zona (en áreas urbanas suele oscilar entre el 60-80% para la construcción). Esta amortización es deducible aunque no represente un desembolso real de dinero."
    },
    {
      title: "Amortización del Mobiliario (10%)",
      content: "El mobiliario y los enseres del inmueble se amortizan a un ritmo del 10% anual sobre su valor de adquisición. A diferencia del inmueble, el mobiliario se amortiza completamente, no hay valor residual. Es imprescindible conservar las facturas de compra de todos los elementos amortizables como prueba ante una posible inspección fiscal. Se consideran elementos amortizables: muebles, electrodomésticos (lavadora, nevera, horno, etc.), instalaciones no fijas (aire acondicionado portátil), equipos electrónicos, menaje, cortinas, alfombras, etc. La amortización se calcula de forma lineal durante la vida útil estimada de cada elemento, que Hacienda establece en 10 años para el mobiliario general. Si el elemento estuviera parcialmente amortizado antes de destinarlo al alquiler, sólo podrá amortizar la parte pendiente. Los elementos de poco valor (menos de 300€) pueden amortizarse íntegramente en el año de adquisición."
    },
    {
      title: "IBI (Impuesto sobre Bienes Inmuebles)",
      content: "El IBI es 100% deducible en el rendimiento del capital inmobiliario. Debe conservar el recibo de pago a nombre del propietario como justificante. Si hay varios propietarios, cada uno puede deducir la parte proporcional según su porcentaje de propiedad."
    },
    {
      title: "Intereses de Préstamos",
      content: "Solo son deducibles los intereses (no la amortización del capital). Debe solicitar a su banco un certificado anual que detalle la parte correspondiente a intereses. Los intereses están limitados junto con los gastos de conservación y reparación a los ingresos íntegros."
    },
    {
      title: "Gastos de Comunidad",
      content: "Las cuotas de comunidad de propietarios son completamente deducibles. Conserve los recibos o certificado del administrador. Incluyen gastos como portería, limpieza, ascensor, etc."
    },
    {
      title: "Gastos de Reparación y Conservación",
      content: "Son deducibles los gastos para mantener el inmueble en condiciones normales de uso. No son deducibles las ampliaciones o mejoras. Estos gastos junto con los intereses del préstamo están limitados a los ingresos íntegros."
    },
    {
      title: "Seguros de Hogar",
      content: "Son deducibles las primas de seguros del inmueble (continente y contenido). También son deducibles los seguros de responsabilidad civil y defensa jurídica relacionados con el inmueble."
    },
    {
      title: "Gastos de Formalización",
      content: "Honorarios de abogados, notaría, registro, etc. relacionados con el contrato de alquiler son deducibles. También los gastos de agencia inmobiliaria por buscar inquilino."
    },
  ];
  
  // Add reduction explanations
  const reductionExplanations = [
    {
      title: "Reducción General del 50%",
      content: "Aplicable a todos los alquileres de viviendas que sean residencia habitual del inquilino. Esta reducción se aplica sobre el rendimiento neto (ingresos menos gastos deducibles)."
    },
    {
      title: "Reducción del 60%",
      content: "Para viviendas rehabilitadas en los últimos 2 años y destinadas al alquiler como vivienda habitual. Se exige que las obras mejoren la eficiencia energética."
    },
    {
      title: "Reducción del 70%",
      content: "Para alquileres a jóvenes (18-35 años) en zonas de mercado residencial tensionado, siempre que sea su vivienda habitual. Es necesario tener documentado que el inquilino está en ese rango de edad."
    },
    {
      title: "Reducción del 90%",
      content: "Para viviendas en zonas tensionadas con rebaja de renta de al menos un 5% respecto al contrato anterior. Se debe poder documentar esta reducción con los contratos anteriores y actuales."
    }
  ];

  // Gastos deducibles
  y = addSectionTitle(doc, "GASTOS DEDUCIBLES: DETALLE Y JUSTIFICACIÓN", y);
  
  explanations.forEach(exp => {
    doc.setFillColor(245, 245, 250);
    doc.rect(25, y, 160, 8, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text(exp.title, 30, y + 5);
    doc.setFont(undefined, 'normal');
    
    y += 10;
    
    const contentLines = doc.splitTextToSize(exp.content, 150);
    doc.setTextColor(80, 80, 80);
    doc.text(contentLines, 30, y);
    
    y += (contentLines.length * 5) + 8;
  });
  
  // Check if need a new page
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  
  // Reducciones fiscales
  y = addSectionTitle(doc, "REDUCCIONES FISCALES: REQUISITOS Y APLICACIÓN", y);
  
  reductionExplanations.forEach(exp => {
    doc.setFillColor(245, 245, 250);
    doc.rect(25, y, 160, 8, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text(exp.title, 30, y + 5);
    doc.setFont(undefined, 'normal');
    
    y += 10;
    
    const contentLines = doc.splitTextToSize(exp.content, 150);
    doc.setTextColor(80, 80, 80);
    doc.text(contentLines, 30, y);
    
    y += (contentLines.length * 5) + 8;
  });
  
  // Final advice
  y += 5;
  doc.setFillColor(235, 245, 251);
  doc.rect(25, y, 160, 25, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(41, 128, 185);
  doc.setFont(undefined, 'bold');
  doc.text("RECOMENDACIÓN IMPORTANTE:", 30, y + 6);
  doc.setFont(undefined, 'normal');
  
  const adviceText = "Conserve todos los justificantes (facturas, recibos, certificados bancarios) durante al menos 4 años, que es el plazo de prescripción fiscal. La reducción por alquiler de vivienda habitual requiere que conste expresamente en el contrato que se destina a tal fin. Considere consultar con un asesor fiscal para optimizar su declaración.";
  const adviceLines = doc.splitTextToSize(adviceText, 150);
  doc.text(adviceLines, 30, y + 12);
  
  return y + 30;
};
