import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function exportData(data: any[], format: 'csv' | 'excel' | 'pdf', filename: string) {
  switch (format) {
    case 'csv':
      const csv = Papa.unparse(data);
      const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, `${filename}.csv`);
      break;

    case 'excel':
      const excelData = Papa.unparse(data);
      const excelBlob = new Blob([excelData], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      saveAs(excelBlob, `${filename}.xls`);
      break;

    case 'pdf':
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text(filename, 14, 15);
      
      // Add timestamp
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

      // Convert data to table format
      const headers = Object.keys(data[0]);
      const rows = data.map(item => Object.values(item));

      // Add table
      (doc as any).autoTable({
        head: [headers],
        body: rows,
        startY: 30,
        margin: { top: 30 }
      });

      doc.save(`${filename}.pdf`);
      break;
  }
}

export function downloadFile(url: string, filename: string) {
  saveAs(url, filename);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function generateSearchQuery(filters: Record<string, any>): string {
  return Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${value.join(',')}`;
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');
}