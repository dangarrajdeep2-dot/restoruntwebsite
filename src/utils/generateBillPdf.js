import { jsPDF } from 'jspdf';

/**
 * Loads an image from a URL and converts it to a base64 data URL.
 * Gracefully resolves to null on error.
 */
function loadImageDataUrl(url) {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 200;
          canvas.height = img.naturalHeight || 200;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Generates an official, beautifully styled PDF document for an order.
 * Returns the jsPDF document instance.
 */
export async function createBillPdfDoc(order, settings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210 x 297 mm
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const restaurantName = (settings?.restaurant_name || 'Nandanvan Multicuisine Restaurant').toUpperCase();
  const restaurantAddress = settings?.address || 'Near Munjka, Kalawad Road, Rajkot, Gujarat 360005';
  const restaurantPhone = settings?.phone || '+91 98250 84721';
  const restaurantEmail = settings?.email || 'reservations@nandanvanrajkot.com';
  const gstRate = settings?.gst_rate ?? 5;
  const upiId = settings?.upi_id || 'nandanvan@oksbi';
  const upiName = settings?.upi_name || 'Nandanvan Multicuisine Restaurant';

  const items = order.items || order.order_items || [];
  const subtotal = order.subtotal || items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const gst = Math.round(subtotal * (gstRate / 100));
  const delivery = Number(order.delivery_charge || 0);
  const total = order.total || (subtotal + gst + delivery);

  // Top Accent Bar (Royal Forest & Gold)
  doc.setFillColor(14, 42, 31); // #0E2A1F Deep Forest
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(212, 162, 76); // #D4A24C Gold
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Restaurant Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(243, 199, 124); // Warm Gold
  doc.text(restaurantName, pageWidth / 2, 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(230, 230, 230);
  doc.text(`${restaurantAddress}  |  Tel: ${restaurantPhone}`, pageWidth / 2, 19, { align: 'center' });
  doc.text(`Official Tax Invoice  |  Email: ${restaurantEmail}`, pageWidth / 2, 24, { align: 'center' });

  // Invoice Title & Meta Box
  let y = 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(14, 42, 31);
  doc.text('TAX INVOICE / BILL', margin, y);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - margin, y, { align: 'right' });

  // Metadata Card Box
  y += 5;
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(220, 225, 230);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  const col1X = margin + 4;
  const col2X = margin + 65;
  const col3X = margin + 125;
  const metaY1 = y + 7;
  const metaY2 = y + 15;
  const metaY3 = y + 22;

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('ORDER NUMBER', col1X, metaY1);
  doc.text('CUSTOMER NAME', col2X, metaY1);
  doc.text('ORDER TYPE / TABLE', col3X, metaY1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(14, 42, 31);
  doc.text(String(order.order_number || 'N/A'), col1X, metaY2);
  doc.text(String(order.customer_name || 'Guest Customer'), col2X, metaY2);

  const orderTypeStr = order.order_type === 'dine-in' || order.table_number
    ? `Table #${order.table_number || '1'} (Dine-In)`
    : (order.order_type || 'Takeaway').toUpperCase();
  doc.text(orderTypeStr, col3X, metaY2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}`, col1X, metaY3);
  doc.text(`Phone: ${order.phone || 'N/A'}`, col2X, metaY3);
  doc.text(`Captain: ${order.waiter_name || 'Staff'}`, col3X, metaY3);

  // Items Table Header
  y += 33;
  const tableY = y;
  doc.setFillColor(14, 42, 31);
  doc.rect(margin, tableY, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);

  const colSr = margin + 3;
  const colDesc = margin + 15;
  const colRound = margin + 105;
  const colQty = margin + 128;
  const colRate = margin + 148;
  const colAmt = margin + contentWidth - 4;

  doc.text('#', colSr, tableY + 5.5);
  doc.text('ITEM DESCRIPTION', colDesc, tableY + 5.5);
  doc.text('ROUND', colRound, tableY + 5.5);
  doc.text('QTY', colQty, tableY + 5.5);
  doc.text('RATE', colRate, tableY + 5.5);
  doc.text('AMOUNT', colAmt, tableY + 5.5, { align: 'right' });

  // Items List Rows
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(252, 252, 253);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }

    doc.setDrawColor(235, 238, 240);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);

    doc.setTextColor(50, 50, 50);
    doc.text(String(index + 1), colSr, y + 5);

    // Truncate name if too long
    const itemName = item.name.length > 42 ? item.name.slice(0, 40) + '...' : item.name;
    doc.text(itemName, colDesc, y + 5);

    const roundText = item.round && item.round > 1 ? `Round ${item.round}` : 'Round 1';
    doc.setTextColor(100, 100, 100);
    doc.text(roundText, colRound, y + 5);

    doc.setTextColor(50, 50, 50);
    doc.text(String(item.qty), colQty, y + 5);
    doc.text(`Rs. ${item.price}`, colRate, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${item.price * item.qty}`, colAmt, y + 5, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += 7;
  });

  // Table Bottom Line
  doc.setDrawColor(14, 42, 31);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  doc.setLineWidth(0.2);

  // Summary & Totals Box
  y += 6;
  const summaryX = margin + 105;
  const summaryWidth = contentWidth - 105;
  const summaryValX = margin + contentWidth - 4;

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Subtotal:', summaryX, y);
  doc.text(`Rs. ${subtotal}`, summaryValX, y, { align: 'right' });

  y += 5.5;
  doc.text(`GST (${gstRate}%):`, summaryX, y);
  doc.text(`Rs. ${gst}`, summaryValX, y, { align: 'right' });

  if (delivery > 0) {
    y += 5.5;
    doc.text('Delivery Fee:', summaryX, y);
    doc.text(`Rs. ${delivery}`, summaryValX, y, { align: 'right' });
  }

  // Grand Total Highlight Box
  y += 4;
  doc.setFillColor(14, 42, 31);
  doc.rect(summaryX - 4, y, summaryWidth + 4, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(243, 199, 124); // Gold text
  doc.text('GRAND TOTAL:', summaryX, y + 7);
  doc.text(`Rs. ${total}`, summaryValX, y + 7, { align: 'right' });

  // UPI QR Code & Payment Info Box (Left side of totals)
  const upiBoxY = y - 16;
  const upiBoxWidth = 95;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(212, 162, 76);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, upiBoxY, upiBoxWidth, 30, 2, 2, 'FD');

  const note = `${order.order_type === 'dine-in' ? `Table ${order.table_number || ''}` : 'Order'} #${order.order_number}`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

  // Try to load QR Code image
  const qrDataUrl = await loadImageDataUrl(qrUrl);
  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', margin + 3, upiBoxY + 3, 24, 24);
    } catch {
      // Image add fallback
    }
  }

  const upiTextX = qrDataUrl ? margin + 30 : margin + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(14, 42, 31);
  doc.text('SCAN & PAY VIA UPI', upiTextX, upiBoxY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('GPay  |  PhonePe  |  Paytm  |  BHIM', upiTextX, upiBoxY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(184, 130, 54);
  doc.text(`UPI ID: ${upiId}`, upiTextX, upiBoxY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(`Payee: ${upiName}`, upiTextX, upiBoxY + 23);

  // Footer / Thank You Section
  const footerY = pageHeight - 25;
  doc.setDrawColor(212, 162, 76);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, margin + contentWidth, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(14, 42, 31);
  doc.text('Thank you for dining with us at Nandanvan!', pageWidth / 2, footerY + 6, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text('We hope you loved our food and royal hospitality. Visit us again soon!', pageWidth / 2, footerY + 11, { align: 'center' });
  doc.text('This is a computer-generated tax invoice. No signature required.', pageWidth / 2, footerY + 16, { align: 'center' });

  return doc;
}

/**
 * Downloads the PDF directly to user's device.
 */
export async function downloadOrderBillPdf(order, settings) {
  const doc = await createBillPdfDoc(order, settings);
  const cleanOrderNum = (order.order_number || 'INV').replace(/[^a-zA-Z0-9_-]/g, '');
  const fileName = `Nandanvan_Bill_${cleanOrderNum}.pdf`;
  doc.save(fileName);
  return fileName;
}

/**
 * Formats the courteous thank you message for WhatsApp.
 */
export function buildWhatsAppThankYouMessage(order, settings) {
  const restaurantName = settings?.restaurant_name || 'Nandanvan Multicuisine Restaurant';
  const restaurantPhone = settings?.phone || '+91 98250 84721';
  const upiId = settings?.upi_id || 'nandanvan@oksbi';

  const items = order.items || order.order_items || [];
  const subtotal = order.subtotal || items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const gstRate = settings?.gst_rate ?? 5;
  const gst = Math.round(subtotal * (gstRate / 100));
  const delivery = Number(order.delivery_charge || 0);
  const total = order.total || (subtotal + gst + delivery);

  const orderTypeStr = order.order_type === 'dine-in' || order.table_number
    ? `Table #${order.table_number || '1'} (Dine-In)`
    : (order.order_type || 'Takeaway').toUpperCase();

  return (
`🍽️ *${restaurantName.toUpperCase()}*
📍 Near Munjka, Kalawad Road, Rajkot
📞 ${restaurantPhone}
──────────────────────
🙏 *DEAR ${order.customer_name ? order.customer_name.toUpperCase() : 'VALUED GUEST'}, THANK YOU!*

Aapka bill invoice PDF generate ho gaya hai.
📋 *Order No:* ${order.order_number}
📍 *Type:* ${orderTypeStr}
💰 *Total Amount:* ₹${total}
💳 *UPI ID:* ${upiId}

✨ *Hum aasha karte hain ki aapko hamara swadisht food aur royal hospitality bahut pasand aayi hogi. Have a wonderful day & visit us again soon!* 🙏❤️`
  );
}

/**
 * Shares or sends the Bill PDF to WhatsApp:
 * 1. If Web Share Level 2 is supported (Mobile / Tablet browsers), directly shares the PDF file + thank-you caption into WhatsApp.
 * 2. If on Desktop / unsupported browser:
 *    - Automatically downloads the official PDF document.
 *    - Opens WhatsApp with the thank-you message.
 */
export async function sendBillPdfToWhatsApp(order, settings, targetPhone) {
  const cleanPhone = String(targetPhone || order.phone || '').replace(/[^0-9]/g, '').slice(-10);
  if (cleanPhone.length < 10) {
    throw new Error('Please enter a valid 10-digit customer WhatsApp number');
  }

  const doc = await createBillPdfDoc(order, settings);
  const cleanOrderNum = (order.order_number || 'INV').replace(/[^a-zA-Z0-9_-]/g, '');
  const fileName = `Nandanvan_Bill_${cleanOrderNum}.pdf`;

  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
  const thankYouMessage = buildWhatsAppThankYouMessage(order, settings);

  // Check if browser supports Web Share with Files (Mobile Chrome/Safari/Edge)
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: `Nandanvan Bill #${order.order_number}`,
        text: thankYouMessage,
      });
      return {
        success: true,
        method: 'native_share',
        fileName,
        message: 'Bill PDF with thank you note shared directly via WhatsApp!',
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'cancelled', message: 'Share was cancelled' };
      }
      // Fallback to auto-download + WhatsApp web
    }
  }

  // Desktop / Fallback mode:
  // 1. Download the PDF directly
  doc.save(fileName);

  // 2. Open WhatsApp chat with the Thank You Message
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(thankYouMessage)}`;
  window.open(waUrl, '_blank');

  return {
    success: true,
    method: 'download_and_whatsapp',
    fileName,
    message: `Bill PDF "${fileName}" downloaded! WhatsApp chat opened with the thank you message. Attach the downloaded PDF in the chat to send!`,
  };
}
