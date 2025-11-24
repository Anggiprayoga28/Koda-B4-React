import React, { useEffect } from 'react';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import MenuSection from '../components/landing/MenuSection';
import MapSection from '../components/landing/MapSection';
import TestimonialSection from '../components/landing/TestimonialSection';
import WhatsAppFloating from '../components/ui/WhatsAppFloating';
import { useSelector } from 'react-redux';

const LandingPage = () => {
  useEffect(() => {
    document.title = 'Coffee Shop - Premium Coffee & Delicious Food';
  }, []);

  const user = useSelector(state=> state.auth)
  console.log(user)
  const redux = useSelector(state=> state.auth)
  console.log(redux)

  return (
    <div>
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