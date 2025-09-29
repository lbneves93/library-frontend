import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { getStoredToken, getUserRole } from '../../utils/auth';
import Toast from '../Toast';
import ConfirmationModal from '../ConfirmationModal';
import BorrowsListModal from '../BorrowsListModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import './styles.css';

const BooksList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderBy, setOrderBy] = useState('ASC');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: '' });
  const [borrowingBookId, setBorrowingBookId] = useState(null);
  const [modal, setModal] = useState({ isVisible: false, bookId: null, bookTitle: '' });
  const [borrowsModal, setBorrowsModal] = useState({ isVisible: false, bookTitle: '', borrows: [], bookId: null });
  const [deleteModal, setDeleteModal] = useState({ isVisible: false, bookId: null, bookTitle: '' });
  const [deletingBookId, setDeletingBookId] = useState(null);

  const fetchBooks = useCallback(async (searchQuery = '', order = orderBy) => {
    try {
      setLoading(true);
      setError('');
      const token = getStoredToken();
      
      let url = 'http://localhost:3000/books';
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (order) {
        params.append('order', order);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Fetching books with URL:', url);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Books response:', response.data);

      // Handle new API response structure with data array and attributes
      const booksData = response.data.data || response.data;
      console.log('Books data array:', booksData);
      
      const processedBooks = booksData.map(item => {
        // If the item has attributes, use them; otherwise use the item directly
        const bookData = item.attributes || item;
        return {
          id: bookData.id,
          title: bookData.title,
          author: bookData.author,
          genre: bookData.genre,
          isbn: bookData.isbn,
          total_copies: bookData.total_copies,
          available: bookData.available,
          created_at: bookData.created_at,
          updated_at: bookData.updated_at,
          borrows: bookData.borrows || [] // Include borrows for librarians
        };
      });

      console.log('Processed books:', processedBooks);
      setBooks(processedBooks);
    } catch (err) {
      console.error('Books fetch error:', err);
      setError('Failed to load books');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [orderBy]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      fetchBooks(searchTerm.trim(), orderBy);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    fetchBooks('', orderBy);
  };

  const handleOrderChange = (e) => {
    const newOrder = e.target.value;
    setOrderBy(newOrder);
    fetchBooks(searchTerm, newOrder);
  };

  const handleBorrowClick = (bookId, bookTitle) => {
    setModal({
      isVisible: true,
      bookId: bookId,
      bookTitle: bookTitle
    });
  };

  const handleConfirmBorrow = async () => {
    try {
      setBorrowingBookId(modal.bookId);
      const token = getStoredToken();
      
      await axios.post(`http://localhost:3000/books/${modal.bookId}/borrow`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Close modal
      setModal({ isVisible: false, bookId: null, bookTitle: '' });

      // Show success toast
      setToast({
        isVisible: true,
        message: 'Book borrowed successfully!',
        type: 'success'
      });

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error('Borrow error:', err);
      
      // Check for errors array in response
      let errorMessage = 'Failed to borrow book. Please try again.';
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
        // Use the first error from the errors array
        errorMessage = err.response.data.errors[0];
      } else if (err.response?.data?.message) {
        // Fallback to message if no errors array
        errorMessage = err.response.data.message;
      }
      
      setToast({
        isVisible: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setBorrowingBookId(null);
    }
  };

  const handleCancelBorrow = () => {
    setModal({ isVisible: false, bookId: null, bookTitle: '' });
  };

  const handleBorrowsListClick = (bookTitle, borrows, bookId) => {
    setBorrowsModal({
      isVisible: true,
      bookTitle: bookTitle,
      borrows: borrows || [],
      bookId: bookId
    });
  };

  const handleCloseBorrowsModal = () => {
    setBorrowsModal({ isVisible: false, bookTitle: '', borrows: [], bookId: null });
  };

  const handleEditBook = (book) => {
    // Navigate to edit page with book data
    navigate('/book-edit', { state: { book } });
  };

  const handleDeleteClick = (bookId, bookTitle) => {
    setDeleteModal({
      isVisible: true,
      bookId: bookId,
      bookTitle: bookTitle
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeletingBookId(deleteModal.bookId);
      const token = getStoredToken();
      
      await axios.delete(`http://localhost:3000/books/${deleteModal.bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Close modal
      setDeleteModal({ isVisible: false, bookId: null, bookTitle: '' });

      // Remove book from the list
      setBooks(prevBooks => prevBooks.filter(book => book.id !== deleteModal.bookId));

      // Show success toast
      setToast({
        isVisible: true,
        message: 'Book deleted successfully!',
        type: 'success'
      });

    } catch (err) {
      console.error('Delete error:', err);
      
      // Check for errors array in response
      let errorMessage = 'Failed to delete book. Please try again.';
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
        // Use the first error from the errors array
        errorMessage = err.response.data.errors[0];
      } else if (err.response?.data?.message) {
        // Fallback to message if no errors array
        errorMessage = err.response.data.message;
      }
      
      setToast({
        isVisible: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setDeletingBookId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isVisible: false, bookId: null, bookTitle: '' });
  };

  const handleNewBook = () => {
    navigate('/book-new');
  };

  const handleBookUpdate = async () => {
    if (borrowsModal.bookId) {
      try {
        const token = getStoredToken();
        const response = await axios.get(`http://localhost:3000/books/${borrowsModal.bookId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Handle new API response structure for single book
        const bookData = response.data.data?.attributes || response.data.attributes || response.data;
        const processedBook = {
          id: bookData.id,
          title: bookData.title,
          author: bookData.author,
          genre: bookData.genre,
          isbn: bookData.isbn,
          total_copies: bookData.total_copies,
          available: bookData.available,
          created_at: bookData.created_at,
          updated_at: bookData.updated_at,
          borrows: bookData.borrows || []
        };

        // Update the specific book in the books array
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === borrowsModal.bookId ? processedBook : book
          )
        );
      } catch (err) {
        console.error('Error updating book:', err);
        // Fallback to full reload if specific book update fails
        fetchBooks('', orderBy);
      }
    } else {
      // Fallback to full reload if no book ID
      fetchBooks('', orderBy);
    }
  };

  const closeToast = () => {
    setToast({ isVisible: false, message: '', type: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="books-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="books-list-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => fetchBooks()}>Retry</button>
        </div>
      </div>
    );
  }

  const userRole = getUserRole();
  const isMember = userRole === 'member';
  const isLibrarian = userRole === 'librarian';

  return (
    <div className="books-list-container">
      <h2>Books Library</h2>
      
      {/* Search Section */}
      <div className="search-section">
        {isLibrarian && (
          <button 
            onClick={handleNewBook} 
            className="new-book-button"
          >
            + New Book
          </button>
        )}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author or genre"
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {searchTerm && (
              <button type="button" onClick={handleClearSearch} className="clear-button">
                Clear
              </button>
            )}
          </div>
        </form>
        <div className="order-section">
          <label htmlFor="order-select" className="order-label">Order by title:</label>
          <select
            id="order-select"
            value={orderBy}
            onChange={handleOrderChange}
            className="order-select"
          >
            <option value="ASC">A-Z (Ascending)</option>
            <option value="DESC">Z-A (Descending)</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {books && books.length > 0 ? (
          books.map((book) => (
            <div 
              key={book.id} 
              className={`book-card ${book.available ? 'available' : 'unavailable'}`}
            >
              <div className="availability-badge">
                {book.available ? 'Available' : 'Unavailable'}
              </div>
              
              {/* Edit Icon for Librarians */}
              {isLibrarian && (
                <button 
                  className="edit-icon-button"
                  onClick={() => handleEditBook(book)}
                  title="Edit book"
                >
                  ✏️
                </button>
              )}
              
              {/* Delete Icon for Librarians */}
              {isLibrarian && (
                <button 
                  className="delete-icon-button"
                  onClick={() => handleDeleteClick(book.id, book.title)}
                  title="Delete book"
                >
                  🗑️
                </button>
              )}
              
              <div>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-genre">{book.genre}</p>
                <p className="book-isbn">ISBN: {book.isbn}</p>
                <p className="book-copies">Copies: {book.total_copies}</p>
                <div className="book-dates">
                  <p className="created-date">
                    Added: {formatDate(book.created_at)}
                  </p>
                  <p className="updated-date">
                    Updated: {formatDate(book.updated_at)}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="book-actions">
                  {/* Borrow Button for Members */}
                  {isMember && book.available && (
                    <button
                      className="borrow-button"
                      onClick={() => handleBorrowClick(book.id, book.title)}
                      disabled={borrowingBookId === book.id}
                    >
                      {borrowingBookId === book.id ? 'Borrowing...' : 'Borrow'}
                    </button>
                  )}
                  
                  {/* Borrows List Button for Librarians */}
                  {isLibrarian && (
                    <button
                      className="borrows-list-button"
                      onClick={() => handleBorrowsListClick(book.title, book.borrows, book.id)}
                    >
                      Borrows List
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-books">
            <p>No books found.</p>
            {searchTerm && (
              <button onClick={handleClearSearch} className="clear-search-button">
                Clear search to show all books
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isVisible={modal.isVisible}
        bookTitle={modal.bookTitle}
        onConfirm={handleConfirmBorrow}
        onCancel={handleCancelBorrow}
        isLoading={borrowingBookId === modal.bookId}
      />
      
      {/* Borrows List Modal */}
      <BorrowsListModal
        isVisible={borrowsModal.isVisible}
        bookTitle={borrowsModal.bookTitle}
        borrows={borrowsModal.borrows}
        onClose={handleCloseBorrowsModal}
        onBookUpdate={handleBookUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isVisible={deleteModal.isVisible}
        bookTitle={deleteModal.bookTitle}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deletingBookId !== null}
      />
    </div>
  );
};

export default BooksList;
