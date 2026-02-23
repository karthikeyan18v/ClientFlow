import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

const baseTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: #1a1a2e; padding: 30px; text-align: center; }
    .header h1 { color: #e94560; margin: 0; font-size: 24px; }
    .header p { color: #a0a0b0; margin: 5px 0 0; font-size: 13px; }
    .body { padding: 30px; }
    .body h2 { color: #1a1a2e; margin-top: 0; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .info-table td:first-child { color: #666; width: 40%; font-weight: bold; }
    .info-table td:last-child { color: #1a1a2e; }
    .credentials { background: #f4f6f9; border-left: 4px solid #e94560; padding: 15px 20px; border-radius: 4px; margin: 20px 0; }
    .credentials p { margin: 5px 0; font-size: 14px; color: #333; }
    .credentials span { font-weight: bold; color: #e94560; }
    .footer { background: #f4f6f9; padding: 20px; text-align: center; font-size: 12px; color: #999; }
    .btn { display: inline-block; margin-top: 20px; padding: 12px 28px; background: #e94560; color: #fff; text-decoration: none; border-radius: 5px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Karthikeyan Software Solutions</h1>
      <p>Your trusted technology partner</p>
    </div>
    <div class="body">
      <h2>${title}</h2>
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Karthikeyan Software Solutions. All rights reserved.<br/>
      This is an automated email, please do not reply.
    </div>
  </div>
</body>
</html>
`;

export const sendClientWelcomeEmail = async (user, plainPassword) => {
  const content = `
    <p>Welcome aboard! Your client account has been created. Below are your account details:</p>
    <div class="credentials">
      <p>Email: <span>${user.email}</span></p>
      <p>Password: <span>${plainPassword}</span></p>
    </div>
    <table class="info-table">
      <tr><td>Name</td><td>${user.name}</td></tr>
      <tr><td>Company</td><td>${user.companyName || "-"}</td></tr>
      <tr><td>Company Address</td><td>${user.companyAddress || "-"}</td></tr>
      <tr><td>Company Phone</td><td>${user.companyPhone || "-"}</td></tr>
      <tr><td>Company Website</td><td>${user.companyWebsite || "-"}</td></tr>
      <tr><td>GST Number</td><td>${user.gstNumber || "-"}</td></tr>
      <tr><td>Contact Person</td><td>${user.contactPerson || "-"}</td></tr>
    </table>
    <p style="font-size:13px;color:#888;">Please change your password after first login.</p>
  `;

  await transporter.sendMail({
    from: `"Karthikeyan Software Solutions" <${process.env.SMTP_EMAIL}>`,
    to: user.email,
    subject: "Welcome to Karthikeyan Software Solutions – Client Account Created",
    html: baseTemplate("Welcome, " + user.name + "!", content),
  });
};

export const sendEmployeeWelcomeEmail = async (user, plainPassword) => {
  const content = `
    <p>Welcome to the team! Your employee account has been created. Below are your details:</p>
    <div class="credentials">
      <p>Email: <span>${user.email}</span></p>
      <p>Password: <span>${plainPassword}</span></p>
    </div>
    <table class="info-table">
      <tr><td>Name</td><td>${user.name}</td></tr>
      <tr><td>Employee ID</td><td>${user.employeeId || "-"}</td></tr>
      <tr><td>Department</td><td>${user.department || "-"}</td></tr>
      <tr><td>Designation</td><td>${user.designation || "-"}</td></tr>
      <tr><td>Phone</td><td>${user.phone || "-"}</td></tr>
      <tr><td>Joining Date</td><td>${user.joiningDate ? new Date(user.joiningDate).toDateString() : "-"}</td></tr>
    </table>
    <p style="font-size:13px;color:#888;">Please change your password after first login.</p>
  `;

  await transporter.sendMail({
    from: `"Karthikeyan Software Solutions" <${process.env.SMTP_EMAIL}>`,
    to: user.email,
    subject: "Welcome to Karthikeyan Software Solutions – Employee Account Created",
    html: baseTemplate("Welcome, " + user.name + "!", content),
  });
};
