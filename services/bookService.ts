import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db as firestore } from './firebase';

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
}

export class BookService {
  // Get all books for a user
  static async getUserBooks(userId: string): Promise<Book[]> {
    try {
      const booksRef = collection(firestore, 'books');
      const q = query(booksRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const books: Book[] = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() } as Book);
      });
      
      // Sort by updated date (newest first)
      return books.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (error: any) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  // Get a single book
  static async getBook(userId: string, bookId: string): Promise<Book> {
    try {
      const bookRef = doc(firestore, 'books', bookId);
      const bookDoc = await getDoc(bookRef);
      
      if (!bookDoc.exists()) {
        throw new Error('Book not found');
      }
      
      const book = { id: bookDoc.id, ...bookDoc.data() } as Book;
      
      // Verify ownership
      if (book.userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      return book;
    } catch (error: any) {
      throw new Error(`Failed to fetch book: ${error.message}`);
    }
  }

  // Add a new book
  static async addBook(userId: string, bookData: BookInput): Promise<string> {
    try {
      const booksRef = collection(firestore, 'books');
      const now = new Date().toISOString();
      
      const docRef = await addDoc(booksRef, {
        ...bookData,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      
      return docRef.id;
    } catch (error: any) {
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
      const bookRef = doc(firestore, 'books', bookId);
      
      // Verify ownership first
      const bookDoc = await getDoc(bookRef);
      if (!bookDoc.exists()) {
        throw new Error('Book not found');
      }
      
      const book = bookDoc.data() as Book;
      if (book.userId !== userId) {
        throw new Error('Unauthorized');
      }
      
      await updateDoc(bookRef, {
        ...bookData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update book: ${error.message}`);
    }
  }

  // Delete a book
  static async deleteBook(userId: string, bookId: string): Promise<void> {
    try {
      const bookRef = doc(firestore, 'books', bookId);
      
      // Verify ownership first
      const bookDoc = await getDoc(bookRef);
      if (!bookDoc.exists()) {
        throw new Error('Book not found');
      }
      
      const book = bookDoc.data() as Book;
      if (book.userId !== userId) {
        throw new Error('Unauthorized');
      }
      
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
