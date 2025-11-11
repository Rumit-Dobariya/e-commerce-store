import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { useCart } from "./hooks/useCart";
import ProductDetail from "./pages/ProductDetail";
import CartSidebar from "./components/CartSidebar/CartSidebar";
import { ToastProvider, useToast } from "./components/Toast/Toast";

const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
    getItemQuantity,
  } = useCart();

  const { showToast } = useToast();

  const handleOpenCart = () => setIsCartOpen(true);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    showToast({
      type: 'success',
      message: `${product.title} added to cart.`,
      action: 'View Cart',
      actionCallback: handleOpenCart,
    });
  };

  const handleRemoveFromCart = (productId) => {
    const product = cart.find(item => item.id === productId);

    if (product) {
      removeFromCart(productId);
      showToast({
        type: 'warning',
        message: `${product.title} removed from cart.`,
      });
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const product = cart.find(item => item.id === productId);

    if (product) {
      updateQuantity(productId, newQuantity);

      if (newQuantity > 0) {
        showToast({
          type: 'info',
          message: `${product.title} quantity changed to ${newQuantity}.`,
        });
      } else {
        showToast({
          type: 'warning',
          message: `${product.title} removed from cart.`,
        });
      }
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Index
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                cartItemCount={itemCount}
                getItemQuantity={getItemQuantity}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                cartItemCount={itemCount}
                getItemQuantity={getItemQuantity}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={() => {
          showToast({
            type: 'success',
            message: 'Thank you for your purchase! Checkout completed.',
            duration: 5000,
          });
          setIsCartOpen(false);
        }}
      />
    </>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
