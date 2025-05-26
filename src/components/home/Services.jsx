import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';
import { useService } from '../../context/ServiceContext';

// Import images for fallback
import serviceCleaning from '../../assets/images/service-cleaning.jpg';
import serviceSalon from '../../assets/images/service-salon.jpg';
import serviceHealthcare from '../../assets/images/service-healthcare.jpg';
import serviceAC from '../../assets/images/service-ac.jpg';

const ServiceCard = ({ title, image, link }) => {
  return (
    <Link to="/services" className="block group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105">
        <div className="aspect-w-1 aspect-h-1">
          <LazyImage
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

const Services = () => {
  const { getServicesByDisplayCategory, loading } = useService();

  // Get services for the General section
  const generalServices = getServicesByDisplayCategory('General');

  // Fallback data in case no services are available
  const fallbackServices = [
    {
      id: 1,
      title: 'General Cleaning',
      image: serviceCleaning,
      link: '/services/cleaning'
    },
    {
      id: 2,
      title: 'Salon & Spa at Home',
      image: serviceSalon,
      link: '/services/salon'
    },
    {
      id: 3,
      title: 'Healthcare Home',
      image: serviceHealthcare,
      link: '/services/healthcare'
    },
    {
      id: 4,
      title: 'AC Cleaning',
      image: serviceAC,
      link: '/services/ac-cleaning'
    }
  ];

  // Use dynamic services if available, otherwise use fallback
  const displayServices = generalServices.length > 0 ? generalServices.slice(0, 4) : fallbackServices;

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Service</h2>
          <Link to="/services" className="text-gray-500 hover:text-primary">
            All Service
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                image={service.image}
                link={service.link}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
