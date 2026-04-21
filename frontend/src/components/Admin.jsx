import { useState, useEffect, useRef } from 'react';
import Login from './Login';
import { themes, applyTheme } from '../themes';
import './Admin.css';

const API_URL = 'https://portfolio-v1-2uu3.onrender.com/api';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const [settings, setSettings] = useState({
    hero_title: 'Hi, I\'m',
    hero_name: 'Your Name',
    hero_subtitle: 'Full Stack Developer',
    about_title: 'About Me',
    about_description: 'Your about description',
    skills_title: 'My Skills',
    projects_title: 'My Projects',
    contact_title: 'Get In Touch',
    theme: 'cyan'
  });

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      fetchSettings();
    }
  }, [activeTab, isAuthenticated]);

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

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setSettings(data);
        }
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Apply theme immediately
      applyTheme(settings.theme);
      
      const res = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setSuccess('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
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

  const handleEdit = (project) => {
    setEditingItem(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack,
      image: project.image || '',
      demo_link: project.demo_link || '',
      github_link: project.github_link || ''
    });
    setImagePreview(project.image);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1>Admin Panel</h1>
            <p>Manage your portfolio content</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="/" className="back-to-site">
              ← Back to Site
            </a>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
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
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
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
                <h3>{editingItem ? 'Edit Project' : 'Add New Project'}</h3>
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
                {loading ? 'Saving...' : editingItem ? 'Update Project' : 'Save Project'}
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
                          <button className="btn-edit" onClick={() => handleEdit(p)}>
                            Edit
                          </button>
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

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Portfolio Settings</h2>
            </div>

            <form className="admin-form" onSubmit={handleSettingsSubmit}>
              <h3>Hero Section</h3>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <input
                placeholder="Hero Title (e.g., Hi, I'm)"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              />

              <input
                placeholder="Your Name"
                value={settings.hero_name}
                onChange={(e) => setSettings({ ...settings, hero_name: e.target.value })}
              />

              <input
                placeholder="Subtitle (e.g., Full Stack Developer)"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              />

              <h3>About Section</h3>
              <input
                placeholder="About Title"
                value={settings.about_title}
                onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
              />

              <textarea
                placeholder="About Description"
                value={settings.about_description}
                onChange={(e) => setSettings({ ...settings, about_description: e.target.value })}
                rows="5"
              />

              <h3>Other Sections</h3>
              <input
                placeholder="Skills Title"
                value={settings.skills_title}
                onChange={(e) => setSettings({ ...settings, skills_title: e.target.value })}
              />

              <input
                placeholder="Projects Title"
                value={settings.projects_title}
                onChange={(e) => setSettings({ ...settings, projects_title: e.target.value })}
              />

              <input
                placeholder="Contact Title"
                value={settings.contact_title}
                onChange={(e) => setSettings({ ...settings, contact_title: e.target.value })}
              />

              <h3>Theme Selection</h3>
              <div className="theme-selector">
                {Object.keys(themes).map((themeKey) => (
                  <div
                    key={themeKey}
                    className={`theme-option ${settings.theme === themeKey ? 'active' : ''}`}
                    onClick={() => {
                      setSettings({ ...settings, theme: themeKey });
                      applyTheme(themeKey);
                    }}
                  >
                    <div 
                      className="theme-preview" 
                      style={{
                        background: themes[themeKey].gradient,
                        boxShadow: `0 0 20px ${themes[themeKey].glow}`
                      }}
                    ></div>
                    <span className="theme-name">{themes[themeKey].name}</span>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}