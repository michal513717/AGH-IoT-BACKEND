import admin from 'firebase-admin';

class FirebaseService {
  private static instance: FirebaseService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }


  public initialize(): void {
    if (this.isInitialized || admin.apps.length > 0) {
      console.log('Firebase Admin already initialized');
      return;
    }

    try {
      const serviceAccount = this.getServiceAccountConfig();
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });

      this.isInitialized = true;
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('Firebase Admin initialization failed:', errorMessage);
      console.warn('Firebase services will not be available. Set credentials to enable Firebase.');
      throw error;
    }
  }

  public getAuth(): admin.auth.Auth {
    if (!this.isReady()) {
      throw new Error('Firebase Admin is not initialized. Check your credentials configuration.');
    }
    return admin.auth();
  }

  public isReady(): boolean {
    return this.isInitialized && admin.apps.length > 0;
  }

  public isAdminReady(): boolean {
    return this.isReady();
  }

  private getServiceAccountConfig(): any {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      return {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
      };
    }

    throw new Error('Firebase Admin credentials not found. Set FIREBASE_SERVICE_ACCOUNT, or individual credential environment variables.');
  }
}

export const firebaseService = FirebaseService.getInstance();

export default firebaseService;