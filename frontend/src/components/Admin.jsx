import { useState, useEffect, useRef } from 'react';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://portfolio-v1-2uu3.onrender.com/api';

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
    demo_link: '',
    github_link: ''
  });

  const imageFileRef = useRef(null); // Use ref instead of state for File object
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [useFileUpload, setUseFileUpload] = useState(false); // Track which method user is using
  const [selectedFileName, setSelectedFileName] = useState(''); // Track filename for display

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected in handleImageChange:', file);
    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      setUseFileUpload(true);
      imageFileRef.current = file; // Store in ref
      setSelectedFileName(file.name); // Store filename for display
      setProjectForm({...projectForm, image: ''}); // Clear URL when file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
  };

  const uploadImage = async () => {
    const imageFile = imageFileRef.current;
    if (!imageFile) {
      console.error('No image file in ref!');
      setError('No image file selected');
      return null;
    }

    // Validate file size (20MB max)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (imageFile.size > maxSize) {
      setError(`File too large. Maximum size is 20MB. Your file is ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`);
      return null;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      setError(`Invalid file type. Supported types: JPEG, PNG, GIF, SVG, WebP. Your file type: ${imageFile.type}`);
      return null;
    }

    setUploadingImage(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      console.log('Uploading image:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);

      const res = await fetch(`${API_URL}/projects/upload-image`, {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', res.status);
      
      // Try to parse JSON response
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        const textResponse = await res.text();
        console.error('Response text:', textResponse);
        setError('Server returned invalid response. Check backend logs.');
        return null;
      }

      console.log('Upload response data:', JSON.stringify(data, null, 2));

      if (res.ok && data.success) {
        console.log('Upload successful, URL:', data.url);
        setSuccess('Image uploaded successfully!');
        return data.url;
      }
      
      // Handle error response
      console.error('Upload failed:', JSON.stringify(data, null, 2));
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat().join(', ');
        setError(`Upload failed: ${errorMessages}`);
      } else {
        setError(`Upload failed: ${data.message || 'Unknown error. Check backend logs.'}`);
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(`Network error: ${error.message}. Make sure backend is running.`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = projectForm.image;

      console.log('Submit - useFileUpload:', useFileUpload);
      console.log('Submit - imageFileRef.current:', imageFileRef.current);
      console.log('Submit - projectForm.image:', projectForm.image);

      // Only upload if a file was selected (not using URL method)
      if (useFileUpload && imageFileRef.current) {
        console.log('Image file selected, uploading...');
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          console.log('Image uploaded successfully:', imageUrl);
        } else {
          // Upload failed - error already set by uploadImage()
          setLoading(false);
          return;
        }
      }

      const projectData = {
        ...projectForm,
        image: imageUrl
      };

      console.log('Saving project data:', projectData);

      const url = editingItem 
        ? `${API_URL}/projects/${editingItem.id}`
        : `${API_URL}/projects`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Project saved:', result);
        setSuccess(editingItem ? 'Project updated successfully!' : 'Project created successfully!');
        resetForm();
        fetchData();
      } else {
        const errorData = await res.json();
        console.error('Server error:', errorData);
        setError(errorData.message || 'Failed to save project. Please check all fields.');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Network error. Please check if the backend is running.');
    }
    setLoading(false);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
        setSuccess(editingItem ? 'Order updated successfully!' : 'Order created successfully!');
        resetForm();
        fetchData();
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to save order.');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      setError('Network error. Please check if the backend is running.');
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
        demo_link: item.demo_link || '',
        github_link: item.github_link || ''
      });
      setImagePreview(item.image || null);
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
      demo_link: '',
      github_link: ''
    });
    setOrderForm({
      status: 'pending',
      assigned_rider: ''
    });
    imageFileRef.current = null;
    setImagePreview(null);
    setUseFileUpload(false);
    setSelectedFileName('');
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
        {/* Success/Error Messages */}
        {success && (
          <div className="alert alert-success">
            {success}
            <button onClick={() => setSuccess(null)} className="alert-close">✕</button>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)} className="alert-close">✕</button>
          </div>
        )}

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
                <div className="image-upload-section">
                  <label className="image-upload-label">
                    Project Media (Image or Video)
                  </label>
                  
                  <div className="image-input-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${!useFileUpload ? 'active' : ''}`}
                      onClick={() => {
                        setUseFileUpload(false);
                        imageFileRef.current = null;
                        setSelectedFileName('');
                        setImagePreview(projectForm.image || null);
                      }}
                    >
                      📎 Media URL (Recommended)
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${useFileUpload ? 'active' : ''}`}
                      onClick={() => {
                        setUseFileUpload(true);
                        const fileInput = document.getElementById('file-input');
                        if (fileInput) fileInput.click();
                      }}
                    >
                      📁 Upload File
                    </button>
                  </div>

                  {!useFileUpload ? (
                    <>
                      <input
                        type="text"
                        placeholder="Paste image, video, or YouTube URL here"
                        value={projectForm.image}
                        onChange={(e) => {
                          setProjectForm({...projectForm, image: e.target.value});
                          setImagePreview(e.target.value);
                        }}
                      />
                      <small style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                        💡 Supports: Image URLs, YouTube links, or direct video URLs (.mp4, .webm)
                      </small>
                    </>
                  ) : (
                    <div style={{ padding: '10px', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '5px', marginBottom: '10px' }}>
                      {selectedFileName ? (
                        <>
                          <strong>File selected:</strong> {selectedFileName}
                        </>
                      ) : (
                        <span style={{ color: '#64748b' }}>Click "Upload File" button above to select media</span>
                      )}
                    </div>
                  )}

                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    style={{ display: 'none' }}
                  />
                  <small style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                    Maximum file size: 20MB
                  </small>

                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" fill="gray">Invalid Image</text></svg>';
                      }} />
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={() => {
                          imageFileRef.current = null;
                          setImagePreview(null);
                          setProjectForm({...projectForm, image: ''});
                          setUseFileUpload(false);
                          setSelectedFileName('');
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {uploadingImage && <p className="upload-status">Uploading image...</p>}
                </div>
                <input
                  type="url"
                  placeholder="Demo Link (optional)"
                  value={projectForm.demo_link}
                  onChange={(e) => setProjectForm({...projectForm, demo_link: e.target.value})}
                />
                <input
                  type="url"
                  placeholder="GitHub Repository URL (optional)"
                  value={projectForm.github_link}
                  onChange={(e) => setProjectForm({...projectForm, github_link: e.target.value})}
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
