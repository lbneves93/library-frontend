import React from 'react';
import './styles.css';

const UnborrowConfirmationModal = ({ isVisible, onConfirm, onCancel, borrowerName, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Confirm Book Return</h3>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to mark this book as returned by:</p>
          <p className="borrower-name-confirmation">"{borrowerName}"</p>
          <p className="confirmation-message">
            This action will mark the book as returned and make it available for borrowing again.
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
            {isLoading ? 'Returning...' : 'Confirm Return'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnborrowConfirmationModal;
