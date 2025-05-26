import { FaStar } from 'react-icons/fa';
import LazyImage from '../common/LazyImage';
import { useService } from '../../context/ServiceContext';

// Import images
import serviceRelax from '../../assets/images/service-relax.jpg';
import serviceNails from '../../assets/images/service-nails.jpg';
import servicePamper from '../../assets/images/service-pamper.jpg';
import serviceRevive from '../../assets/images/service-revive.jpg';

const ServiceCard = ({ id, title, image, rating, reviews, originalPrice, discountedPrice, link }) => {
  const { openServiceDetails } = useService();

  const handleClick = () => {
    // Directly open service details without navigation
    openServiceDetails(id);
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105">
        <div className="aspect-w-16 aspect-h-9">
          <LazyImage
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-400 mr-1">
              <FaStar />
            </div>
            <span className="text-sm text-gray-600">{rating} • {reviews} reviews</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 line-through text-sm mr-2">${originalPrice}</span>
              <span className="text-primary font-semibold">${discountedPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopPicks = () => {
  const { getServicesByDisplayCategory, loading } = useService();

  // Get services for the Top Picks section
  const topPicksServices = getServicesByDisplayCategory('Top Picks');

  // Fallback data in case no services are available
  const fallbackServices = [
    {
      id: 1,
      title: 'Relax and Rejuvenate: Salon & Spa',
      image: serviceRelax,
      rating: 4.8,
      reviews: 76,
      originalPrice: 120,
      discountedPrice: 99,
      link: '/services/relax-spa'
    },
    {
      id: 2,
      title: 'Flawless Nails, Right Fingertips',
      image: serviceNails,
      rating: 4.7,
      reviews: 58,
      originalPrice: 80,
      discountedPrice: 65,
      link: '/services/nails'
    },
    {
      id: 3,
      title: 'Pamper Yourself: Salon & Spa',
      image: servicePamper,
      rating: 4.9,
      reviews: 84,
      originalPrice: 150,
      discountedPrice: 120,
      link: '/services/pamper-spa'
    },
    {
      id: 4,
      title: 'Revive at Home: Expert Salon',
      image: serviceRevive,
      rating: 4.8,
      reviews: 92,
      originalPrice: 130,
      discountedPrice: 110,
      link: '/services/revive-salon'
    }
  ];

  // Use dynamic services if available, otherwise use fallback
  const displayServices = topPicksServices.length > 0 ? topPicksServices.slice(0, 4) : fallbackServices;

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Top Pick for you</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                image={service.image}
                rating={service.rating}
                reviews={service.reviews}
                originalPrice={service.originalPrice}
                discountedPrice={service.discountedPrice}
                link={service.link}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPicks;
