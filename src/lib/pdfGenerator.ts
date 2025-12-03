import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BillingSummary, MEAL_NAMES, MESS_CONFIG } from '@/types';
import { format } from 'date-fns';

// Generate PDF invoice for a billing summary
export function generateInvoicePDF(summary: BillingSummary): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor: [number, number, number] = [249, 115, 22]; // Orange
  const textColor: [number, number, number] = [51, 51, 51];
  
  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(MESS_CONFIG.name, 14, 20);
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Monthly Invoice', 14, 30);
  doc.text(MESS_CONFIG.contact, pageWidth - 14, 20, { align: 'right' });
  doc.text(MESS_CONFIG.address, pageWidth - 14, 30, { align: 'right' });
  
  // Invoice details section
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  
  const monthName = format(new Date(summary.year, parseInt(summary.month) - 1, 1), 'MMMM yyyy');
  
  // Student info box
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, 55, pageWidth - 28, 45, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 65);
  doc.setFont('helvetica', 'normal');
  doc.text(summary.student.name, 20, 73);
  doc.text(`Phone: ${summary.student.phone}`, 20, 81);
  if (summary.student.email) {
    doc.text(`Email: ${summary.student.email}`, 20, 89);
  }
  
  // Invoice period
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Period:', pageWidth - 80, 65);
  doc.setFont('helvetica', 'normal');
  doc.text(monthName, pageWidth - 80, 73);
  doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy')}`, pageWidth - 80, 81);
  
  // Meal details table
  const tableData = summary.meals.map(meal => [
    format(new Date(meal.meal_date), 'dd MMM yyyy'),
    MEAL_NAMES[meal.meal_type],
    `₹${meal.amount}`,
  ]);
  
  autoTable(doc, {
    startY: 110,
    head: [['Date', 'Meal Type', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252],
    },
  });
  
  // Summary section
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Summary box
  doc.setFillColor(255, 247, 237);
  doc.roundedRect(pageWidth - 100, finalY, 86, 65, 3, 3, 'F');
  doc.setDrawColor(...primaryColor);
  doc.roundedRect(pageWidth - 100, finalY, 86, 65, 3, 3, 'S');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', pageWidth - 95, finalY + 12);
  
  doc.setFont('helvetica', 'normal');
  let summaryY = finalY + 22;
  
  (['mini', 'full', 'special'] as const).forEach(type => {
    if (summary.mealCounts[type] > 0) {
      doc.text(`${MEAL_NAMES[type]}:`, pageWidth - 95, summaryY);
      doc.text(`${summary.mealCounts[type]} × ₹${type === 'mini' ? 80 : type === 'full' ? 95 : 110}`, pageWidth - 30, summaryY, { align: 'right' });
      summaryY += 8;
    }
  });
  
  // Total
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 95, summaryY + 2, pageWidth - 19, summaryY + 2);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Total:', pageWidth - 95, summaryY + 12);
  doc.text(`₹${summary.totalAmount}`, pageWidth - 19, summaryY + 12, { align: 'right' });
  
  // QR Code placeholder and UPI info
  if (MESS_CONFIG.upiId) {
    const qrY = finalY;
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Info', 14, qrY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`UPI ID: ${MESS_CONFIG.upiId}`, 14, qrY + 15);
    doc.text('Scan QR or use UPI ID to pay', 14, qrY + 23);
    
    // QR placeholder box
    doc.setFillColor(240, 240, 240);
    doc.rect(14, qrY + 28, 50, 50, 'F');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('QR Code', 28, qrY + 55);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for choosing ' + MESS_CONFIG.name, pageWidth / 2, footerY, { align: 'center' });
  doc.text('This is a computer-generated invoice', pageWidth / 2, footerY + 8, { align: 'center' });
  
  return doc;
}

// Download PDF
export function downloadInvoice(summary: BillingSummary) {
  const doc = generateInvoicePDF(summary);
  const fileName = `Invoice_${summary.student.name.replace(/\s+/g, '_')}_${summary.month}_${summary.year}.pdf`;
  doc.save(fileName);
}
