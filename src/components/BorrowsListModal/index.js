import React, { useState } from 'react';
import axios from 'axios';
import { getStoredToken } from '../../utils/auth';
import Toast from '../Toast';
import UnborrowConfirmationModal from '../UnborrowConfirmationModal';
import './styles.css';

const BorrowsListModal = ({ isVisible, onClose, bookTitle, borrows, onBookUpdate }) => {
  const [toast, setToast] = useState({ isVisible: false, message: '', type: '' });
  const [unborrowModal, setUnborrowModal] = useState({ isVisible: false, borrowId: null, borrowerName: '' });
  const [unborrowingId, setUnborrowingId] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleUnborrowClick = (borrowId, borrowerName) => {
    setUnborrowModal({
      isVisible: true,
      borrowId: borrowId,
      borrowerName: borrowerName
    });
  };

  const handleConfirmUnborrow = async () => {
    try {
      setUnborrowingId(unborrowModal.borrowId);
      const token = getStoredToken();
      
      await axios.patch(`http://localhost:3000/borrows/${unborrowModal.borrowId}`, {
        borrow: {
          returned: true
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Close unborrow modal
      setUnborrowModal({ isVisible: false, borrowId: null, borrowerName: '' });

      // Show success toast
      setToast({
        isVisible: true,
        message: 'Book returned successfully!',
        type: 'success'
      });

      // Close the borrows list modal and update book data
      setTimeout(() => {
        onClose();
        if (onBookUpdate) {
          onBookUpdate();
        }
      }, 1500);

    } catch (err) {
      console.error('Unborrow error:', err);
      
      // Check for errors array in response
      let errorMessage = 'Failed to return book. Please try again.';
      
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
      setUnborrowingId(null);
    }
  };

  const handleCancelUnborrow = () => {
    setUnborrowModal({ isVisible: false, borrowId: null, borrowerName: '' });
  };

  const closeToast = () => {
    setToast({ isVisible: false, message: '', type: '' });
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>Borrows List - {bookTitle}</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          
          <div className="modal-body">
            {borrows && borrows.length > 0 ? (
              <div className="borrows-list">
                {borrows.map((borrow) => (
                  <div key={borrow.id} className="borrow-item">
                    <div className="borrow-info">
                      <p className="borrower-name">{borrow.borrower_name}</p>
                      <p className="borrower-email">{borrow.borrower_email}</p>
                      <p className="due-date">Due: {formatDate(borrow.due_at)}</p>
                    </div>
                    <div className="borrow-actions">
                      <button
                        className="unborrow-button"
                        onClick={() => handleUnborrowClick(borrow.id, borrow.borrower_name)}
                        disabled={unborrowingId === borrow.id}
                      >
                        {unborrowingId === borrow.id ? 'Returning...' : 'Unborrow'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-borrows">
                <p>No active borrows for this book.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />

      {/* Unborrow Confirmation Modal */}
      <UnborrowConfirmationModal
        isVisible={unborrowModal.isVisible}
        borrowerName={unborrowModal.borrowerName}
        onConfirm={handleConfirmUnborrow}
        onCancel={handleCancelUnborrow}
        isLoading={unborrowingId === unborrowModal.borrowId}
      />
    </>
  );
};

export default BorrowsListModal;
