import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import axios from 'axios';
import images from '../../assets';
import { ProductCard, SearchBar } from '../../components';
import { calculateDiscount } from '../../utils/calculateDiscount';

const headers = {
  withCredentials: true,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;

const Product = () => {
  const [products, setProducts] = useState(null);
  const [productsCopy, setProductCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { theme } = useTheme();
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  useEffect(() => {
    axios.get(`${baseURL}/product`, { headers }).then((response) => {
      console.log(response.data);
      setProducts(response.data.items);
      setProductCopy(response.data.items);
      setIsLoading(false);
    }).catch((error) => {
      setProducts([]);
      console.log(error.response.data.detail);
      setErrorMessage(error.response.data.detail);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading . . .
      </div>
    );
  }

  // if (errorMessage) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       {errorMessage}
  //     </div>
  //   );
  // }

  const onHandleSearch = (value) => {
    axios.get(`${baseURL}/product/search/?q=${value}`, { headers }).then((response) => {
      console.log(response.data);
      setProducts(response.data.items);
      setIsLoading(false);
    }).catch((error) => {
      setProducts([]);
      console.log(error.response.data.detail);
      setErrorMessage(error.response.data.detail);
      setIsLoading(false);
    });
  };

  const onClearSearch = () => {
    if (products.length && productsCopy.length) {
      setProducts(productsCopy);
    }
  };
  return (
    <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
      <div className="mt-8 flexBetween sm:flex-col sm:items-start">
        <div>
          <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 ml-4 xs:ml-0">- Our Products</p>
          <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl minlg:text-4xl xs:text-xl font-bold ml-4 xs:ml-0">Explore our Products</h1>
        </div>
        <div className="flex gap-2 items-center">
          <SearchBar
            activeSelect={activeSelect}
            setActiveSelect={setActiveSelect}
            handleSearch={onHandleSearch}
            clearSearch={onClearSearch}
          />
          <Image onClick={() => { }} src={images.leftArrow} width={32} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
          <Image onClick={() => { }} src={images.rightArrow} width={32} objectFit="contain" alt="left-arrow" className={`cursor-pointer hover:scale-105 ${theme === 'dark' ? 'filter invert' : ''}`} />
        </div>
      </div>
      <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
        {products.length > 0 ? products.map((item, i) => (
          <ProductCard
            key={`product-${i}`}
            product={{
              id: item.id,
              name: item.title,
              price: item.price,
              image: item.image_url[0].url.startsWith('https://') ? item.image_url[0].url : `https://${item.image_url[0].url}`,
              discount: item.discount_percentage,
              discountedPrice: calculateDiscount(item.price, item.discount_percentage),
              slug: item.slug,
              category: item.tags,
            }}
          />
        )) : errorMessage != null ? errorMessage : 'No Products Available'}

      </div>
    </div>
  );
};

export default Product;
