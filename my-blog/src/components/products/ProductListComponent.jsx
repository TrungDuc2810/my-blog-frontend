import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../services/ProductService";
import { toast } from "react-toastify";
import PageTransition from "../main/PageTransition";

const ProductListComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      const productsArray = Array.isArray(data) ? data : data?.content || [];
      setProducts(productsArray);
    } catch (error) {
      toast.error("Failed to load products");
      console.error("Error loading products:", error);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  // Show message if no products
  if (!products.length) {
    return (
      <div className="products-container">
        <h2>Our Products</h2>
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="content-wrapper">
        <div className="products-container">
          <h2>Our Products</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  {product.productThumbnail && (
                    <img
                      src={product.productThumbnail.filePath}
                      alt={product.name}
                    />
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">
                    {product.discountPrice > 0 ? (
                      <>
                        <span className="original-price">${product.price}</span>
                        <span className="discount-price">
                          ${product.discountPrice}
                        </span>
                      </>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </div>
                  <div className="product-language">
                    Language: {product.language}
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductListComponent;