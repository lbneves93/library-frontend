import React from 'react';
import './styles.css';

const LibrarianDashboard = ({ dashboardData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="librarian-dashboard">
      <h2>Library Dashboard</h2>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Books</h3>
          <div className="stat-number">{dashboardData.total_books}</div>
        </div>
        <div className="stat-card">
          <h3>Borrowed Books</h3>
          <div className="stat-number">{dashboardData.total_borrowed_books}</div>
        </div>
        <div className="stat-card">
          <h3>Due Today</h3>
          <div className="stat-number">{dashboardData.books_due_today}</div>
        </div>
      </div>

      {/* Overdue Books Section */}
      <div className="overdue-section">
        <h3>Overdue Books</h3>
        {dashboardData.overdue_members && dashboardData.overdue_members.length > 0 ? (
          <div className="overdue-books-grid">
            {dashboardData.overdue_members.map((overdue, index) => (
              <div key={index} className="overdue-card">
                <div className="overdue-badge">OVERDUE</div>
                <div className="overdue-info">
                  <h4 className="book-title">{overdue.book_title}</h4>
                  <p className="book-author">by {overdue.book_author}</p>
                  <div className="member-info">
                    <p className="member-name">Member: {overdue.member_name}</p>
                    <p className="member-email">{overdue.member_email}</p>
                  </div>
                  <div className="overdue-dates">
                    <p className="borrowed-date">
                      Borrowed: {formatDate(overdue.borrowed_at)}
                    </p>
                    <p className="due-date">
                      Due: {formatDate(overdue.due_at)}
                    </p>
                    <p className="days-overdue">
                      {overdue.days_overdue} days overdue
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-overdue">
            <p>No overdue books at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDashboard;
