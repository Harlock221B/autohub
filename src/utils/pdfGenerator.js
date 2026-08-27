import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateVehicleReport = (vehicle, logs, predictiveAlerts, autohubValue) => {
  const doc = new jsPDF();
  
  // Cores da marca
  const primaryColor = [239, 68, 68]; // Red 500
  const secondaryColor = [39, 39, 42]; // Zinc 800
  
  // Título / Header
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('AutoHub', 14, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Dossie de Manutencao e Venda', 14, 28);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);

  // Linha separadora
  doc.setDrawColor(200);
  doc.line(14, 38, 196, 38);

  // Informações do Veículo
  doc.setFontSize(12);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACOES DO VEICULO', 14, 48);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Marca/Modelo: ${vehicle.brand || ''} ${vehicle.model || ''}`, 14, 56);
  doc.text(`Ano: ${vehicle.manufactureYear || ''}/${vehicle.modelYear || ''}`, 14, 62);
  doc.text(`Placa: ${vehicle.plate ? vehicle.plate.toUpperCase() : ''}`, 14, 68);
  doc.text(`Hodometro: ${Number(vehicle.currentKm || 0).toLocaleString('pt-BR')} km`, 14, 74);
  
  // Coluna 2 de informações
  doc.text(`Cambio: ${vehicle.transmission || 'Nao informado'}`, 110, 56);
  doc.text(`Valor FIPE: ${vehicle.fipeValue || 'N/A'}`, 110, 62);
  doc.text(`Valor c/ Historico: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(autohubValue || 0)}`, 110, 68);
  
  if (vehicle.cautelar === 'Aprovado') {
      doc.setTextColor(16, 185, 129); // Emerald 500
      doc.setFont('helvetica', 'bold');
      doc.text('Laudo Cautelar: APROVADO', 110, 74);
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'normal');
  }

  let finalY = 88;

  // Manutenções Preditivas (O que deve ser feito)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('O QUE DEVE SER FEITO (Manutencao Preditiva)', 14, finalY);
  
  if (predictiveAlerts && predictiveAlerts.length > 0) {
    const alertBody = predictiveAlerts.map(alert => [
      alert.title, 
      alert.message, 
      alert.urgent ? 'ATENCAO/URGENTE' : 'EM DIA'
    ]);
    
    autoTable(doc, {
      startY: finalY + 6,
      head: [['Servico', 'Aviso / Previsao', 'Status']],
      body: alertBody,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] }, // Orange 500
      styles: { fontSize: 9 },
      columnStyles: {
        2: { fontStyle: 'bold' }
      },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 2) {
           if (data.cell.raw === 'ATENCAO/URGENTE') {
             data.cell.styles.textColor = [220, 38, 38]; // Red
           } else {
             data.cell.styles.textColor = [16, 185, 129]; // Green
           }
        }
      }
    });
    finalY = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Nenhum alerta de manutencao preditiva ativo.', 14, finalY + 8);
    finalY += 20;
  }

  // Histórico de Manutenção (O que foi feito)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...secondaryColor);
  doc.text('HISTORICO DE SERVICOS (O que foi feito)', 14, finalY);

  if (logs && logs.length > 0) {
    // Sort logs by date desc
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const tableBody = sortedLogs.map(log => [
      new Date(log.date).toLocaleDateString('pt-BR'),
      log.serviceType || 'Servico',
      `${Number(log.kmAtService || 0).toLocaleString('pt-BR')} km`,
      log.cost ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(log.cost) : '-',
      log.notes || '-'
    ]);

    autoTable(doc, {
      startY: finalY + 6,
      head: [['Data', 'Servico', 'Odometro', 'Custo', 'Anotacoes']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: primaryColor },
      styles: { fontSize: 9 },
    });
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Nenhum servico registrado no historico deste veiculo.', 14, finalY + 8);
  }

  // Rodapé
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      'Documento gerado pelo AutoHub - O historico inalteravel do seu veiculo.', 
      doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10, 
      { align: 'center' }
    );
  }

  // Save the PDF
  const plateSlug = vehicle.plate ? vehicle.plate.replace(/[^a-zA-Z0-9]/g, '') : 'Veiculo';
  doc.save(`Dossie_${plateSlug}_AutoHub.pdf`);
}

