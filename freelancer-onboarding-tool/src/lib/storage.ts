'use client';

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export class StorageService {
  // Generic file upload method (can be used for other files if needed in future)
  static async uploadFile(
    userId: string, 
    file: File, 
    directory: string
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `file_${timestamp}.${fileExtension}`;
      const fileRef = ref(storage, `users/${userId}/${directory}/${fileName}`);

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  // Check Firebase Storage connectivity
  static async checkStorageConnectivity(): Promise<boolean> {
    try {
      const testRef = ref(storage, `connectivity-test-${Date.now()}`);
      return true;
    } catch (error) {
      console.warn('Firebase Storage connectivity check failed:', error);
      return false;
    }
  }
}