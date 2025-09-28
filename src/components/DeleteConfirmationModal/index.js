import React from 'react';
import './styles.css';

const DeleteConfirmationModal = ({ isVisible, onConfirm, onCancel, bookTitle, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Confirm Book Deletion</h3>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to delete this book?</p>
          <p className="book-title-confirmation">"{bookTitle}"</p>
          <p className="warning-message">
            ⚠️ This action cannot be undone. The book will be permanently removed from the library.
          </p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-button" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="delete-button" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
