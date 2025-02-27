const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendVerificationCode = async (email: string) => {
  const otp = generateOTP();

const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  return data.success ? otp : null;
};
