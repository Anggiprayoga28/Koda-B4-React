import React from 'react';
import MenuCard from './MenuCard';

const MenuSection = () => {
  const menuItems = [
    {
      title: "Hazelnut Latte",
      price: "25.000",
      description: "You can explore the menu that we provide with fun and have their own taste and make your day better",
      image: "/public/hazelnut.png"
    },
    {
      title: "Cappuccino",
      price: "25.000",
      description: "You can explore the menu that we provide with fun and have their own taste and make your day better",
      image: "/public/cappucino.png"
    },
    {
      title: "Espresso",
      price: "25.000",
      description: "You can explore the menu that we provide with fun and have their own taste and make your day better",
      image: "/public/espreso.png"
    },
    {
      title: "Caramel Macchiato",
      price: "25.000",
      description: "You can explore the menu that we provide with fun and have their own taste and make your day better",
      image: "/public/machiato.png"
    }
  ];

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Here is People's <span className="text-orange-500">Favorite</span>
          </h2>
          <p className="text-gray-600">
            Let's choose and have a bit taste of people's favorite. It might be yours too!
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <MenuCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;