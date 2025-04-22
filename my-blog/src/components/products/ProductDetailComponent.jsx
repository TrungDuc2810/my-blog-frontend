import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/ProductService";
import { toast } from "react-toastify";
import PageTransition from '../main/PageTransition';

const ProductDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error("Failed to load product details");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const addToCart = () => {
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cart.find(item => item.id === product.id);
    const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;
    
    if (existingItem) {
      cart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      toast.success('Đã cập nhật số lượng trong giỏ hàng');
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: priceToUse,
        image: product.productThumbnail?.filePath,
        quantity: 1
      });
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <PageTransition>
      <div className="content-wrapper">
        <div className="product-detail-container">
          <div className="product-detail-grid">
            <div className="product-detail-image">
              {product.productThumbnail && (
                <img
                  src={product.productThumbnail.filePath}
                  alt={product.name}
                />
              )}
            </div>
            <div className="product-detail-info">
              <h1>{product.name}</h1>
              <div className="product-meta">
                <span className="language">Language: {product.language}</span>
                <span className="created-at">
                  Added: {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="product-pricing">
                {product.discountPrice > 0 ? (
                  <>
                    <div className="original-price">${product.price}</div>
                    <div className="discount-price">${product.discountPrice}</div>
                    <div className="savings">
                      Save ${(product.price - product.discountPrice).toFixed(2)} (
                      {((1 - product.discountPrice / product.price) * 100).toFixed(
                        0
                      )}
                      %)
                    </div>
                  </>
                ) : (
                  <div className="price">${product.price}</div>
                )}
              </div>
              <div className="product-description">
                <h2>Description</h2>
                <p>{product.description}</p>
              </div>
              <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetailComponent;
