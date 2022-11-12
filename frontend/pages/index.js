import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Banner, Category, ProductCard } from '../components';
import images from '../assets';
import Button from '../components/Button';
import { calculateDiscount } from '../utils/calculateDiscount';

const headers = {
  withCredentials: true,
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': true,
};

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API;

const Home = () => {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(null);
  const [hideButtons, setHideButtons] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const { theme } = useTheme();

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 180 : 150;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  useEffect(() => {
    axios.get(`${baseURL}/categories`, { headers }).then((response) => {
      setCategory(response.data);
    }).catch((e) => {
      setCategory([{ tag_name: 'Error' }]);
      console.log(e);
    });

    axios.get(`${baseURL}/product`, { headers }).then((response) => {
      console.log(response.data);
      setProducts(response.data.items);
      setIsLoading(false);
    }).catch((error) => {
      setProducts([]);
      // console.log(error.response.data.detail);
      if (error.response?.data) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage('Something went wrong');
      }
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

  return (
    <div>
      <Head>
        <title>Local Mart</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col justify-end sm:px-4 p-12 pt-16">
        <div className="w-full minmd:w-4/5">
          <Banner childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left" subtitle="- Local Marts Products" buttonLink="/product" name="We Offer the Best Products for everyone." parentStyles="justify-start mt-6 mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl" />
        </div>
        <div className="mt-2">
          <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 ml-4 xs:ml-0">- The Categories</p>
          <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl minlg:text-4xl xs:text-xl font-bold ml-4 xs:ml-0">Browse by Category</h1>
        </div>
        <div className="relative flex-1 max-w-full " ref={parentRef}>
          <div className="flex overflow-x-scroll no-scrollbar" ref={scrollRef}>
            {category?.map((item, i) => (
              <Category key={i} logo={images.logoDark} title={item.tag_name} />
            ))}

            {!hideButtons && (
            <>
              <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-14 cursor-pointer -left-3">
                <Image onClick={() => { handleScroll('left'); }} src={images.leftArrow} layout="fill" objectFit="contain" alt="left-arrow" className={theme === 'dark' ? 'filter invert' : ''} />
              </div>
              <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-14 cursor-pointer -right-3">
                <Image onClick={() => { handleScroll('right'); }} src={images.rightArrow} layout="fill" objectFit="contain" alt="left-arrow" className={theme === 'dark' ? 'filter invert' : ''} />
              </div>
            </>
            )}

          </div>
          <div className="mt-2 flexBetween sm:flex-col sm:items-start">
            <div>
              <p className="text-subtitle-blue italic font-semibold text-base md:mb-4 sm:mb-1 ml-4 xs:ml-0">- Our Products</p>
              <h1 className="font-montserrat dark:text-white text-mart-black-1 text-3xl minlg:text-4xl xs:text-xl font-bold ml-4 xs:ml-0">Explore our Products</h1>
            </div>
            <div className="flex gap-2">
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
                  image: item.image_url[0].url.startsWith('https://') || item.image_url[0].url.startsWith('http://') ? item.image_url[0].url : `https://${item.image_url[0].url}`,
                  discount: item.discount_percentage,
                  discountedPrice: calculateDiscount(item.price, item.discount_percentage),
                  slug: item.slug,
                  category: item.tags,
                }}
              />
            )) : errorMessage != null ? errorMessage : 'No Products Available'}

          </div>
        </div>
        <div className="flex justify-center">
          <Button
            btnName="View More"
            classStyles="text-xl rounded-xl mt-5 sm:mt-4"
            handleClick={() => {
              router.push('/product');
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
