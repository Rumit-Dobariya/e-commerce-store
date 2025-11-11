import { useState, useMemo, useEffect } from "react";
import {
  useProducts,
  useCategories,
  getPriceRange,
} from "../hooks/useProducts";
import Filters from "../components/Filters/Filters";
import SearchBar from "../components/SearchBar/SearchBar";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import { Button } from "../components/FormElements";
import { FiShoppingCart } from "react-icons/fi";

export default function Index(props) {
  const { onAddToCart, onOpenCart, cartItemCount = 0, getItemQuantity } = props;

  const { products, loading, error } = useProducts();

  const categories = useCategories(products);
  const priceRange = getPriceRange(products);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#3A3A3A]">
              Store
            </h1>
            <p className="text-[#4B5563] text-sm">Discover amazing products</p>
          </div>
          <Button variant="primary" className="gap-2 relative" onClick={onOpenCart}>
            <FiShoppingCart size={24} />
            <span className="hidden sm:inline">Cart</span>
            {/* badge */}
            {cartItemCount > 0 && (
              <span
                className="absolute h-[25px] min-w-[25px] w-auto -top-[8px] -right-[8px] inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-[#DC2626] text-white"
                aria-live="polite"
              >
                {cartItemCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-[96px]">
              <Filters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                priceRange={priceRange}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-[32px]">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Results Info */}
            {!loading && (
              <div className="mb-[24px] flex items-center justify-between">
                <p className="text-[#4B5563] text-sm">
                  Showing{" "}
                  <span className="font-bold text-[#3A3A3A]">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#3A3A3A]">
                    {products.length}
                  </span>{" "}
                  products
                </p>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              onAddToCart={onAddToCart}
              loading={loading}
              error={error}
              getItemQuantity={getItemQuantity}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
