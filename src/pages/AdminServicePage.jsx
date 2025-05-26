import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaVideo } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useService } from '../context/ServiceContext';
import LazyVideo from '../components/common/LazyVideo';

const AdminServicePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { services, loading, addService, updateService, deleteService } = useService();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    duration: '',
    originalPrice: '',
    discountedPrice: '',
    professionals: '',
    includes: '',
    excludes: '',
    image: null,
    mediaType: null,
    displayCategory: ''
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Services are now managed by ServiceContext, no need to fetch them here

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Determine if the file is an image or video
      const fileType = file.type.split('/')[0];

      setFormData({
        ...formData,
        image: file,
        mediaType: fileType
      });

      setMediaType(fileType);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.title || !formData.category || !formData.description ||
        !formData.originalPrice || !formData.discountedPrice) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const serviceData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        duration: formData.duration,
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
        professionals: formData.professionals.split(',').map(item => item.trim()).filter(item => item),
        includes: formData.includes.split(',').map(item => item.trim()).filter(item => item),
        excludes: formData.excludes.split(',').map(item => item.trim()).filter(item => item),
        image: mediaPreview || 'https://via.placeholder.com/300x200?text=Service+Image',
        mediaType: mediaType || 'image',
        displayCategory: formData.displayCategory || 'General',
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        reviews: Math.floor(Math.random() * 100) + 10, // Random reviews between 10-110
        link: `/services/${formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
      };

      if (editingId) {
        // Update existing service
        const updatedService = { ...serviceData, id: editingId };
        await updateService(updatedService);
        setSuccess('Service updated successfully!');
      } else {
        // Add new service
        await addService(serviceData);
        setSuccess('Service created successfully!');
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service. Please try again.');
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      category: service.category || '',
      description: service.description || '',
      duration: service.duration || '',
      originalPrice: service.originalPrice || '',
      discountedPrice: service.discountedPrice || '',
      professionals: Array.isArray(service.professionals) ? service.professionals.join(', ') : '',
      includes: Array.isArray(service.includes) ? service.includes.join(', ') : '',
      excludes: Array.isArray(service.excludes) ? service.excludes.join(', ') : '',
      image: null,
      mediaType: service.mediaType || 'image',
      displayCategory: service.displayCategory || ''
    });
    setMediaPreview(typeof service.image === 'string' ? service.image : null);
    setMediaType(service.mediaType || 'image');
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        setSuccess('Service deleted successfully!');
      } catch (error) {
        setError('Failed to delete service. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      duration: '',
      originalPrice: '',
      discountedPrice: '',
      professionals: '',
      includes: '',
      excludes: '',
      image: null,
      mediaType: null,
      displayCategory: ''
    });
    setMediaPreview(null);
    setMediaType(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{editingId ? 'Edit Service' : 'Create New Service'}</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 mb-1">Service Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="block text-gray-700 mb-1">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Beauty & Wellness">Beauty & Wellness</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Home Maintenance">Home Maintenance</option>
                    <option value="General Services">General Services</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="displayCategory" className="block text-gray-700 mb-1">Display Section</label>
                  <select
                    id="displayCategory"
                    name="displayCategory"
                    value={formData.displayCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select display section</option>
                    <option value="General">General Services</option>
                    <option value="Top Picks">Top Picks</option>
                    <option value="Trending">Trending</option>
                    <option value="New">New Services</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Choose where this service will appear on the homepage</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 mb-1">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="duration" className="block text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g. 1-2 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Pricing & Details</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="originalPrice" className="block text-gray-700 mb-1">Original Price *</label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="discountedPrice" className="block text-gray-700 mb-1">Discounted Price *</label>
                    <input
                      type="number"
                      id="discountedPrice"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="professionals" className="block text-gray-700 mb-1">Professionals (comma separated)</label>
                  <input
                    type="text"
                    id="professionals"
                    name="professionals"
                    value={formData.professionals}
                    onChange={handleInputChange}
                    placeholder="e.g. Licensed Beauticians, Spa Therapists"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="includes" className="block text-gray-700 mb-1">What's Included (comma separated)</label>
                  <textarea
                    id="includes"
                    name="includes"
                    value={formData.includes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="e.g. Consultation, Premium products, Relaxing environment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="excludes" className="block text-gray-700 mb-1">What's Not Included (comma separated)</label>
                  <textarea
                    id="excludes"
                    name="excludes"
                    value={formData.excludes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="e.g. Products to take home, Medical treatments"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="image" className="block text-gray-700 mb-1">Service Media (Image or Video)</label>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaImage className="text-gray-500" />
                    <span className="text-sm text-gray-500">Images</span>
                    <FaVideo className="text-gray-500 ml-4" />
                    <span className="text-sm text-gray-500">Videos</span>
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleMediaChange}
                    accept="image/*,video/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  {mediaPreview && (
                    <div className="mt-2">
                      {mediaType === 'image' ? (
                        <img src={mediaPreview} alt="Preview" className="h-32 object-cover rounded-md" />
                      ) : mediaType === 'video' ? (
                        <div className="h-48 rounded-md overflow-hidden">
                          <LazyVideo src={mediaPreview} className="w-full h-full" />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
              >
                <FaSave className="mr-2" />
                {editingId ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>

        <h2 className="text-2xl font-bold mb-4">All Services</h2>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <p className="text-gray-600">No services found. Create your first service above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Display Section</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{service.id}</td>
                    <td className="py-3 px-4">{service.title}</td>
                    <td className="py-3 px-4">{service.category || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.displayCategory === 'Top Picks' ? 'bg-yellow-100 text-yellow-800' :
                        service.displayCategory === 'Trending' ? 'bg-red-100 text-red-800' :
                        service.displayCategory === 'New' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {service.displayCategory || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="line-through text-gray-500 mr-2">${service.originalPrice}</span>
                      <span className="text-primary font-semibold">${service.discountedPrice}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminServicePage;
