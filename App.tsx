import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import AddPhotoModal from './components/AddPhotoModal';
import type { GroomedPet } from './types';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [pets, setPets] = useState<GroomedPet[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching pets:', error);
      } else if (data) {
        setPets(data);
      }
    };

    fetchPets();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handlePetAdded = (newPet: GroomedPet) => {
    setPets(prevPets => [newPet, ...prevPets]);
    setIsModalOpen(false);
  };


  return (
    <div className="bg-brand-pink-light min-h-screen flex flex-col font-sans text-brand-brown-dark">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-pink-dark mb-2">Galeria de Transformações</h1>
          <p className="text-lg text-brand-brown-DEFAULT">Veja o antes e depois dos nossos amiguinhos!</p>
        </div>
        
        {isAuthenticated && (
          <div className="text-center mb-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-pink hover:bg-brand-pink-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              + Adicionar Nova Transformação
            </button>
          </div>
        )}

        <ProductGrid products={pets} />
      </main>
      
      <Footer onLoginSuccess={handleLoginSuccess} />

      <AddPhotoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPetAdded={handlePetAdded}
      />
    </div>
  );
};

export default App;