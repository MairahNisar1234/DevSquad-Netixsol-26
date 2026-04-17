import { useState, useEffect } from 'react';
import axios from 'axios';


export default function Collections() {
  const categories = [
    { name: 'Black Tea', img: '/black.png' },
    { name: 'Green Tea', img: '/green.png' },
    { name: 'White Tea', img: '/tea-2.png' },
    { name: 'Matcha', img: '/tea-3.png' },
    { name: 'Herbal Tea', img: '/tea-4.png' },
    { name: 'Chai', img: '/tea-5.png' },
    { name: 'oolong', img: '/tea-6.png' },
    { name: 'Rooibos', img: '/tea-7.png' },
    { name: 'Teaware', img: '/tea-8.png' },
  ];
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);



  return (
    <section className="px-16 py-20 bg-white">
      <h2 className="text-3xl font-medium text-center text-[#282828] mb-12 font-sans">
        Our Collections
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {categories.map((cat, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Category Name */}
            <p className="text-center text-[14px] font-semibold uppercase tracking-[2px] text-[#282828]">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}