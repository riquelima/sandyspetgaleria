import React, { useState, useRef } from 'react';
import type { GroomedPet } from '../types';
import { supabase } from '../supabaseClient';

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetAdded: (newPet: GroomedPet) => void;
}

const AddPhotoModal: React.FC<AddPhotoModalProps> = ({ isOpen, onClose, onPetAdded }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [service, setService] = useState('');
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setBreed('');
    setService('');
    setBeforeImage(null);
    setAfterImage(null);
    setBeforePreview(null);
    setAfterPreview(null);
    if(beforeInputRef.current) beforeInputRef.current.value = '';
    if(afterInputRef.current) afterInputRef.current.value = '';
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
    previewSetter: (url: string | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || !service || !beforeImage || !afterImage) {
      alert('Por favor, preencha todos os campos e adicione as duas imagens.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload before image
      console.log('Iniciando upload da imagem "Antes"...');
      const beforeFilePath = `public/${Date.now()}-before-${beforeImage.name}`;
      const { error: uploadErrorBefore } = await supabase.storage
        .from('servicos')
        .upload(beforeFilePath, beforeImage);
      if (uploadErrorBefore) {
        console.error('Erro no Storage (Imagem Antes):', uploadErrorBefore);
        throw new Error(`Falha no upload da imagem 'Antes': ${uploadErrorBefore.message}`);
      }
      console.log('Upload da imagem "Antes" concluído.');

      // 2. Upload after image
      console.log('Iniciando upload da imagem "Depois"...');
      const afterFilePath = `public/${Date.now()}-after-${afterImage.name}`;
      const { error: uploadErrorAfter } = await supabase.storage
        .from('servicos')
        .upload(afterFilePath, afterImage);
      if (uploadErrorAfter) {
        console.error('Erro no Storage (Imagem Depois):', uploadErrorAfter);
        throw new Error(`Falha no upload da imagem 'Depois': ${uploadErrorAfter.message}`);
      }
      console.log('Upload da imagem "Depois" concluído.');

      // 3. Get public URLs
      console.log('Obtendo URLs públicas...');
      const { data: beforeUrlData } = supabase.storage
        .from('servicos')
        .getPublicUrl(beforeFilePath);
      
      const { data: afterUrlData } = supabase.storage
        .from('servicos')
        .getPublicUrl(afterFilePath);
      console.log('URLs obtidas:', beforeUrlData.publicUrl, afterUrlData.publicUrl);

      const newPetData = {
        name,
        breed,
        service,
        before_image_url: beforeUrlData.publicUrl,
        after_image_url: afterUrlData.publicUrl,
      };

      // 4. Insert into database
      console.log('Inserindo dados na tabela "pets"...');
      const { data: insertedData, error: insertError } = await supabase
        .from('pets')
        .insert([newPetData])
        .select()
        .single();

      if (insertError) {
        console.error('Erro de Inserção no Banco de Dados:', insertError);
        throw insertError; // Re-lança o erro original do Supabase
      }
      if (!insertedData) throw new Error("Falha ao receber os dados do pet inserido.");
      console.log('Inserção no banco de dados concluída.');
      
      // 5. Call parent callback and reset
      onPetAdded(insertedData);
      resetForm();
    } catch (error) {
      console.error('Erro geral ao adicionar novo pet:', error);
      alert(`Erro ao adicionar pet: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const ImageInput: React.FC<{ label: string; preview: string | null; inputRef: React.RefObject<HTMLInputElement>; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, preview, inputRef, onChange }) => (
    <div className="w-full text-center">
      <label className="block text-sm font-medium text-brand-brown-dark mb-2">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-brown-light border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {preview ? (
            <img src={preview} alt="Pré-visualização" className="mx-auto h-24 w-24 object-cover rounded-md" />
          ) : (
            <svg className="mx-auto h-12 w-12 text-brand-brown-light" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="flex text-sm text-gray-600">
            <label htmlFor={label} className="relative cursor-pointer bg-white rounded-md font-medium text-brand-pink hover:text-brand-pink-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-pink">
              <span>Carregar um arquivo</span>
              <input ref={inputRef} id={label} name={label} type="file" className="sr-only" accept="image/*" onChange={onChange} />
            </label>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-brand-pink-dark">Adicionar Nova Transformação</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Nome do Pet" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-md focus:ring-brand-pink focus:border-brand-pink" disabled={isUploading} />
                <input type="text" placeholder="Raça" value={breed} onChange={e => setBreed(e.target.value)} required className="w-full px-3 py-2 border rounded-md focus:ring-brand-pink focus:border-brand-pink" disabled={isUploading} />
            </div>
            <input type="text" placeholder="Serviço Realizado" value={service} onChange={e => setService(e.target.value)} required className="w-full px-3 py-2 border rounded-md focus:ring-brand-pink focus:border-brand-pink" disabled={isUploading} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageInput
                label="Foto Antes"
                preview={beforePreview}
                inputRef={beforeInputRef}
                onChange={(e) => handleFileChange(e, setBeforeImage, setBeforePreview)}
              />
              <ImageInput
                label="Foto Depois"
                preview={afterPreview}
                inputRef={afterInputRef}
                onChange={(e) => handleFileChange(e, setAfterImage, setAfterPreview)}
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-md text-brand-brown-dark bg-gray-200 hover:bg-gray-300 transition" disabled={isUploading}>Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-md text-white bg-brand-pink hover:bg-brand-pink-dark transition disabled:bg-gray-400" disabled={isUploading}>
                  {isUploading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhotoModal;