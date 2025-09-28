import React from 'react';
import './styles.css';

const SaveConfirmationModal = ({ isVisible, onConfirm, onCancel, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Confirm Book Creation</h3>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to create this new book?</p>
          <p className="confirmation-message">
            This action will add the book to the library database.
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
            {isLoading ? 'Creating...' : 'Confirm Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmationModal;
