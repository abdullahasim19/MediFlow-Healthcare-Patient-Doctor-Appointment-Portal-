export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  signalRUrl: 'http://localhost:5000/hubs',
  appName: 'MediFlow',
  version: '1.0.0',
  sessionTimeout: 30, // minutes
  maxFileSize: 25, // MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf']
};