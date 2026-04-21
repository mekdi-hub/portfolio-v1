import { useState, useEffect, useRef } from 'react';
import './Admin.css';

const API_URL = 'https://portfolio-v1-2uu3.onrender.com/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [demoOrders, setDemoOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tech_stack: '',
    image: '',
    demo_link: '',
    github_link: ''
  });

  const imageFileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

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
      console.error(error);
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUseFileUpload(true);
      imageFileRef.current = file;
      setSelectedFileName(file.name);
      setProjectForm({ ...projectForm, image: '' });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
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
      demo_link: '',
      github_link: ''
    });
    imageFileRef.current = null;
    setImagePreview(null);
    setUseFileUpload(false);
    setSelectedFileName('');
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      
      // Add all project fields
      formData.append('title', projectForm.title);
      formData.append('description', projectForm.description);
      formData.append('tech_stack', projectForm.tech_stack);
      
      if (projectForm.demo_link) {
        formData.append('demo_link', projectForm.demo_link);
      }
      
      if (projectForm.github_link) {
        formData.append('github_link', projectForm.github_link);
      }

      // Add image - either file or URL
      if (useFileUpload && imageFileRef.current) {
        formData.append('image', imageFileRef.current);
      } else if (projectForm.image) {
        formData.append('image_url', projectForm.image);
      }

      const url = editingItem
        ? `${API_URL}/projects/${editingItem.id}`
        : `${API_URL}/projects`;

      const method = editingItem ? 'PUT' : 'POST';

      // For PUT requests, we need to use POST with _method override
      if (editingItem) {
        formData.append('_method', 'PUT');
      }

      const res = await fetch(url, {
        method: editingItem ? 'POST' : 'POST', // Always use POST, Laravel will handle _method
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Project saved successfully!');
        resetForm();
        fetchData();
      } else {
        throw new Error(data.message || data.error || 'Failed to save project');
      }
    } catch (err) {
      setError(err.message);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    await fetch(`${API_URL}/${type === 'project' ? 'projects' : type}/${id}`, {
      method: 'DELETE'
    });
    fetchData();
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Admin Panel</h1>
            <p>Manage your portfolio content</p>
          </div>
          <a href="/" className="back-to-site">
            ← Back to Site
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={activeTab === 'messages' ? 'active' : ''}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Projects</h2>
              <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : '+ Add Project'}
              </button>
            </div>

            {showForm && (
              <form className="admin-form" onSubmit={handleProjectSubmit}>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <input
                  placeholder="Title"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  required
                />

                <textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, description: e.target.value })
                  }
                  required
                />

                <input
                  placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                  value={projectForm.tech_stack}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, tech_stack: e.target.value })
                  }
                  required
                />

                <input
                  placeholder="Demo Link (optional)"
                  value={projectForm.demo_link}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, demo_link: e.target.value })
                  }
                />

                <input
                  placeholder="GitHub Link (optional)"
                  value={projectForm.github_link}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, github_link: e.target.value })
                  }
                />

              <div className="image-upload-section">
                <label>Project Image:</label>
                
                <div className="upload-options">
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="imageFile"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="imageFile" className="file-upload-btn">
                      📁 Choose Image File
                    </label>
                    {selectedFileName && (
                      <span className="file-name">{selectedFileName}</span>
                    )}
                  </div>

                  <div className="url-divider">OR</div>

                  <input
                    type="url"
                    placeholder="Enter Image URL"
                    value={projectForm.image}
                    onChange={(e) => {
                      setProjectForm({ ...projectForm, image: e.target.value });
                      setUseFileUpload(false);
                      setImagePreview(e.target.value);
                      setSelectedFileName('');
                    }}
                  />
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Project'}
              </button>
            </form>
            )}

            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Tech</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td>{p.title}</td>
                      <td className="truncate">{p.description}</td>
                      <td>{p.tech_stack}</td>

                      <td>
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{
                            width: '80px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/80x50?text=No+Image';
                          }}
                        />
                      </td>

                      <td>
                        <div className="actions">
                          <button className="btn-delete" onClick={() => handleDelete(p.id, 'projects')}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}