import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice, Client, User } from '@/types';

export interface PDFGenerationOptions {
  filename?: string;
  download?: boolean;
  preview?: boolean;
  quality?: number;
}

export class PDFGenerator {

  /**
   * Generate PDF from HTML element
   */
  static async generateFromElement(
    element: HTMLElement, 
    options: PDFGenerationOptions = {}
  ): Promise<jsPDF | void> {
    const {
      filename = 'invoice.pdf',
      download = true,
      preview = false,
      quality = 2
    } = options;

    try {
      console.log('Starting PDF generation from element:', element);
      
      // Ensure element is visible and has content
      if (!element || element.offsetHeight === 0) {
        throw new Error('Element is not visible or has no content');
      }
      
      console.log('Element dimensions:', { 
        width: element.offsetWidth, 
        height: element.offsetHeight,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight
      });
      
      // Generate canvas from HTML element
      const canvas = await html2canvas(element, {
        scale: quality,
        backgroundColor: '#ffffff',
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth,
        ignoreElements: (element) => {
          // Ignore elements that might cause issues
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE';
        },
        onclone: (clonedDoc) => {
          // Remove any problematic CSS that might cause parsing issues
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(style => {
            if (style.textContent && style.textContent.includes('lab(')) {
              style.remove();
            }
          });
          
          // Add fallback styles to ensure proper rendering
          const fallbackStyle = clonedDoc.createElement('style');
          fallbackStyle.textContent = `
            * {
              box-sizing: border-box;
              font-family: system-ui, -apple-system, sans-serif !important;
            }
            body {
              background: white !important;
              color: black !important;
            }
          `;
          clonedDoc.head.appendChild(fallbackStyle);
        }
      });
      
      console.log('Canvas generated:', { width: canvas.width, height: canvas.height });

      // Calculate PDF dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20; // Account for margins

      // Add additional pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }

      if (preview) {
        // Open PDF in new window for preview
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        return pdf;
      }

      if (download) {
        // Download PDF
        pdf.save(filename);
        return pdf;
      }

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Generate invoice PDF with proper filename
   */
  static async generateInvoicePDF(
    invoice: Invoice,
    client: Client,
    user: User,
    element: HTMLElement,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<jsPDF | void> {
    const filename = options.filename || this.generateInvoiceFilename(invoice, client);
    
    return this.generateFromElement(element, {
      ...options,
      filename,
    });
  }

  /**
   * Generate appropriate filename for invoice
   */
  static generateInvoiceFilename(invoice: Invoice, client: Client): string {
    const clientName = client.name.replace(/[^a-zA-Z0-9]/g, '_');
    const invoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    
    return `Invoice_${invoiceNumber}_${clientName}_${date}.pdf`;
  }

  /**
   * Generate PDF with watermark for draft invoices
   */
  static async generateDraftInvoicePDF(
    invoice: Invoice,
    client: Client,
    user: User,
    element: HTMLElement,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<jsPDF | void> {
    const pdf = await this.generateFromElement(element, { 
      ...options, 
      download: false 
    }) as jsPDF;

    if (!pdf) return;

    // Add watermark for draft invoices
    if (invoice.status === 'draft') {
      this.addWatermark(pdf, 'DRAFT');
    }

    const filename = options.filename || this.generateInvoiceFilename(invoice, client);
    
    if (options.preview) {
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else if (options.download !== false) {
      pdf.save(filename);
    }

    return pdf;
  }

  /**
   * Add watermark to PDF
   */
  static addWatermark(pdf: jsPDF, text: string): void {
    const pageCount = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(60);
      pdf.setTextColor(200, 200, 200, 0.3); // Light gray with transparency
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Center the watermark with rotation
      pdf.text(text, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45,
      });
    }
  }

  /**
   * Get PDF as base64 string for email attachment
   */
  static async generateInvoicePDFBase64(
    invoice: Invoice,
    client: Client,
    user: User,
    element: HTMLElement
  ): Promise<string> {
    const pdf = await this.generateFromElement(element, { download: false }) as jsPDF;
    
    if (!pdf) {
      throw new Error('Failed to generate PDF');
    }

    return pdf.output('datauristring');
  }

  /**
   * Generate and send PDF via email
   */
  static async emailInvoicePDF(
    invoice: Invoice,
    client: Client,
    user: User,
    element: HTMLElement
  ): Promise<void> {
    try {
      const pdfBase64 = await this.generateInvoicePDFBase64(invoice, client, user, element);
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'invoice',
          clientEmail: client.email,
          clientName: client.name,
          freelancerName: user.name,
          freelancerEmail: user.email,
          invoiceNumber: invoice.invoiceNumber,
          amount: this.formatCurrency(invoice.total, invoice.currency),
          dueDate: new Date(invoice.dueDate).toLocaleDateString(),
          companyName: user.brandSettings?.companyName,
          primaryColor: user.brandSettings?.primaryColor,
          secondaryColor: user.brandSettings?.secondaryColor,
          attachments: [{
            filename: this.generateInvoiceFilename(invoice, client),
            content: pdfBase64.split(',')[1], // Remove data:application/pdf;base64, prefix
            type: 'application/pdf'
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error emailing PDF:', error);
      throw new Error('Failed to email invoice PDF');
    }
  }

  /**
   * Format currency for email content
   */
  private static formatCurrency(amount: number, currency: string): string {
    const currencySymbols = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£',
      CAD: '$'
    };
    
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
    
    if (currency === 'INR') {
      return amount % 1 === 0 ? `${symbol}${amount.toLocaleString('en-IN')}` : `${symbol}${amount.toFixed(2)}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
  }
}