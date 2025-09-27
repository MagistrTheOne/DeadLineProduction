// Environment variables check utility
export function checkEnvVariables() {
  const required = [
    'DATABASE_URL',
    'GIGACHAT_CLIENT_SECRET', 
    'SESSION_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '));
    console.warn('Using default values for development');
  }

  return {
    hasDatabase: !!process.env.DATABASE_URL,
    hasGigaChat: !!process.env.GIGACHAT_CLIENT_SECRET && process.env.GIGACHAT_CLIENT_SECRET !== 'your_client_secret_here',
    hasSession: !!process.env.SESSION_SECRET,
  };
}
