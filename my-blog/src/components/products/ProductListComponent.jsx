import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../services/ProductService";
import { toast } from "react-toastify";
import PageTransition from "../main/PageTransition";
import ScrollToTopButton from "../common/ScrollToTopButton";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 9;

const ProductListComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts(pageNo);
  }, [pageNo]);

  const loadProducts = async (page) => {
    setLoading(true);
    try {
      const data = await getAllProducts(page, PAGE_SIZE, "id", "asc");
      setProducts(Array.isArray(data) ? data : data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load products");
      console.error("Error loading products:", error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

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
          <Pagination
            pageNo={pageNo}
            totalPages={totalPages}
            onPageChange={setPageNo}
          />
        </div>
        <ScrollToTopButton showBelow={300} />
      </div>
    </PageTransition>
  );
};

export default ProductListComponent;