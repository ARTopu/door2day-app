import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LazyImage from '../components/common/LazyImage';
import LazyVideo from '../components/common/LazyVideo';
import { FaStar } from 'react-icons/fa';
import { useService } from '../context/ServiceContext';
import serviceRelax from '../assets/images/service-relax.jpg';
import serviceNails from '../assets/images/service-nails.jpg';
import servicePamper from '../assets/images/service-pamper.jpg';
import serviceRevive from '../assets/images/service-revive.jpg';
import trendingSpa from '../assets/images/trending-spa.jpg';
import trendingCleaning from '../assets/images/trending-cleaning.jpg';
import trendingAC from '../assets/images/trending-ac.jpg';
import trendingPro from '../assets/images/trending-pro.jpg';
import newSalon from '../assets/images/new-salon.jpg';
import newBeauty from '../assets/images/new-beauty.jpg';
import newHaven from '../assets/images/new-haven.jpg';
import newRefreshed from '../assets/images/new-refreshed.jpg';

const ServiceCard = ({ id, title, image, mediaType, rating, reviews, originalPrice, discountedPrice, link }) => {
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
          {mediaType === 'video' ? (
            <div className="w-full h-48 bg-black">
              <LazyVideo
                src={image}
                className="w-full h-full"
              />
            </div>
          ) : (
            <LazyImage
              src={image}
              alt={title}
              className="w-full h-48 object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2">{title}</h3>
          {rating && (
            <div className="flex items-center mb-2">
              <div className="flex items-center text-yellow-400 mr-1">
                <FaStar />
              </div>
              <span className="text-sm text-gray-600">{rating} • {reviews} reviews</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              {originalPrice && (
                <>
                  <span className="text-gray-500 line-through text-sm mr-2">${originalPrice}</span>
                  <span className="text-primary font-semibold">${discountedPrice}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllServicesPage = () => {
  const { getAllServices, loading } = useService();

  // Get all services from the context
  const allServices = getAllServices();

  // Fallback data in case no services are available
  const fallbackServices = [
    {
      id: 101,
      title: 'Relax and Rejuvenate: Salon & Spa',
      image: serviceRelax,
      rating: 4.8,
      reviews: 76,
      originalPrice: 120,
      discountedPrice: 99,
      link: '/services/relax-spa'
    },
    {
      id: 102,
      title: 'Flawless Nails, Right Fingertips',
      image: serviceNails,
      rating: 4.7,
      reviews: 58,
      originalPrice: 80,
      discountedPrice: 65,
      link: '/services/nails'
    },
    {
      id: 103,
      title: 'Pamper Yourself: Salon & Spa',
      image: servicePamper,
      rating: 4.9,
      reviews: 84,
      originalPrice: 150,
      discountedPrice: 120,
      link: '/services/pamper-spa'
    },
    {
      id: 104,
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
  const displayServices = allServices.length > 0 ? allServices : fallbackServices;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">All Services</h1>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  image={service.image}
                  mediaType={service.mediaType}
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
      </main>
      <Footer />
    </div>
  );
};

export default AllServicesPage;
