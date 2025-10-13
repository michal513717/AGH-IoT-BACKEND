import { initializeApp } from 'firebase/app';

export const getFirebaseClient = async(): Promise<any> => {
  const firebaseConfig = {}; //TODO

  return initializeApp(firebaseConfig);
}