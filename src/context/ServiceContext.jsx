import { createContext, useState, useContext, useEffect } from 'react';
import ServiceDetailsModal from '../components/services/ServiceDetailsModal';

// Create the context
const ServiceContext = createContext(null);

// Custom hook to use the service context
export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};

// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Service provider component
export const ServiceProvider = ({ children }) => {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load services from backend API on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (response.ok) {
          const servicesData = await response.json();
          setServices(servicesData);
        } else {
          console.error('Failed to fetch services from backend');
        }
      } catch (error) {
        console.error('Error loading services from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const openServiceDetails = (id) => {
    console.log('Opening service details for ID:', id);
    // Convert id to number if it's a string
    const numId = typeof id === 'string' ? parseInt(id) : id;
    setSelectedServiceId(numId);
  };

  const closeServiceDetails = () => {
    setSelectedServiceId(null);
  };

  const addService = async (service) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        const newService = await response.json();
        setServices(prevServices => [...prevServices, newService]);
        return newService;
      } else {
        throw new Error('Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  };

  const updateService = async (updatedService) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${updatedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedService),
      });

      if (response.ok) {
        const updated = await response.json();
        setServices(prevServices =>
          prevServices.map(service =>
            service.id === updatedService.id ? updated : service
          )
        );
        return updated;
      } else {
        throw new Error('Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  const deleteService = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(prevServices => prevServices.filter(service => service.id !== id));
        return true;
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  };

  // Get services by category
  const getServicesByCategory = (category) => {
    return services.filter(service => service.category === category);
  };

  // Get services by display category (Top Picks, Trending, New)
  const getServicesByDisplayCategory = (displayCategory) => {
    return services.filter(service => service.displayCategory === displayCategory);
  };

  // Get all services for display
  const getAllServices = () => {
    return services;
  };

  // Create the context value
  const contextValue = {
    services,
    loading,
    openServiceDetails,
    closeServiceDetails,
    addService,
    updateService,
    deleteService,
    getServicesByCategory,
    getServicesByDisplayCategory,
    getAllServices
  };

  return (
    <ServiceContext.Provider value={contextValue}>
      {children}
      {selectedServiceId && (
        <ServiceDetailsModal
          serviceId={selectedServiceId}
          onClose={closeServiceDetails}
        />
      )}
    </ServiceContext.Provider>
  );
};
