import React from 'react';
import './styles.css';

const UpdateConfirmationModal = ({ isVisible, onConfirm, onCancel, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Confirm Book Update</h3>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to save the changes to this book?</p>
          <p className="confirmation-message">
            This action will update the book information in the library.
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
            {isLoading ? 'Saving...' : 'Confirm Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateConfirmationModal;
