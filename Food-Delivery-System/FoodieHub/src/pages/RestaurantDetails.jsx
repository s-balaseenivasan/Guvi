import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlus, FiMapPin, FiStar } from 'react-icons/fi';
import Loading from '../common/Loading';
import { useCart } from '../context/CartContext';
import { menuAPI, restaurantAPI } from '../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantResponse, menuResponse] = await Promise.all([
          restaurantAPI.getById(id),
          menuAPI.getByRestaurant(id),
        ]);
        setRestaurant(restaurantResponse.data);
        setMenu(menuResponse.data || []);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const groupedMenu = useMemo(
    () =>
      menu.reduce((acc, item) => {
        const key = item.category || 'Other';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {}),
    [menu]
  );

  if (loading) return <Loading fullScreen />;
  if (!restaurant) return <p className="mx-auto max-w-4xl px-4 py-8">Restaurant not found.</p>;

  const rating = Number(restaurant.rating || 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      {/* Closed banner */}
      {restaurant.isOpen === false && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3">
          <span className="text-2xl">🔴</span>
          <div>
            <p className="font-semibold text-red-700">This restaurant is currently closed</p>
            <p className="text-sm text-red-500">You can browse the menu but ordering is unavailable right now.</p>
          </div>
        </div>
      )}

      {/* Restaurant header */}
      <section className="mb-8 overflow-hidden rounded-2xl shadow-md">
        {restaurant.images?.[0] && (
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src={restaurant.images[0]}
              alt={restaurant.name}
              className="h-full w-full object-cover"
              onError={(e) => (e.target.parentElement.style.display = 'none')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        <div className={`flex items-start justify-between gap-4 p-6 text-white ${restaurant.images?.[0] ? 'bg-slate-800' : 'bg-gradient-to-r from-primary-600 to-primary-500'}`}>
          <div>
            <h1 className="text-3xl font-extrabold">{restaurant.name}</h1>
            <p className={`mt-2 max-w-xl text-sm leading-relaxed ${restaurant.images?.[0] ? 'text-slate-300' : 'text-primary-100'}`}>
              {restaurant.description || 'No description available'}
            </p>
            {restaurant.location?.city && (
              <p className={`mt-3 flex items-center gap-1 text-sm ${restaurant.images?.[0] ? 'text-slate-400' : 'text-primary-200'}`}>
                <FiMapPin /> {restaurant.location.city}
              </p>
            )}
          </div>
          {rating > 0 && (
            <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm px-4 py-3 text-center">
              <FiStar className="text-amber-300 text-xl mb-1" />
              <span className="text-2xl font-extrabold">{rating.toFixed(1)}</span>
              <span className={`text-xs ${restaurant.images?.[0] ? 'text-slate-300' : 'text-primary-200'}`}>Rating</span>
            </div>
          )}
        </div>
      </section>

      {/* Menu */}
      {Object.keys(groupedMenu).length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <span className="mb-4 text-6xl">🍽️</span>
          <p className="text-lg font-semibold text-slate-700">No menu items yet</p>
          <p className="mt-1 text-sm text-slate-400">Check back later — the restaurant is still setting up.</p>
        </div>
      ) : (
        Object.entries(groupedMenu).map(([category, items]) => (
          <section key={category} className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{category}</h2>
              <span className="badge-slate">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item._id}
                  className="card-hover flex items-center justify-between gap-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                      {item.isAvailable === false && (
                        <span className="badge-red shrink-0">Unavailable</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{item.description}</p>
                    )}
                    <p className="mt-2 text-sm font-bold text-primary-700">₹{Number(item.price).toFixed(2)}</p>
                  </div>
                  <button
                    className="btn-primary shrink-0 !px-3 !py-2 gap-1"
                    onClick={() => addToCart(item, restaurant)}
                    disabled={item.isAvailable === false || restaurant.isOpen === false}
                    title={restaurant.isOpen === false ? 'Restaurant is closed' : 'Add to cart'}
                  >
                    <FiPlus className="text-base" />
                    Add
                  </button>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
};

export default RestaurantDetails;
