import { cacheDirectory, copyAsync, deleteAsync, readAsStringAsync } from 'expo-file-system/legacy';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db as firestore, storage } from './firebase';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'to-read';
  userId: string;
  frontCoverUri?: string;
  backCoverUri?: string;
  description?: string;
  genre?: string;
  isLent?: boolean;
  lentTo?: string | null;
  lentAt?: string | null;
  expectedReturnAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookInput {
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'to-read';
  frontCoverUri?: string;
  backCoverUri?: string;
  description?: string;
  genre?: string;
  isLent?: boolean;
  lentTo?: string | null;
  lentAt?: string | null;
  expectedReturnAt?: string | null;
}

export class BookService {
  private static sanitize<T extends Record<string, any>>(data: T): Partial<T> {
    const cleaned: Partial<T> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        (cleaned as any)[key] = value;
      }
    });
    return cleaned;
  }

  private static async uploadCover(
    userId: string,
    bookId: string,
    uri: string,
    coverType: 'front' | 'back'
  ): Promise<string> {
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return uri;
    }

    const filePath = `users/${userId}/books/${bookId}/${coverType}-${Date.now()}.jpg`;
    const storageRef = ref(storage, filePath);

    let sourceUri = uri;

    if (uri.startsWith('content://') && cacheDirectory) {
      const tempUri = `${cacheDirectory}upload-${bookId}-${coverType}-${Date.now()}.jpg`;
      try {
        await copyAsync({ from: uri, to: tempUri });
        sourceUri = tempUri;
      } catch {
        sourceUri = uri;
      }
    }

    const base64 = await readAsStringAsync(sourceUri, {
      encoding: 'base64' as any,
    });
    await uploadString(storageRef, base64, 'base64');

    if (sourceUri !== uri && sourceUri.startsWith('file://')) {
      await deleteAsync(sourceUri, { idempotent: true }).catch(() => undefined);
    }

    return getDownloadURL(storageRef);
  }

  private static async safeUploadCover(
    userId: string,
    bookId: string,
    uri: string,
    coverType: 'front' | 'back'
  ): Promise<string | null> {
    try {
      return await this.uploadCover(userId, bookId, uri, coverType);
    } catch (error) {
      console.warn('Cover upload failed, keeping existing image:', error);
      return null;
    }
  }
  // Get all books for a user
  static async getUserBooks(userId: string): Promise<Book[]> {
    try {
      // Use subcollection path: users/{userId}/books
      const booksRef = collection(firestore, 'users', userId, 'books');
      const querySnapshot = await getDocs(booksRef);
      
      const books: Book[] = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() } as Book);
      });
      
      // Sort by updated date (newest first)
      return books.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error: any) {
      const errorCode = error?.code as string | undefined;
      if (errorCode === 'permission-denied' || errorCode === 'not-found') {
        return [];
      }
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  // Get a single book
  static async getBook(userId: string, bookId: string): Promise<Book> {
    try {
      // Use subcollection path: users/{userId}/books/{bookId}
      const bookRef = doc(firestore, 'users', userId, 'books', bookId);
      const bookDoc = await getDoc(bookRef);
      
      if (!bookDoc.exists()) {
        throw new Error('Book not found');
      }
      
      const book = { id: bookDoc.id, ...bookDoc.data() } as Book;
      return book;
    } catch (error: any) {
      throw new Error(`Failed to fetch book: ${error.message}`);
    }
  }

  // Add a new book
  static async addBook(userId: string, bookData: BookInput): Promise<string> {
    try {
      console.log('Saving book to Firestore...');
      console.log('User ID:', userId);
      console.log('Book Data:', bookData);

      // Use subcollection path: users/{userId}/books
      const booksRef = collection(firestore, 'users', userId, 'books');
      const now = new Date().toISOString();
      
      const initialData = this.sanitize(bookData) as BookInput;
      delete (initialData as any).frontCoverUri;
      delete (initialData as any).backCoverUri;

      const docRef = await addDoc(booksRef, {
        ...initialData,
        userId,
        createdAt: now,
        updatedAt: now,
      });

      const updates: Partial<BookInput> = {};

      if (bookData.frontCoverUri) {
        const frontUrl = await this.safeUploadCover(
          userId,
          docRef.id,
          bookData.frontCoverUri,
          'front'
        );
        if (frontUrl) updates.frontCoverUri = frontUrl;
      }

      if (bookData.backCoverUri) {
        const backUrl = await this.safeUploadCover(
          userId,
          docRef.id,
          bookData.backCoverUri,
          'back'
        );
        if (backUrl) updates.backCoverUri = backUrl;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(firestore, 'users', userId, 'books', docRef.id), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }
      
      console.log('Firestore success, doc id:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Firestore add error:', error);
      throw new Error(`Failed to add book: ${error.message}`);
    }
  }

  // Update a book
  static async updateBook(
    userId: string,
    bookId: string,
    bookData: BookInput
  ): Promise<void> {
    try {
      // Use subcollection path: users/{userId}/books/{bookId}
      const bookRef = doc(firestore, 'users', userId, 'books', bookId);

      const updates: BookInput = { ...this.sanitize(bookData) } as BookInput;

      if (updates.frontCoverUri) delete (updates as any).frontCoverUri;
      if (updates.backCoverUri) delete (updates as any).backCoverUri;

      if (bookData.frontCoverUri) {
        const frontUrl = await this.safeUploadCover(
          userId,
          bookId,
          bookData.frontCoverUri,
          'front'
        );
        if (frontUrl) updates.frontCoverUri = frontUrl;
      }

      if (bookData.backCoverUri) {
        const backUrl = await this.safeUploadCover(
          userId,
          bookId,
          bookData.backCoverUri,
          'back'
        );
        if (backUrl) updates.backCoverUri = backUrl;
      }
      
      await updateDoc(bookRef, {
        ...this.sanitize(updates),
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update book: ${error.message}`);
    }
  }

  // Delete a book
  static async deleteBook(userId: string, bookId: string): Promise<void> {
    try {
      // Use subcollection path: users/{userId}/books/{bookId}
      const bookRef = doc(firestore, 'users', userId, 'books', bookId);
      
      await deleteDoc(bookRef);
    } catch (error: any) {
      throw new Error(`Failed to delete book: ${error.message}`);
    }
  }

  // Get book counts by status
  static async getBookStats(userId: string) {
    try {
      const books = await this.getUserBooks(userId);
      
      return {
        total: books.length,
        reading: books.filter(b => b.status === 'reading').length,
        completed: books.filter(b => b.status === 'completed').length,
        toRead: books.filter(b => b.status === 'to-read').length,
      };
    } catch (error: any) {
      throw new Error(`Failed to get book stats: ${error.message}`);
    }
  }
}
