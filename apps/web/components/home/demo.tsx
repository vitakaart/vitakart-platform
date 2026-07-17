import React from 'react';
import Head from 'next/head';
import { ShoppingCart, Star, ArrowRight, ShieldCheck, Percent, ChevronRight } from 'lucide-react';

// --- Mock Data ---
const BEST_SELLERS = [
  { id: 1, title: "All Natural Italian-Style Chicken Meatballs", weight: "500g", price: 7.25, oldPrice: 9.50, discount: "20%", rating: 5, img: "https://images.unsplash.com/photo-1529417305485-480f779bd88d?w=400&q=80" },
  { id: 2, title: "Angie's Boomchickapop Sweet & Salty Kettle Corn", weight: "350g", price: 3.29, oldPrice: 4.50, discount: "15%", rating: 4, img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80" },
  { id: 3, title: "Field Roast Chao Cheese Creamy Original", weight: "200g", price: 19.50, oldPrice: 22.00, discount: "10%", rating: 5, img: "https://images.unsplash.com/photo-1486297678162-ad2a19b05840?w=400&q=80" },
  { id: 4, title: "Fresh Organic Broccoli Crowns", weight: "1kg", price: 4.50, oldPrice: 6.00, discount: "25%", rating: 5, img: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&q=80" },
  { id: 5, title: "Blue Diamond Almonds Lightly Salted", weight: "150g", price: 10.50, oldPrice: 12.00, discount: "20%", rating: 4, img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&q=80" },
];

const FRUITS = [
  { id: 10, title: "Fresh Organic Broccoli", price: 4.50, oldPrice: 5.90, img: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=300&q=80" },
  { id: 11, title: "Fresh Brown Coconut", price: 1.48, oldPrice: 2.10, img: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=300&q=80" },
  { id: 12, title: "Fresh Cavendish Bananas", price: 7.18, oldPrice: 8.50, img: "https://images.unsplash.com/photo-1603833665858-e81b1c7e4460?w=300&q=80" },
  { id: 13, title: "Fresh Organic Kiwi", price: 5.32, oldPrice: 6.10, img: "https://images.unsplash.com/photo-1585059895822-74810433e2c5?w=300&q=80" },
  { id: 14, title: "Organic Green Grapes", price: 1.72, oldPrice: 2.30, img: "https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?w=300&q=80" },
  { id: 15, title: "Texas Rio Red Grapefruit", price: 4.50, oldPrice: 5.50, img: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=300&q=80" },
  { id: 16, title: "Fresh Organic Strawberries", price: 9.33, oldPrice: 11.20, img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80" },
  { id: 17, title: "Organic Sweet Lime", price: 1.22, oldPrice: 1.50, img: "https://images.unsplash.com/photo-1591189863430-ab87e120f312?w=300&q=80" },
];

// --- Components ---

const ProductCard = ({ product, showButton = true }) => (
  <div className="group bg-white p-4 border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-300 relative flex flex-col h-full">
    {product.discount && (
      <span className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded">
        {product.discount}
      </span>
    )}
    <div className="h-40 w-full mb-4 overflow-hidden rounded-lg">
      <img src={product.img} alt={product.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
    </div>
    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 leading-tight h-10">
      {product.title}
    </h3>
    <p className="text-[11px] text-green-600 font-bold mb-2 uppercase tracking-tighter italic">In Stock</p>
    <div className="flex text-yellow-400 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} fill={i < product.rating ? "currentColor" : "none"} />
      ))}
    </div>
    <div className="mt-auto">
      <div className="flex items-center gap-2 mb-3">
        {product.oldPrice && <span className="text-gray-400 line-through text-sm">${product.oldPrice.toFixed(2)}</span>}
        <span className="text-red-500 font-bold text-lg">${product.price.toFixed(2)}</span>
      </div>
      {showButton && (
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 rounded-full text-xs transition-colors">
          Add to cart
        </button>
      )}
    </div>
  </div>
);

export default function GroceryPage() {
  return (
    <div className="bg-[#f7f8fd] min-h-screen font-sans text-gray-900 pb-20">
      <Head>
        <title>Bacola Grocery - Feed your family the best</title>
      </Head>

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 pt-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 relative bg-[#f3f4f6] rounded-3xl p-12 overflow-hidden flex items-center min-h-[460px]">
            <div className="z-10 max-w-md">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Exclusive Offer</span>
                    <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full">-20% OFF</span>
                </div>
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                    Feed your family <br /> the best
                </h1>
                <p className="text-gray-500 mb-8">Only this week. Don't miss...</p>
                <div className="mb-8">
                    <p className="text-gray-400 text-sm">from</p>
                    <p className="text-red-500 text-3xl font-extrabold">$7.99</p>
                </div>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                    Shop Now <ArrowRight size={18} />
                </button>
            </div>
            <img src="https://images.unsplash.com/photo-1550583760-5868b0dd3f71?w=600&q=80" className="absolute right-0 bottom-0 w-2/3 h-full object-contain pointer-events-none" alt="Alpro Milk" />
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#ffece1] rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h2 className="text-green-800 text-sm font-bold tracking-widest uppercase mb-2">Starbucks</h2>
            <h3 className="text-4xl font-black text-gray-800 mb-4">happy <br /> hour</h3>
            <p className="text-gray-500 text-sm mb-6 uppercase">Total Freshness</p>
            <img src="https://images.unsplash.com/photo-1544787210-2213d84ad960?w=400&q=80" className="w-48 h-48 object-contain mb-4" alt="Starbucks" />
            <div className="absolute top-10 right-10 w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
        </div>
      </section>

      {/* --- SECONDARY BANNERS --- */}
      <section className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-all">
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80" className="w-32 h-32 rounded-lg object-cover" />
            <div>
                <h4 className="text-xl font-bold mb-2">Everything is so fresh <br /> only in Bacola</h4>
                <button className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1">Shop Now <ChevronRight size={14}/></button>
            </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center gap-6 hover:shadow-md transition-all">
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80" className="w-32 h-32 rounded-lg object-cover" />
            <div>
                <h4 className="text-xl font-bold mb-2">Big discount on <br /> organic legumes</h4>
                <button className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1">Shop Now <ChevronRight size={14}/></button>
            </div>
        </div>
      </section>

      {/* --- BEST SELLERS GRID --- */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-lg font-bold uppercase tracking-tight">Best Sellers</h2>
                <p className="text-xs text-gray-400">Do not miss the current offers until the end of March.</p>
            </div>
            <button className="text-blue-600 text-xs font-bold border border-blue-100 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-50">
                View All <ArrowRight size={14} />
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {BEST_SELLERS.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* --- PROMO STRIP --- */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-[#edf9f3] border border-green-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-full text-white">
                    <ShieldCheck size={20} />
                </div>
                <span className="text-green-800 font-semibold text-sm">100% Secure delivery without contacting the courier</span>
            </div>
            <button className="bg-green-500 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-green-600">Shop Now</button>
        </div>
      </section>

      {/* --- FRUIT & VEG SECTION (SIDEBAR LAYOUT) --- */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-bold uppercase">Fruit & Vegetables</h2>
            <button className="text-blue-600 text-xs font-bold flex items-center gap-2">View All <ArrowRight size={14} /></button>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Column */}
            <div className="col-span-12 lg:col-span-3">
                <div className="bg-[#e3f2fd] rounded-2xl p-8 h-80 flex flex-col justify-between mb-6 relative overflow-hidden group">
                    <div className="z-10">
                        <p className="text-blue-500 text-xs font-bold mb-2">Weekly Discounts on</p>
                        <h3 className="text-2xl font-bold text-blue-900 mb-4">Fruits and <br /> Vegetables</h3>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold">View All</button>
                    </div>
                    <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80" className="absolute bottom-[-20px] right-[-20px] w-40 group-hover:scale-110 transition-transform" />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <ul className="space-y-3">
                        {['Milks & Dairies', 'Beverages', 'Eggs Substitutes', 'Honey', 'Marmalades', 'Sour Cream and Dips'].map(cat => (
                            <li key={cat} className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer flex justify-between items-center group">
                                {cat} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Product Grid Column */}
            <div className="col-span-12 lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
                {FRUITS.map(p => (
                    <div key={p.id} className="bg-white border border-gray-100 p-4 rounded-xl hover:shadow-md transition-all group">
                         <div className="h-32 w-full mb-3 overflow-hidden">
                            <img src={p.img} className="w-full h-full object-contain group-hover:scale-105 transition-all" />
                         </div>
                         <h4 className="text-sm font-semibold mb-1 line-clamp-1">{p.title}</h4>
                         <p className="text-[10px] text-gray-400 mb-2 uppercase">1kg</p>
                         <div className="flex text-yellow-400 mb-3"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} /></div>
                         <div className="flex items-center gap-2">
                            <span className="text-gray-300 line-through text-xs">${p.oldPrice}</span>
                            <span className="text-red-500 font-bold">${p.price}</span>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- SMALL DISCOUNT BAR --- */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-red-50 text-red-500 border border-red-100 p-3 rounded-lg text-center text-sm font-medium">
            Super discount for your <span className="font-extrabold underline">first purchase.</span> <span className="bg-red-500 text-white px-2 py-0.5 rounded ml-2 font-mono">FREE256AC</span> <span className="text-gray-400 text-xs ml-2 italic underline cursor-pointer">Use discount code in checkout</span>
        </div>
      </section>

      {/* --- BOTTOM BANNERS --- */}
      <section className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { title: "Natural Eggs", sub: "Weekend Discount 20%", color: "bg-[#f4f3f9]", img: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&q=80" },
                { title: "Taste the Best", sub: "Weekend Discount 10%", color: "bg-[#e8f5e9]", img: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&q=80" },
                { title: "Ditch the Junk", sub: "Weekend Discount 30%", color: "bg-[#fff3e0]", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80" }
            ].map((banner, i) => (
                <div key={i} className={`${banner.color} rounded-2xl p-8 flex items-center justify-between overflow-hidden group hover:shadow-lg transition-all`}>
                    <div>
                        <p className="text-[10px] text-green-600 font-bold uppercase mb-1">{banner.sub}</p>
                        <h4 className="text-xl font-bold mb-4">{banner.title}</h4>
                        <button className="bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-full">Shop Now</button>
                    </div>
                    <img src={banner.img} className="w-24 h-24 object-cover rounded-full border-4 border-white group-hover:rotate-12 transition-transform" />
                </div>
            ))}
      </section>

      {/* --- CATEGORY ICONS FOOTER --- */}
      <section className="max-w-7xl mx-auto px-4 mt-16 border-t border-gray-100 pt-10">
            <div className="flex flex-wrap justify-between gap-8">
                {[
                    { name: 'Biscuits & Snacks', items: '5 Items', img: 'https://cdn-icons-png.flaticon.com/128/2553/2553691.png' },
                    { name: 'Breads & Bakery', items: '8 Items', img: 'https://cdn-icons-png.flaticon.com/128/3014/3014502.png' },
                    { name: 'Breakfast & Dairy', items: '12 Items', img: 'https://cdn-icons-png.flaticon.com/128/2674/2674486.png' },
                    { name: 'Frozen Foods', items: '7 Items', img: 'https://cdn-icons-png.flaticon.com/128/2713/2713903.png' },
                    { name: 'Fruits & Vegetables', items: '21 Items', img: 'https://cdn-icons-png.flaticon.com/128/2329/2329865.png' },
                ].map((cat, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 group-hover:border-blue-500 transition-colors">
                            <img src={cat.img} className="w-6 h-6" alt={cat.name} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{cat.name}</p>
                            <p className="text-[10px] text-gray-400">{cat.items}</p>
                        </div>
                    </div>
                ))}
            </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}