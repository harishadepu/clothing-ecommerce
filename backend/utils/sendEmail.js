// backend/src/utils/mailer.js
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const orderEmailHtml = ({ orderId, date, items, total }) => `
  <div style="font-family:Arial,sans-serif">
    <h2>Order Confirmation</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>
    <table width="100%" cellpadding="8" style="border-collapse:collapse">
      <thead>
        <tr>
          <th align="left">Item</th><th align="left">Size</th><th align="right">Qty</th><th align="right">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td>${i.name}</td><td>${i.size}</td><td align="right">${i.qty}</td><td align="right">$${i.price.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <h3>Total: $${total.toFixed(2)}</h3>
    <p>Thank you for shopping with us!</p>
  </div>
`;