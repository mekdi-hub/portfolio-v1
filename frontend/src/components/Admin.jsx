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
  const [uploadingImage, setUploadingImage] = useState(false);
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

    let imageUrl = projectForm.image;

    const projectData = {
      ...projectForm,
      image: imageUrl
    };

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
      setSuccess('Saved successfully');
      resetForm();
      fetchData();
    } else {
      setError('Failed to save');
    }

    setLoading(false);
  };

  const handleDelete = async (id, type) => {
    await fetch(`${API_URL}/${type === 'project' ? 'projects' : type}/${id}`, {
      method: 'DELETE'
    });
    fetchData();
  };

  return (
    <div className="admin-container">

      {/* Tabs */}
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('projects')}>Projects</button>
        <button onClick={() => setActiveTab('messages')}>Messages</button>
        <button onClick={() => setActiveTab('orders')}>Orders</button>
      </div>

      {/* PROJECTS */}
      {activeTab === 'projects' && (
        <>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>

          {showForm && (
            <form onSubmit={handleProjectSubmit}>
              <input
                placeholder="Title"
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, title: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, description: e.target.value })
                }
              />

              <input
                placeholder="Tech Stack"
                value={projectForm.tech_stack}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, tech_stack: e.target.value })
                }
              />

              <input
                placeholder="Image URL"
                value={projectForm.image}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, image: e.target.value })
                }
              />

              <button type="submit">Save</button>
            </form>
          )}

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Tech</th>
                <th>Image</th> {/* ✅ FIX */}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.description}</td>
                  <td>{p.tech_stack}</td>

                  {/* ✅ IMAGE FIX */}
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
                    <button onClick={() => handleDelete(p.id, 'projects')}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}