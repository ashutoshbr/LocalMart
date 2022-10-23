import React, { createContext, useState } from 'react';

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const [qty, setQty] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Increase product quantity
  const increaseQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  // Decrease product Quantity
  const decreaseQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  // Add product to cart
  const onAdd = (product, quantity, discountedPrice) => {
    setTotalPrice((prevTotal) => (prevTotal + discountedPrice * quantity));
    // Increase total quantities
    setTotalQuantities((prevTotal) => prevTotal + quantity);

    // Check if the product is already there in the cart
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist) {
      setCartItems(cartItems.map((item) => (item.slug === product.slug ? { ...exist, quantity: exist.quantity + quantity, final_discounted_price: discountedPrice } : item)));
    } else {
      setCartItems([...cartItems, { ...product, quantity, final_discounted_price: discountedPrice }]);
    }
  };

  // remove product
  const onRemove = (product) => {
    setTotalPrice((prevTotal) => (product.discount_percentage > 0 ? prevTotal - product.final_discounted_price : prevTotal - product.price));
    // Decrease total quantities
    setTotalQuantities((prevTotal) => prevTotal - 1);

    // Check if the product is already there in the cart
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.slug !== product.slug));
    } else {
      setCartItems(cartItems.map((item) => (item.slug === product.slug ? { ...exist, quantity: exist.quantity - 1 } : item)));
    }
  };

  return (
    <ShopContext.Provider value={{ qty, setQty, increaseQty, decreaseQty, showCart, setShowCart, cartItems, onAdd, onRemove, totalQuantities, totalPrice }}>
      {children}
    </ShopContext.Provider>
  );
};
