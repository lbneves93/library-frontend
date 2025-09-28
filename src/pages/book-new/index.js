import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { getStoredToken, getUserRole } from '../../utils/auth';
import Toast from '../../components/Toast';
import SaveConfirmationModal from '../../components/SaveConfirmationModal';
import './styles.css';

const BookNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    total_copies: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: '' });
  const [modal, setModal] = useState({ isVisible: false });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Check if user is librarian
    const userRole = getUserRole();
    if (userRole !== 'librarian') {
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSaveClick = () => {
    // Validate required fields
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.genre.trim()) errors.genre = 'Genre is required';
    if (!formData.isbn.trim()) errors.isbn = 'ISBN is required';
    if (!formData.total_copies.trim()) errors.total_copies = 'Total copies is required';
    if (formData.total_copies && isNaN(Number(formData.total_copies))) {
      errors.total_copies = 'Total copies must be a number';
    }
    if (formData.total_copies && Number(formData.total_copies) < 1) {
      errors.total_copies = 'Total copies must be at least 1';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setModal({ isVisible: true });
  };

  const handleConfirmSave = async () => {
    try {
      setLoading(true);
      const token = getStoredToken();
      
      await axios.post('http://localhost:3000/books', {
        book: {
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          isbn: formData.isbn,
          total_copies: Number(formData.total_copies)
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Close modal
      setModal({ isVisible: false });

      // Show success toast
      setToast({
        isVisible: true,
        message: 'Book created successfully!',
        type: 'success'
      });

      // Navigate back after success
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('Create error:', err);
      
      // Handle field-specific errors
      if (err.response?.data?.errors) {
        const errors = {};
        Object.keys(err.response.data.errors).forEach(field => {
          errors[field] = err.response.data.errors[field];
        });
        setFieldErrors(errors);
      } else {
        // Show general error
        setToast({
          isVisible: true,
          message: err.response?.data?.message || 'Failed to create book. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSave = () => {
    setModal({ isVisible: false });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const closeToast = () => {
    setToast({ isVisible: false, message: '', type: '' });
  };

  return (
    <div className="book-new-container">
      <h2>Create New Book</h2>
      
      <form className="book-new-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={fieldErrors.title ? 'error' : ''}
            placeholder="Enter book title"
          />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className={fieldErrors.author ? 'error' : ''}
            placeholder="Enter author name"
          />
          {fieldErrors.author && <span className="field-error">{fieldErrors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre *</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className={fieldErrors.genre ? 'error' : ''}
            placeholder="Enter book genre"
          />
          {fieldErrors.genre && <span className="field-error">{fieldErrors.genre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="isbn">ISBN *</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleInputChange}
            className={fieldErrors.isbn ? 'error' : ''}
            placeholder="Enter ISBN"
          />
          {fieldErrors.isbn && <span className="field-error">{fieldErrors.isbn}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="total_copies">Total Copies *</label>
          <input
            type="number"
            id="total_copies"
            name="total_copies"
            value={formData.total_copies}
            onChange={handleInputChange}
            className={fieldErrors.total_copies ? 'error' : ''}
            placeholder="Enter total copies"
            min="1"
          />
          {fieldErrors.total_copies && <span className="field-error">{fieldErrors.total_copies}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button 
            type="button" 
            className="save-button" 
            onClick={handleSaveClick}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />

      {/* Save Confirmation Modal */}
      <SaveConfirmationModal
        isVisible={modal.isVisible}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelSave}
        isLoading={loading}
      />
    </div>
  );
};

export default BookNew;
