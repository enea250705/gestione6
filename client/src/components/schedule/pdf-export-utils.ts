// Mappa per convertire i giorni della settimana in italiano a inglese
const italianToEnglish: Record<string, string> = {
  "lunedì": "Monday",
  "martedì": "Tuesday",
  "mercoledì": "Wednesday",
  "giovedì": "Thursday",
  "venerdì": "Friday",
  "sabato": "Saturday",
  "domenica": "Sunday",
  // Versioni senza accento
  "lunedi": "Monday",
  "martedi": "Tuesday",
  "mercoledi": "Wednesday",
  "giovedi": "Thursday",
  "venerdi": "Friday"
  // "sabato" e "domenica" sono già presenti sopra e non hanno accenti
}; 

import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Shift } from '@/types/schema';

// Define Employee type here since it's not in the schema
export interface Employee {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

// Define types
export interface Schedule {
  id: number;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

// Re-export types
export type { Shift };

/**
 * Generates a PDF file for the schedule and downloads it
 */
export async function exportScheduleToPdf(
  schedule: Schedule,
  shifts: Shift[],
  employees: Employee[]
): Promise<void> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set document properties
  doc.setProperties({
    title: `Turni ${format(new Date(schedule.startDate), 'dd/MM/yyyy')} - ${format(new Date(schedule.endDate), 'dd/MM/yyyy')}`,
    author: 'Da Vittorino Gestione',
    creator: 'Da Vittorino Gestione',
    subject: 'Pianificazione Turni',
  });
  
  // Add header
  doc.setFontSize(18);
  doc.text('Pianificazione Turni Settimanali', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(
    `${format(new Date(schedule.startDate), 'd MMMM', { locale: it })} - ${format(new Date(schedule.endDate), 'd MMMM yyyy', { locale: it })}`,
    doc.internal.pageSize.getWidth() / 2,
    22,
    { align: 'center' }
  );
  
  // Add legend
  doc.setFontSize(8);
  doc.text('Legenda:', 14, 30);
  doc.setDrawColor(0);
  
  // Work shift
  doc.setFillColor(230, 247, 255);
  doc.rect(14, 32, 5, 5, 'F');
  doc.text('X = In servizio', 21, 36);
  
  // Vacation
  doc.setFillColor(246, 255, 237);
  doc.rect(45, 32, 5, 5, 'F');
  doc.text('F = Ferie', 52, 36);
  
  // Leave
  doc.setFillColor(255, 242, 232);
  doc.rect(75, 32, 5, 5, 'F');
  doc.text('P = Permesso', 82, 36);
  
  // Calculate days of the week
  const startDate = new Date(schedule.startDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date,
      name: format(date, 'EEEE', { locale: it }),
      formattedDate: format(date, 'dd/MM')
    };
  });
  
  // Prepare table headers
  const headers = [
    'Dipendente',
    ...weekDays.map(day => `${day.name.charAt(0).toUpperCase() + day.name.slice(1)}\n${day.formattedDate}`),
    'Ore Totali'
  ];
  
  // Prepare table data
  const tableData = employees
    .filter(employee => employee.isActive !== false)
    .map(employee => {
      const employeeName = employee.name || `${employee.firstName} ${employee.lastName}`;
      const employeeId = employee.id;
      let totalHours = 0;
      
      // Create a row for each employee
      const row = [employeeName];
      
      // Add a cell for each day
      weekDays.forEach(day => {
        // Find shifts for this employee on this day
        const dayShifts = shifts.filter(shift => {
          const shiftEmployeeId = shift.employeeId || shift.userId;
          if (shiftEmployeeId !== employeeId) return false;
          
          // Check if the shift is for this day
          if (shift.date) {
            const shiftDate = new Date(shift.date);
            return shiftDate.toDateString() === day.date.toDateString();
          } else if (shift.day) {
            // Compare day names
            return shift.day.toLowerCase().includes(day.name.toLowerCase().substring(0, 3));
          }
          return false;
        });
        
        // Calculate hours for this day
        let dayHours = 0;
        let cellContent = '';
        let cellStyles = {};
        
        if (dayShifts.length > 0) {
          // Check shift types
          const hasWork = dayShifts.some(s => s.type === 'work');
          const hasVacation = dayShifts.some(s => s.type === 'vacation');
          const hasLeave = dayShifts.some(s => s.type === 'leave');
          
          if (hasWork) {
            // Calculate hours for work shifts
            dayShifts.filter(s => s.type === 'work').forEach(shift => {
              // Extract hours from start and end times
              const [startHour, startMinute] = shift.startTime.split(':').map(Number);
              const [endHour, endMinute] = shift.endTime.split(':').map(Number);
              
              // Calculate total minutes
              let startMinutes = startHour * 60 + startMinute;
              let endMinutes = endHour * 60 + endMinute;
              
              // Handle overnight shifts
              if (endMinutes < startMinutes) {
                endMinutes += 24 * 60;
              }
              
              // Calculate hours and add to total
              const hours = (endMinutes - startMinutes) / 60;
              dayHours += hours;
              totalHours += hours;
            });
            
            cellContent = `X (${dayHours.toFixed(1)}h)`;
            cellStyles = { fillColor: [230, 247, 255] };
          } else if (hasVacation) {
            cellContent = 'F';
            cellStyles = { fillColor: [246, 255, 237] };
          } else if (hasLeave) {
            cellContent = 'P';
            cellStyles = { fillColor: [255, 242, 232] };
          }
        }
        
        // Add cell to row with content and styles
        row.push(cellContent); // just the string
      });
      
      // Add total hours cell
      row.push(`${totalHours.toFixed(1)}h`);
      
      return row;
    });
  
  // Add table to document
  (doc as any).autoTable({
    head: [headers],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      [headers.length - 1]: { fontStyle: 'bold', halign: 'center' },
    },
  });
  
  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Generato il ${format(new Date(), 'd MMMM yyyy HH:mm', { locale: it })} - Pagina ${i} di ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const filename = `turni_${format(new Date(schedule.startDate), 'dd-MM-yyyy')}_${format(new Date(schedule.endDate), 'dd-MM-yyyy')}.pdf`;
  doc.save(filename);
} 