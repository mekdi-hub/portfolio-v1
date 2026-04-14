import { useState } from 'react';
import './ContactForm.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('http://localhost:8000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <div className="contact-badge">Get In Touch</div>
          <h2>Contact Me</h2>
          <p className="contact-subtitle">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell me about your project or inquiry"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            />
          </div>

          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <div className="status-message success">
              ✓ Message sent successfully! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="status-message error">
              ✗ Failed to send message. Please try again.
            </div>
          )}
        </form>

        <div className="contact-info">
          <div className="contact-info-item">
            <div className="contact-info-icon">📧</div>
            <div className="contact-info-text">
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">hello@example.com</div>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="contact-info-icon">📍</div>
            <div className="contact-info-text">
              <div className="contact-info-label">Location</div>
              <div className="contact-info-value">Ethiopia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
