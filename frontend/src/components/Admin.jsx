import { useState, useEffect } from 'react';
import './Admin.css';

const API_URL = 'http://localhost:8000/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [demoOrders, setDemoOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tech_stack: '',
    image: '',
    demo_link: ''
  });

  const [orderForm, setOrderForm] = useState({
    status: 'pending',
    assigned_rider: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();
        setProjects(data);
      } else if (activeTab === 'messages') {
        const res = await fetch(`${API_URL}/messages`);
        const data = await res.json();
        setMessages(data);
      } else if (activeTab === 'orders') {
        const res = await fetch(`${API_URL}/demo-orders`);
        const data = await res.json();
        setDemoOrders(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem 
        ? `${API_URL}/projects/${editingItem.id}`
        : `${API_URL}/projects`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm)
      });

      if (res.ok) {
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
    setLoading(false);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem 
        ? `${API_URL}/demo-orders/${editingItem.id}`
        : `${API_URL}/demo-orders`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderForm)
      });

      if (res.ok) {
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const endpoint = type === 'project' ? 'projects' : 
                      type === 'message' ? 'messages' : 'demo-orders';
      
      await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE'
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
    setLoading(false);
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setShowForm(true);
    
    if (type === 'project') {
      setProjectForm({
        title: item.title,
        description: item.description,
        tech_stack: item.tech_stack,
        image: item.image || '',
        demo_link: item.demo_link || ''
      });
    } else if (type === 'order') {
      setOrderForm({
        status: item.status,
        assigned_rider: item.assigned_rider || ''
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setProjectForm({
      title: '',
      description: '',
      tech_stack: '',
      image: '',
      demo_link: ''
    });
    setOrderForm({
      status: 'pending',
      assigned_rider: ''
    });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your portfolio content</p>
          </div>
          <a href="/" className="back-to-site">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Site
          </a>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => { setActiveTab('projects'); setShowForm(false); }}
        >
          Projects
        </button>
        <button 
          className={activeTab === 'messages' ? 'active' : ''}
          onClick={() => { setActiveTab('messages'); setShowForm(false); }}
        >
          Messages
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => { setActiveTab('orders'); setShowForm(false); }}
        >
          Demo Orders
        </button>
      </div>

      <div className="admin-content">
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Projects</h2>
              <button 
                className="btn-primary"
                onClick={() => { 
                  if (showForm) {
                    // If form is showing, hide it and reset
                    resetForm();
                  } else {
                    // If form is hidden, show it and clear any editing state
                    setEditingItem(null);
                    setProjectForm({
                      title: '',
                      description: '',
                      tech_stack: '',
                      image: '',
                      demo_link: ''
                    });
                    setShowForm(true);
                  }
                }}
                type="button"
              >
                {showForm ? 'Cancel' : '+ Add Project'}
              </button>
            </div>

            {showForm && (
              <form className="admin-form" onSubmit={handleProjectSubmit}>
                <h3>{editingItem ? 'Edit Project' : 'New Project'}</h3>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  required
                  rows="4"
                />
                <input
                  type="text"
                  placeholder="Tech Stack (comma separated)"
                  value={projectForm.tech_stack}
                  onChange={(e) => setProjectForm({...projectForm, tech_stack: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                />
                <input
                  type="url"
                  placeholder="Demo Link (optional)"
                  value={projectForm.demo_link}
                  onChange={(e) => setProjectForm({...projectForm, demo_link: e.target.value})}
                />
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (editingItem ? 'Update Project' : 'Save Project')}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="data-table">
              {loading ? (
                <p>Loading...</p>
              ) : projects.length === 0 ? (
                <p className="empty-state">No projects yet. Add your first project!</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Tech Stack</th>
                      <th>Demo Link</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td className="truncate">{project.description}</td>
                        <td>{project.tech_stack}</td>
                        <td>
                          {project.demo_link && (
                            <a href={project.demo_link} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          )}
                        </td>
                        <td className="actions">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEdit(project, 'project')}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(project.id, 'project')}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Contact Messages</h2>
            </div>

            <div className="data-table">
              {loading ? (
                <p>Loading...</p>
              ) : messages.length === 0 ? (
                <p className="empty-state">No messages yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr key={message.id}>
                        <td>{message.name}</td>
                        <td>{message.email}</td>
                        <td className="truncate">{message.message}</td>
                        <td>{new Date(message.created_at).toLocaleDateString()}</td>
                        <td className="actions">
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(message.id, 'message')}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Demo Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Demo Orders</h2>
              <button 
                className="btn-primary"
                onClick={() => { 
                  if (showForm) {
                    resetForm();
                  } else {
                    setEditingItem(null);
                    setOrderForm({
                      status: 'pending',
                      assigned_rider: ''
                    });
                    setShowForm(true);
                  }
                }}
              >
                {showForm ? 'Cancel' : '+ Add Order'}
              </button>
            </div>

            {showForm && (
              <form className="admin-form" onSubmit={handleOrderSubmit}>
                <h3>{editingItem ? 'Edit Order' : 'New Order'}</h3>
                <select
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({...orderForm, status: e.target.value})}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="text"
                  placeholder="Assigned Rider (optional)"
                  value={orderForm.assigned_rider}
                  onChange={(e) => setOrderForm({...orderForm, assigned_rider: e.target.value})}
                />
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Order'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="data-table">
              {loading ? (
                <p>Loading...</p>
              ) : demoOrders.length === 0 ? (
                <p className="empty-state">No orders yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Status</th>
                      <th>Assigned Rider</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          <span className={`status-badge status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.assigned_rider || 'Unassigned'}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="actions">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEdit(order, 'order')}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(order.id, 'order')}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
