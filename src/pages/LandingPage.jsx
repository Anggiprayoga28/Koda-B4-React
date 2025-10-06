import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import MenuSection from '../components/landing/MenuSection';
import MapSection from '../components/landing/MapSection';
import TestimonialSection from '../components/landing/TestimonialSection';
import WhatsAppFloating from '../components/ui/WhatsAppFloating';

const LandingPage = () => {
  return (
    <div>
      <Helmet>
        <title>Coffee Shop - Premium Coffee & Delicious Food</title>
        <meta name="description" content="Welcome to our coffee shop. Enjoy premium coffee, delicious food, and great atmosphere. Order online or visit us today!" />
        <meta name="keywords" content="coffee shop, premium coffee, cafe, restaurant, coffee beans, espresso, latte" />
        <meta property="og:title" content="Coffee Shop - Premium Coffee & Delicious Food" />
        <meta property="og:description" content="Welcome to our coffee shop. Enjoy premium coffee, delicious food, and great atmosphere." />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroSection />
      <AboutSection />
      <MenuSection />
      <MapSection />
      <TestimonialSection />
      
      <WhatsAppFloating />
    </div>
  );
};

export default LandingPage;