import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Button, Label } from "../components/FormElements";

export default function ProductDetail(props) {
  const { onAddToCart, onOpenCart, getItemQuantity } = props;

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartQty, setCartQty] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();

        setProduct(data);
        setError(null);
        if (getItemQuantity) {
          setCartQty(getItemQuantity(data.id));
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, getItemQuantity]);

  useEffect(() => {
    if (product && getItemQuantity) {
      setCartQty(getItemQuantity(product.id));
    }
  }, [product, getItemQuantity]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product); 
      }
      if (getItemQuantity) {
        setCartQty(getItemQuantity(product.id) + quantity);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="space-y-8 animate-pulse">
            <div className="h-8 bg-[#E5E7EB] rounded w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-[#E5E7EB] rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-[#E5E7EB] rounded w-3/4" />
                <div className="h-6 bg-[#E5E7EB] rounded w-1/2" />
                <div className="h-32 bg-[#E5E7EB] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8] font-semibold mb-8"
          >
            <FiArrowLeft size={20} />
            Back to Products
          </Link>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <IoAlertCircleOutline
                className="mx-auto mb-[16px] text-[#EF4444]"
                size={48}
              />
              <h2 className="text-xl font-bold text-[#111827] mb-2">
                {error || "Product not found"}
              </h2>
              <Link
                to="/"
                className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold mt-4 inline-block"
              >
                Return to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E1E1E1] py-[32px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8] font-semibold mb-[32px]"
        >
          <FiArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="bg-white rounded-sm shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex items-center justify-center bg-[#F3F4F6] rounded-lg p-8]">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-96 max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="inline-block bg-[#DBEAFE] text-[#1D4ED8] text-xs font-semibold px-3 py-1 rounded-[4px] mb-[16px] capitalize]">
                  {product.category}
                </span>

                <h1 className="text-3xl md:text-4xl font-bold text-[#3A3A3A] mb-[16px]">
                  {product.title}
                </h1>

                <div className="flex items-center gap-3 mb-[24px]">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <AiFillStar
                        key={i}
                        size={18}
                        className={cn(
                          "transition-colors",
                          i < Math.round(product.rating.rate)
                            ? "fill-[#FBBF24] text-[#FBBF24]"
                            : "text-[#D1D5DB]",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[#4B5563]">
                    {product.rating.rate} out of 5
                  </span>
                  <span className="text-[#4B5563]">
                    ({product.rating.count} reviews)
                  </span>
                </div>

                <p className="text-[#4B5563] text-lg leading-relaxed mb-[32px]">
                  {product.description}
                </p>

                <div className="mb-[32px] pb-[32px] border-b-2 border-[#E5E7EB]">
                  <p className="text-[#4B5563] text-sm mb-[8px]">Price</p>
                  <p className="text-4xl font-bold text-[#3A3A3A]">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <div>
                    <Label className="mb-2">Quantity</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        −
                      </Button>
                      <span className="text-2xl font-bold text-[#3A3A3A] w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="mt-[16px] w-full relative"
                    onClick={handleAddToCart}
                  >
                    <FiShoppingCart size={18} />
                    {"Add to Cart"}
                    {cartQty > 0 && (
                      <span className="absolute -top-[8px] -right-[8px] h-[24px] w-[24px] inline-flex items-center justify-center text-xs font-bold rounded-full bg-[#DC2626] text-white">
                        {cartQty}
                      </span>
                    )}
                  </Button>

                  {cartQty > 0 && (
                    <Button
                      variant="secondary"
                      className="w-full mt-[16px]"
                      onClick={() => onOpenCart()}
                    >
                      View Cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
