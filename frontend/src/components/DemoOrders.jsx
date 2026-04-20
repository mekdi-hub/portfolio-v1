import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-v1-2uu3.onrender.com/api';

function DemoOrders() {
  const [orderData, setOrderData] = useState({
    status: 'pending',
    assigned_rider: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('creating');

    try {
      const response = await fetch(`${API_URL}/demo-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setStatus('success');
        setOrderData({ status: 'pending', assigned_rider: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="demo-orders">
      <h2>Create Demo Order</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="status"
          value={orderData.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          name="assigned_rider"
          placeholder="Assigned Rider (optional)"
          value={orderData.assigned_rider}
          onChange={handleChange}
        />
        <button type="submit" disabled={status === 'creating'}>
          {status === 'creating' ? 'Creating...' : 'Create Order'}
        </button>
        {status === 'success' && <p className="success">Order created successfully!</p>}
        {status === 'error' && <p className="error">Failed to create order. Try again.</p>}
      </form>
    </div>
  );
}

export default DemoOrders;
