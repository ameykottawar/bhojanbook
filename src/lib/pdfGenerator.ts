import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BillingSummary, MEAL_NAMES, getMessConfig } from '@/types';
import { format } from 'date-fns';

// Generate PDF invoice for a billing summary - Simplified one-page layout
export function generateInvoicePDF(summary: BillingSummary): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const messConfig = getMessConfig();
  
  // Colors
  const primaryColor: [number, number, number] = [249, 115, 22]; // Orange
  const textColor: [number, number, number] = [51, 51, 51];
  
  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Mess Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(messConfig.name, 14, 18);
  
  // Mess contact details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(messConfig.address, 14, 28);
  doc.text(`Contact: ${messConfig.contact}`, 14, 35);
  
  // Invoice label
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 14, 20, { align: 'right' });
  
  const monthName = format(new Date(summary.year, parseInt(summary.month) - 1, 1), 'MMMM yyyy');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(monthName, pageWidth - 14, 28, { align: 'right' });
  doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy')}`, pageWidth - 14, 35, { align: 'right' });
  
  // Bill To section
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 52);
  
  doc.setFont('helvetica', 'normal');
  doc.text(summary.student.name, 14, 59);
  doc.text(`Phone: ${summary.student.phone}`, 14, 66);
  if (summary.student.email) {
    doc.text(`Email: ${summary.student.email}`, 14, 73);
  }
  
  // Meal details table - Compact
  const tableData = summary.meals.map(meal => {
    const addonsText = meal.addons && meal.addons.length > 0
      ? meal.addons.map(a => `${a.name}×${a.quantity}`).join(', ')
      : '-';
    const notesText = meal.notes || '-';
    
    return [
      format(new Date(meal.meal_date), 'dd MMM'),
      MEAL_NAMES[meal.meal_type],
      addonsText,
      notesText.length > 20 ? notesText.substring(0, 20) + '...' : notesText,
      `₹${meal.amount}`,
    ];
  });
  
  autoTable(doc, {
    startY: 82,
    head: [['Date', 'Meal', 'Add-ons', 'Notes', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3,
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 28 },
      2: { cellWidth: 45 },
      3: { cellWidth: 50 },
      4: { cellWidth: 22, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252],
    },
    margin: { left: 14, right: 14 },
    // Ensure table fits on one page
    pageBreak: 'avoid',
  });
  
  // Summary section - Right aligned
  const finalY = Math.min((doc as any).lastAutoTable.finalY + 10, 220);
  
  // Summary box
  doc.setFillColor(255, 247, 237);
  doc.roundedRect(pageWidth - 90, finalY, 76, 55, 2, 2, 'F');
  doc.setDrawColor(...primaryColor);
  doc.roundedRect(pageWidth - 90, finalY, 76, 55, 2, 2, 'S');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('Summary', pageWidth - 85, finalY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let summaryY = finalY + 18;
  
  (['mini', 'full', 'special'] as const).forEach(type => {
    if (summary.mealCounts[type] > 0) {
      doc.text(`${MEAL_NAMES[type]}:`, pageWidth - 85, summaryY);
      doc.text(`${summary.mealCounts[type]}`, pageWidth - 20, summaryY, { align: 'right' });
      summaryY += 6;
    }
  });
  
  if (summary.addonsTotal > 0) {
    doc.text('Add-ons Total:', pageWidth - 85, summaryY);
    doc.text(`₹${summary.addonsTotal}`, pageWidth - 20, summaryY, { align: 'right' });
    summaryY += 6;
  }
  
  // Total line
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 85, summaryY + 1, pageWidth - 19, summaryY + 1);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Total:', pageWidth - 85, summaryY + 9);
  doc.text(`₹${summary.totalAmount}`, pageWidth - 20, summaryY + 9, { align: 'right' });
  
  // Payment Info - Left side
  if (messConfig.upiId) {
    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Info', 14, finalY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`UPI ID: ${messConfig.upiId}`, 14, finalY + 13);
    
    // QR placeholder
    doc.setFillColor(245, 245, 245);
    doc.rect(14, finalY + 18, 35, 35, 'F');
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text('QR Code', 24, finalY + 38);
  }
  
  // Footer - at bottom of page
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Thank you for choosing ${messConfig.name}`, pageWidth / 2, footerY, { align: 'center' });
  doc.text('This is a computer-generated invoice', pageWidth / 2, footerY + 6, { align: 'center' });
  
  return doc;
}

// Download PDF
export function downloadInvoice(summary: BillingSummary) {
  const doc = generateInvoicePDF(summary);
  const fileName = `Invoice_${summary.student.name.replace(/\s+/g, '_')}_${summary.month}_${summary.year}.pdf`;
  doc.save(fileName);
}
