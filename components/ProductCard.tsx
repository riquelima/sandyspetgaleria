import React from 'react';
import type { GroomedPet } from '../types';

interface ProductCardProps {
  product: GroomedPet;
}

const ProductCard: React.FC<ProductCardProps> = ({ product: pet }) => {
  return (
    <div className="group w-full h-96 [perspective:1000px]">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* --- FRONT FACE (ANTES) --- */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col [backface-visibility:hidden]">
          <div className="relative">
            <img src={pet.before_image_url} alt={`Antes - ${pet.name}`} className="w-full h-64 object-cover" />
            <div className="absolute top-2 left-2 text-xs font-bold px-3 py-1 rounded-full bg-yellow-400 text-brand-brown-dark">
              Antes
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow items-center text-center justify-center">
            <h3 className="text-2xl font-bold text-brand-pink-dark">{pet.name}</h3>
            <p className="text-brand-brown-DEFAULT text-base">{pet.breed}</p>
          </div>
        </div>

        {/* --- BACK FACE (DEPOIS) --- */}
        <div className="absolute w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="relative">
            <img src={pet.after_image_url} alt={`Depois - ${pet.name}`} className="w-full h-64 object-cover" />
            <div className="absolute top-2 left-2 text-xs font-bold px-3 py-1 rounded-full bg-brand-pink text-white">
              Depois!
            </div>
          </div>
          <div className="p-4 flex flex-col flex-grow items-center text-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-brown-dark">{pet.name}</h3>
              <p className="text-brand-brown-DEFAULT text-xs">{pet.breed}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm font-semibold text-brand-brown-dark">Serviço Realizado:</p>
              <p className="text-base text-brand-pink-dark font-bold">{pet.service}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;