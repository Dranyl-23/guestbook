import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:3000/api/messages';

  const fetchMessages = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // TODO 4
  useEffect(() => {
    fetchMessages();
  }, []);

  // TODO 5
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      if (res.ok) {
        setName('');
        setMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

    // "NEW" tag kung ubos sa 1 ka minuto ang message
  const isNew = (date) => Date.now() - new Date(date).getTime() < 60 * 1000;

  return (
    <div>
      <h2>My Portfolio Guestbook</h2>

      <form onSubmit={handleSubmit} className="guest-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />
        <input
          type="text"
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Sign Guestbook</button>
      </form>

      <h3>Messages ({messages.length})</h3>

      {messages.length === 0 && (
        <p className="empty">No Message yet!</p>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className="msg-card">
          <div className="msg-header">
            <span className="msg-name">{msg.name}</span>
            <span className={`tag ${isNew(msg.created_at) ? 'new' : ''}`}>
              {isNew(msg.created_at) ? 'New' : 'Visitor'}
            </span>
          </div>
          <p className="msg-text">{msg.message}</p>
          <small className="msg-time">
            {new Date(msg.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default App;