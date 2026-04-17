import { useEffect, useState } from "react";
// 1. Import your custom api instance
import api from '../services/api.js'; 
import Navbar from '../components/Navbar2';
import { Link } from 'react-router-dom';

const containerStyle = {
  maxWidth: "1200px",
  margin: "40px auto",
  display: "flex",
  gap: "40px",
  padding: "0 20px"
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ category: "", origin: "", flavor: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(""); 
  const [openCategory, setOpenCategory] = useState(null);

  const filterCategories = [
    { name: "CATEGORY", key: "category" },
    { name: "ORIGIN", key: "origin" },
    { name: "FLAVOUR", key: "flavor" },
    { name: "CAFFEINE", key: "caffeine" }
  ];

  const getUniqueValues = (key) => {
    const values = products.map((p) => p[key]);
    return [...new Set(values)].filter(Boolean);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 2. Build the query parameters
      const params = { 
        page, 
        sort, 
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "")) 
      };

      // 3. Use the 'api' instance (URL becomes https://.../api/products)
      const res = await api.get('/products', { params });
      
      // Axios stores data in .data
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page, sort]);

  return (
    <>
      <Navbar />
      <div style={{ 
        width: "100%", height: "300px", 
        backgroundImage: "url('https://res.cloudinary.com/dru7ig67d/image/upload/v1773481480/back_qrui3h.png')", 
        backgroundSize: "cover", backgroundPosition: "center" 
      }} />

      <div style={containerStyle}>
        {/* SIDEBAR FILTERS */}
        <aside style={{ width: "250px", fontFamily: "'Montserrat', sans-serif" }}>
          {filterCategories.map((cat) => (
            <div key={cat.key} style={{ borderBottom: "1px solid #ddd" }}>
              <div 
                style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", cursor: "pointer" }}
                onClick={() => setOpenCategory(openCategory === cat.key ? null : cat.key)}
              >
                <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{cat.name}</span>
                <span>{openCategory === cat.key ? "-" : "+"}</span>
              </div>
              
              {openCategory === cat.key && (
                <div style={{ padding: "10px 0 10px 20px", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#fafafa" }}>
                  {getUniqueValues(cat.key).map((opt) => (
                    <label key={opt} style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        style={{ marginRight: "10px" }}
                        checked={filters[cat.key] === opt}
                        onChange={(e) => {
                          setFilters({ ...filters, [cat.key]: e.target.checked ? opt : "" });
                          setPage(1); 
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* PRODUCT GRID */}
        <main style={{ flexGrow: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", fontFamily: "'Montserrat', sans-serif" }}>
            <span>Showing {products.length} products</span>
            
            <select 
              value={sort} 
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1); 
              }}
              style={{ padding: "8px", border: "1px solid #ddd", outline: "none", cursor: "pointer" }}
            >
              <option value="">Default Sorting</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? <p className="text-center py-10">Loading Products...</p> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
              {products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <div style={{ width: "100%", aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px", backgroundColor: "#f9f9f9" }}>
                      <img src={product.image} alt={product.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "400", margin: "0", color: "#222" }}>{product.name}</h3>
                    <p style={{ fontSize: "1rem", color: "#222", margin: "8px 0" }}>
                      €{product.variants?.[0]?.price || "0.00"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i + 1)} 
                style={{ 
                  margin: "0 5px", padding: "8px 15px", cursor: "pointer",
                  border: "1px solid #000", 
                  background: page === i + 1 ? "#000" : "#fff", 
                  color: page === i + 1 ? "#fff" : "#000" 
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductsPage;