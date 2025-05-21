const verifyEmailTemplate = (url, email) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #4CAF50;">Welcome to Budget Tracker 🎉</h2>
      <p>Hi ${email},</p>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <a href="${url}" style="
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin-top: 20px;
      ">Verify Email</a>
      <p>If you didn't sign up for Budget Tracker, please ignore this email.</p>
      <br>
      <p>Cheers,<br>Budget Tracker Team</p>
    </div>
  `;
};

module.exports = verifyEmailTemplate;
