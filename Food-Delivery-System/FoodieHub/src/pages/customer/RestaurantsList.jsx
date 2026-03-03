import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiStar } from 'react-icons/fi';
import Loading from '../../common/Loading';
import { restaurantAPI } from '../../services/api';

const RestaurantCard = ({ restaurant }) => {
  const rating = Number(restaurant.rating || 0);
  const city = restaurant.location?.city;

  return (
    <Link
      to={`/customer/restaurant/${restaurant._id}`}
      className="card-hover group flex flex-col gap-3"
    >
      {/* Thumbnail */}
      {restaurant.images?.[0] ? (
        <img
          src={restaurant.images[0]}
          alt={restaurant.name}
          className="h-32 w-full rounded-xl object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div
        style={{ display: restaurant.images?.[0] ? 'none' : 'flex' }}
        className="h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 text-5xl select-none"
      >
        🍽️
      </div>

      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1">
          {restaurant.name}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          {rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <FiStar className="text-amber-500" /> {rating.toFixed(1)}
            </span>
          )}
          {restaurant.isOpen === false && (
            <span className="inline-flex items-center rounded-lg bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
              Closed
            </span>
          )}
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed">
        {restaurant.description || 'No description available'}
      </p>

      {city && (
        <p className="mt-auto flex items-center gap-1 text-xs text-slate-400">
          <FiMapPin /> {city}
        </p>
      )}
    </Link>
  );
};

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const debounceRef = useRef(null);

  const fetchRestaurants = async (term, city) => {
    try {
      const params = {};
      if (term) params.search = term;
      if (city) params.city = city;
      const response = await restaurantAPI.getAll(params);
      setRestaurants(response.data?.data || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setInitialLoading(false);
      setSearching(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRestaurants('', '');
  }, []);

  // Debounced search — waits 400ms after user stops typing
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setSearching(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchRestaurants(term, cityFilter), 400);
  };

  const handleCityChange = (city) => {
    setCityFilter(city);
    setSearching(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchRestaurants(searchTerm, city), 400);
  };

  if (initialLoading) return <Loading fullScreen />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Discover Restaurants</h1>
        <p className="mt-1 text-slate-500">Find your favourite cuisine from top local restaurants</p>
      </div>

      {/* Search & filter */}
      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-10"
            placeholder="Search by name or cuisine…"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="relative">
          <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-10"
            placeholder="Filter by city…"
            value={cityFilter}
            onChange={(e) => handleCityChange(e.target.value)}
          />
        </div>
      </div>

      {/* Results */}
      {searching && (
        <p className="mb-3 text-sm text-slate-400 animate-pulse">Searching…</p>
      )}
      {!searching && restaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="mb-4 text-6xl">🔍</span>
          <p className="text-lg font-semibold text-slate-700">No restaurants found</p>
          <p className="mt-1 text-sm text-slate-400">Try adjusting your search or city filter</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">{restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default RestaurantsList;
