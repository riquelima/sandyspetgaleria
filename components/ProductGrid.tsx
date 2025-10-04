import React from 'react';
import type { GroomedPet } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: GroomedPet[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((pet) => (
        <ProductCard key={pet.id} product={pet} />
      ))}
    </div>
  );
};

export default ProductGrid;