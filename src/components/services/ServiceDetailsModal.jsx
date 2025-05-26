import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaTimes, FaClock, FaMapMarkerAlt, FaTag, FaCheck, FaUserAlt } from 'react-icons/fa';
import LazyImage from '../common/LazyImage';
import LazyVideo from '../common/LazyVideo';
import { useService } from '../../context/ServiceContext';
import serviceRelax from '../../assets/images/service-relax.jpg';

const ServiceDetailsModal = ({ serviceId, onClose }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllServices } = useService();

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching service details for ID:', serviceId);

        // First try to find the service in our dynamic services
        const allServices = getAllServices();
        const foundService = allServices.find(s => s.id === serviceId);

        if (foundService) {
          console.log('Found dynamic service:', foundService);
          // Enhance the service with additional details if needed
          const enhancedService = enhanceServiceDetails(foundService);
          setService(enhancedService);
        } else {
          // Fallback to mock data for static services
          console.log('Service not found in dynamic services, generating mock data');
          const mockData = generateMockServiceDetails(serviceId);
          setService(mockData);
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
        setError('Failed to load service details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId, getAllServices]);

  // Function to enhance dynamic service with additional details
  const enhanceServiceDetails = (service) => {
    // If the service already has all required fields, return as is
    if (service.description && service.duration && service.professionals &&
        service.includes && service.excludes) {
      return {
        ...service,
        location: 'At your home',
        availability: generateAvailability()
      };
    }

    // Otherwise, enhance with default values based on category
    const isCleaningService = service.category === 'Cleaning' ||
                             service.title.toLowerCase().includes('cleaning');
    const isSalonService = service.category === 'Beauty & Wellness' ||
                          service.title.toLowerCase().includes('salon') ||
                          service.title.toLowerCase().includes('spa') ||
                          service.title.toLowerCase().includes('beauty');
    const isHealthcareService = service.category === 'Healthcare' ||
                               service.title.toLowerCase().includes('healthcare');

    let defaults = {};

    if (isCleaningService) {
      defaults = {
        duration: service.duration || '2-3 hours',
        professionals: service.professionals || ['Professional Cleaners', 'Equipment Specialists'],
        includes: service.includes || [
          'Deep cleaning of all rooms',
          'Dusting and vacuuming',
          'Bathroom sanitization',
          'Kitchen cleaning',
          'Floor mopping'
        ],
        excludes: service.excludes || [
          'Window exterior cleaning',
          'Furniture moving',
          'Wall washing',
          'Ceiling cleaning'
        ]
      };
    } else if (isSalonService) {
      defaults = {
        duration: service.duration || '1-2 hours',
        professionals: service.professionals || ['Licensed Beauticians', 'Spa Therapists'],
        includes: service.includes || [
          'Consultation before service',
          'Premium products',
          'Relaxing environment',
          'Post-service care tips'
        ],
        excludes: service.excludes || [
          'Products to take home',
          'Medical treatments',
          'Permanent makeup'
        ]
      };
    } else if (isHealthcareService) {
      defaults = {
        duration: service.duration || '30-60 minutes',
        professionals: service.professionals || ['Licensed Healthcare Professionals', 'Certified Nurses'],
        includes: service.includes || [
          'Initial health assessment',
          'Vital signs monitoring',
          'Basic health check',
          'Health recommendations'
        ],
        excludes: service.excludes || [
          'Prescription medications',
          'Invasive procedures',
          'Long-term treatment plans'
        ]
      };
    } else {
      defaults = {
        duration: service.duration || '1-2 hours',
        professionals: service.professionals || ['Certified Professionals'],
        includes: service.includes || [
          'Professional service',
          'Quality assurance',
          'Customer satisfaction guarantee'
        ],
        excludes: service.excludes || [
          'Additional services not specified',
          'Products not included in package'
        ]
      };
    }

    return {
      ...service,
      description: service.description || `Experience the best ${service.title} service at your doorstep. Our professional team ensures high-quality service tailored to your specific needs.`,
      location: 'At your home',
      ...defaults,
      availability: generateAvailability()
    };
  };

  // Function to generate mock service details based on serviceId
  const generateMockServiceDetails = (id) => {
    // Find the basic service info from our mock data
    const basicService = findServiceById(id);

    if (!basicService) {
      console.error('Service not found with ID:', id);
      // Create a fallback service with minimal data
      const fallbackService = {
        id: id,
        title: `Service ${id}`,
        image: serviceRelax,
        rating: 4.5,
        reviews: 50,
        originalPrice: 100,
        discountedPrice: 80,
        link: '#'
      };
      return createServiceDetails(fallbackService);
    }

    return createServiceDetails(basicService);
  };

  // Helper function to create service details from basic service info
  const createServiceDetails = (basicService) => {

    // Generate additional details based on the service title
    const isCleaningService = basicService.title.toLowerCase().includes('cleaning');
    const isSalonService = basicService.title.toLowerCase().includes('salon') ||
                          basicService.title.toLowerCase().includes('spa') ||
                          basicService.title.toLowerCase().includes('beauty');
    const isHealthcareService = basicService.title.toLowerCase().includes('healthcare') ||
                               basicService.title.toLowerCase().includes('health');

    // Generate service-specific details
    let serviceSpecificDetails = {};

    if (isCleaningService) {
      serviceSpecificDetails = {
        category: 'Cleaning',
        duration: '2-3 hours',
        professionals: ['Professional Cleaners', 'Equipment Specialists'],
        includes: [
          'Deep cleaning of all rooms',
          'Dusting and vacuuming',
          'Bathroom sanitization',
          'Kitchen cleaning',
          'Floor mopping'
        ],
        excludes: [
          'Window exterior cleaning',
          'Furniture moving',
          'Wall washing',
          'Ceiling cleaning'
        ]
      };
    } else if (isSalonService) {
      serviceSpecificDetails = {
        category: 'Beauty & Wellness',
        duration: '1-2 hours',
        professionals: ['Licensed Beauticians', 'Spa Therapists'],
        includes: [
          'Consultation before service',
          'Premium products',
          'Relaxing environment',
          'Post-service care tips'
        ],
        excludes: [
          'Products to take home',
          'Medical treatments',
          'Permanent makeup'
        ]
      };
    } else if (isHealthcareService) {
      serviceSpecificDetails = {
        category: 'Healthcare',
        duration: '30-60 minutes',
        professionals: ['Licensed Healthcare Professionals', 'Certified Nurses'],
        includes: [
          'Initial health assessment',
          'Vital signs monitoring',
          'Basic health check',
          'Health recommendations'
        ],
        excludes: [
          'Prescription medications',
          'Invasive procedures',
          'Long-term treatment plans'
        ]
      };
    } else {
      // Default service details
      serviceSpecificDetails = {
        category: 'General Services',
        duration: '1-2 hours',
        professionals: ['Certified Professionals'],
        includes: [
          'Professional service',
          'Quality assurance',
          'Customer satisfaction guarantee'
        ],
        excludes: [
          'Additional services not specified',
          'Products not included in package'
        ]
      };
    }

    // Return complete mock service details
    return {
      ...basicService,
      description: `Experience the best ${basicService.title} service at your doorstep. Our professional team ensures high-quality service tailored to your specific needs.`,
      category: serviceSpecificDetails.category,
      duration: serviceSpecificDetails.duration,
      location: 'At your home',
      professionals: serviceSpecificDetails.professionals,
      includes: serviceSpecificDetails.includes,
      excludes: serviceSpecificDetails.excludes,
      availability: generateAvailability()
    };
  };

  // Helper function to find a service by ID from our mock data
  const findServiceById = (id) => {
    // Convert id to number if it's a string
    const numId = typeof id === 'string' ? parseInt(id) : id;
    console.log('Looking for service with ID:', numId);

    // Create a fallback service with the given ID
    const fallbackService = {
      id: numId,
      title: `Service ${numId}`,
      image: serviceRelax,
      rating: 4.5,
      reviews: 50,
      originalPrice: 100,
      discountedPrice: 80,
      link: '#'
    };

    try {
      // Try to find the service in all our mock data collections
      const basicServices = apiService.services.getAll() || [];
      const topPicks = apiService.services.getTopPicks() || [];
      const trending = apiService.services.getTrending() || [];
      const newServices = apiService.services.getNew() || [];

      const allServices = [
        ...basicServices,
        ...topPicks,
        ...trending,
        ...newServices
      ];

      // Find the service by ID
      const foundService = allServices.find(service => service.id === numId);

      if (foundService) {
        console.log('Found service:', foundService);
        return foundService;
      }
    } catch (error) {
      console.error('Error finding service:', error);
    }

    // Return fallback service if no service is found
    console.log('Using fallback service for ID:', numId);
    return fallbackService;
  };

  // Generate mock availability
  const generateAvailability = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const availability = {};

    days.forEach(day => {
      if (day === 'Sunday') {
        availability[day] = { open: false, hours: null };
      } else {
        availability[day] = {
          open: true,
          hours: '9:00 AM - 6:00 PM'
        };
      }
    });

    return availability;
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-700">
            {error || "Service not found or unable to load service details. Please try again later."}
          </p>
          <button
            onClick={onClose}
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
        >
          <FaTimes className="w-5 h-5 text-gray-700" />
        </button>

        {/* Service media (image or video) */}
        <div className="relative h-64 md:h-80">
          {service.mediaType === 'video' ? (
            <div className="w-full h-full bg-black">
              <LazyVideo
                src={service.image}
                className="w-full h-full"
              />
            </div>
          ) : (
            <LazyImage
              src={typeof service.image === 'string' && service.image.startsWith('/')
                ? service.image.substring(1) // Remove leading slash if it exists
                : service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-white text-2xl md:text-3xl font-bold">{service.title}</h1>
            {service.rating && (
              <div className="flex items-center mt-2">
                <div className="flex items-center text-yellow-400">
                  <FaStar />
                </div>
                <span className="text-white ml-1">{service.rating} • {service.reviews} reviews</span>
              </div>
            )}
          </div>
        </div>

        {/* Service details */}
        <div className="p-6">
          {/* Price and Book Now button */}
          {service.originalPrice && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Price</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-500 line-through text-lg mr-2">${service.originalPrice}</span>
                  <span className="text-primary font-bold text-2xl">${service.discountedPrice}</span>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {Math.round((1 - service.discountedPrice / service.originalPrice) * 100)}% OFF
                  </span>
                </div>
                <Link
                  to="/contact"
                  className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition inline-block text-center"
                  onClick={onClose}
                >
                  Book Now
                </Link>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{service.description}</p>
          </div>

          {/* Service details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaTag className="text-primary mr-2" />
                <h3 className="font-semibold">Category</h3>
              </div>
              <p className="text-gray-700">{service.category}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaClock className="text-primary mr-2" />
                <h3 className="font-semibold">Duration</h3>
              </div>
              <p className="text-gray-700">{service.duration}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-primary mr-2" />
                <h3 className="font-semibold">Location</h3>
              </div>
              <p className="text-gray-700">{service.location}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaUserAlt className="text-primary mr-2" />
                <h3 className="font-semibold">Professionals</h3>
              </div>
              <ul className="text-gray-700">
                {service.professionals.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* What's included/excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">What's Included</h2>
              <ul className="space-y-2">
                {service.includes.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">What's Not Included</h2>
              <ul className="space-y-2">
                {service.excludes.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaTimes className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Availability</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(service.availability).map(([day, info]) => (
                <div key={day} className={`p-3 rounded-lg ${info.open ? 'bg-gray-50' : 'bg-gray-100'}`}>
                  <p className="font-medium">{day}</p>
                  <p className={info.open ? 'text-green-600' : 'text-red-600'}>
                    {info.open ? info.hours : 'Closed'}
                  </p>
                </div>
              ))}
            </div>
          </div>




        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
