"use client";

import { useState } from "react";
import { Clock, Bike, Utensils, GlassWater, ShoppingBasket, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const tabs = [
  { name: 'Food', icon: Utensils },
  { name: 'Drinks', icon: GlassWater },
  { name: 'Groceries', icon: ShoppingBasket },
  { name: 'Drugs/Pharmaceuticals', icon: Pill }
];

const products = [
  { category: 'Food', name: 'Burger Meal', price: '$15.99', distance: '0.8km', image: '/images/products/burger-meal.jpeg'},
  { category: 'Food', name: 'Rice and Meat', price: '$15.99', distance: '0.2km', image: '/images/products/burger-meal.jpeg' },

  { category: 'Food', name: 'Meat Pie', price: '$15.99', distance: '0.8km', image: '/images/products/burger-meal.jpeg' },
  { category: 'Food', name: 'Wheat and Egusi', price: '$25.99', distance: '0.2km', image: '/images/products/burger-meal.jpeg' },

  { category: 'Food', name: 'Yam and Egg Meal', price: '$15.99', distance: '0.8km', image: '/images/products/burger-meal.jpeg' },
  { category: 'Food', name: 'Shawarma', price: '$15.99', distance: '0.2km', image: '/images/products/burger-meal.jpeg' },

  { category: 'Drugs/Pharmaceuticals', name: 'Paracetamol', price: '$15.99', distance: '0.8km', image: '/images/products/drug.jpeg' },
  { category: 'Drugs/Pharmaceuticals', name: 'Septrin', price: '$15.99', distance: '0.2km', image: '/images/products/drug.jpeg' },

  { category: 'Drugs/Pharmaceuticals', name: 'Chloroquine', price: '$15.99', distance: '0.8km', image: '/images/products/drug.jpeg' },
  { category: 'Drugs/Pharmaceuticals', name: 'Vitamin A', price: '$15.99', distance: '0.2km', image: '/images/products/drug.jpeg' },

  { category: 'Drugs/Pharmaceuticals', name: 'Nuvalgin', price: '$15.99', distance: '0.8km', image: '/images/products/drug.jpeg' },
  { category: 'Drugs/Pharmaceuticals', name: 'Avexycl', price: '$15.99', distance: '0.2km', image: '/images/products/drug.jpeg' },

  { category: 'Drinks', name: 'Pepsi', price: '$15.99', distance: '0.8km', image: '/images/products/drink.jpeg' },
  { category: 'Drinks', name: 'Coca-cola', price: '$15.99', distance: '0.2km', image: '/images/products/drink.jpeg'  },

  { category: 'Drinks', name: 'Schweppes', price: '$15.99', distance: '0.8km', image: '/images/products/drink.jpeg'  },
  { category: 'Drinks', name: 'Hollandia Yoghurt', price: '$15.99', distance: '0.2km', image: '/images/products/drink.jpeg'  },

  { category: 'Drinks', name: 'Malt', price: '$15.99', distance: '0.8km', image: '/images/products/drink.jpeg'  },
  { category: 'Drinks', name: 'Greek Yoghurt', price: '$32.99', distance: '0.2km', image: '/images/products/drink.jpeg'  },

  { category: 'Food', name: 'Boiled Yam and Stew', price: '$15.99', distance: '0.8km', image: '/images/products/burger-meal.jpeg' },
  { category: 'Food', name: 'Plantains', price: '$15.99', distance: '0.2km', image: '/images/products/burger-meal.jpeg' },

  { category: 'Groceries', name: 'Peak Milk', price: '$15.99', distance: '0.8km', image: '/images/products/grocery.jpeg' },
  { category: 'Groceries', name: 'Bournvita', price: '$15.99', distance: '0.2km', image: '/images/products/grocery.jpeg'  },

  { category: 'Groceries', name: 'Pack of Sugar', price: '$15.99', distance: '0.8km', image: '/images/products/grocery.jpeg'  },
  { category: 'Groceries', name: 'Plantain Chips', price: '$15.99', distance: '0.2km', image: '/images/products/grocery.jpeg'  },

  { category: 'Groceries', name: 'Toothpaste', price: '$15.99', distance: '0.8km', image: '/images/products/grocery.jpeg'  },
  { category: 'Groceries', name: 'Washing Soap', price: '$15.99', distance: '0.2km', image: '/images/products/grocery.jpeg'  },

  { category: 'Groceries', name: 'Millet pack', price: '$15.99', distance: '0.8km', image: '/images/products/grocery.jpeg'  },
  { category: 'Food', name: 'Eba and Soup', price: '$15.99', distance: '0.2km', image: '/images/products/burger-meal.jpeg' },
  // Add more products for each category
];

export default function ExploreSection() {
  const [activeTab, setActiveTab] = useState('Food');
  const [loadedImages, setLoadedImages] = useState({});

  // Get filtered products based on active tab
  const filteredProducts = products.filter(product => product.category === activeTab);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-gray-800">
          Explore Consumables
        </h2>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <Button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`rounded-full px-6 py-3 transition-all flex items-center gap-2
                  ${isActive
                    ? 'bg-primary text-white shadow-lg hover:bg-primary/90 ring-2 ring-secondary ring-offset-2'
                    : 'border-2 border-primary/30 text-primary bg-white hover:border-primary hover:bg-secondary/20'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-primary'}`} />
                <span className={isActive ? 'text-white' : 'text-primary'}>
                  {tab.name}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.name}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group relative"
            >
              {/* Popular Badge */}
              {product.category === 'Food' && (
                <div className="absolute top-2 right-2 bg-secondary text-gray-900 px-3 py-1 rounded-full text-xs font-bold z-10">
                  Popular
                </div>
              )}

              {/* Image Container */}
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    loadedImages[product.name] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoadingComplete={() => setLoadedImages(prev => ({ ...prev, [product.name]: true }))}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpeg';
                    setLoadedImages(prev => ({ ...prev, [product.name]: true }));
                  }}
                />
                {!loadedImages[product.name] && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-2">{product.name}</h4>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Bike className="w-4 h-4 text-primary" />
                  <span>{product.distance}</span>
                  <Clock className="w-4 h-4 ml-2 text-secondary" />
                  <span>15-25 min</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary text-lg">
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="bg-secondary hover:bg-secondary/90 text-gray-900 shadow-sm hover:-translate-y-0.5 transition-transform"
                  >
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}