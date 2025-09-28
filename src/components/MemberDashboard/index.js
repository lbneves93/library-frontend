import React from 'react';
import './styles.css';

const MemberDashboard = ({ borrowedBooks }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (daysUntilDue) => {
    return daysUntilDue <= 0;
  };

  return (
    <div className="member-dashboard">
      <h2>My Borrowed Books</h2>
      <div className="books-grid">
        {borrowedBooks && borrowedBooks.length > 0 ? (
          borrowedBooks.map((borrowedBook) => (
            <div 
              key={borrowedBook.id} 
              className={`book-card ${isOverdue(borrowedBook.days_until_due) ? 'overdue' : ''}`}
            >
              {isOverdue(borrowedBook.days_until_due) && (
                <div className="overdue-badge">OVERDUE</div>
              )}
              <div className="book-info">
                <h3 className="book-title">{borrowedBook.book.title}</h3>
                <p className="book-author">by {borrowedBook.book.author}</p>
                <p className="book-genre">{borrowedBook.book.genre}</p>
                <p className="book-isbn">ISBN: {borrowedBook.book.isbn}</p>
                <div className="book-dates">
                  <p className="borrowed-date">
                    Borrowed: {formatDate(borrowedBook.borrowed_at)}
                  </p>
                  <p className="due-date">
                    Due: {formatDate(borrowedBook.due_at)}
                  </p>
                  <p className={`days-remaining ${isOverdue(borrowedBook.days_until_due) ? 'overdue-text' : ''}`}>
                    {borrowedBook.days_until_due > 0 
                      ? `${borrowedBook.days_until_due} days remaining`
                      : `${Math.abs(borrowedBook.days_until_due)} days overdue`
                    }
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-books">
            <p>You don't have any borrowed books at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
