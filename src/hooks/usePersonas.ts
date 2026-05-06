import { useState, useEffect } from 'react';

export interface Persona {
  id: string;
  name: string;
  description: string;
  exampleText?: string;
  createdAt: string;
}

export function usePersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gultong_personas');
      if (stored) {
        setPersonas(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load personas from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever personas change, but only if loaded
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gultong_personas', JSON.stringify(personas));
    }
  }, [personas, isLoaded]);

  const addPersona = (persona: Omit<Persona, 'id' | 'createdAt'>) => {
    const newPersona: Persona = {
      ...persona,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPersonas((prev) => [...prev, newPersona]);
  };

  const updatePersona = (id: string, updates: Partial<Omit<Persona, 'id' | 'createdAt'>>) => {
    setPersonas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePersona = (id: string) => {
    setPersonas((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    personas,
    isLoaded,
    addPersona,
    updatePersona,
    deletePersona,
  };
}
