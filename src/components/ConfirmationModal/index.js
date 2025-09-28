import React from 'react';
import './styles.css';

const ConfirmationModal = ({ isVisible, onConfirm, onCancel, bookTitle, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Confirm Book Borrow</h3>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to borrow the book:</p>
          <p className="book-title-confirmation">"{bookTitle}"</p>
          <p className="confirmation-message">
            This action will add the book to your borrowed books list.
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
            className="confirm-button" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Borrowing...' : 'Confirm Borrow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
