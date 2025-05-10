import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-fallback-supabase-url';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'your-fallback-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://handsheetbackend.netlify.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // Aumentado a 1 minuto
  withCredentials: false
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      config: error.config
    });
    
    if (error.message === 'Network Error' && !error.response) {
      console.error('CORS Error: No se pudo establecer conexión con el servidor');
    }
    
    return Promise.reject(error);
  }
);

// Función para comprimir una imagen
export const compressImage = async (file: File, quality = 0.6, maxWidth = 1000): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error("No se pudo crear el contexto del canvas"));
        return;
      }
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("No se pudo comprimir la imagen"));
            return;
          }
          
          const compressedFile = new File([blob], 'image.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error("Error al cargar la imagen para compresión"));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Función para convertir un archivo a URL de datos
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

// Servicios para comandos
export const commandService = {
  // Obtener todos los comandos de un usuario
  getUserCommands: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('ocr_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user commands:', error);
      throw error;
    }
  },

  // Procesar imagen con OCR
  processImageOCR: async (imageBase64: string, userId: string = 'demo-user') => {
    try {
      // Usar URL absoluta con axios directamente
      const response = await axios.post('https://handsheetbackend.netlify.app/.netlify/functions/ocr', {
        image: imageBase64,
        userId
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Error processing image with OCR:', error);
      throw error;
    }
  },

  // Crear un nuevo comando
  createCommand: async (userId: string, imageFile: File) => {
    try {
      // Comprimir la imagen antes de enviarla
      const compressedFile = await compressImage(imageFile);
      
      // Si después de la compresión sigue siendo muy grande, comprimir más
      let finalFile = compressedFile;
      if (compressedFile.size > 2 * 1024 * 1024) { // Si es mayor a 2MB
        console.log('Imagen aún grande, aplicando compresión adicional');
        finalFile = await compressImage(compressedFile, 0.4, 800);
      }
      
      const imageBase64 = await fileToDataUrl(finalFile);
      console.log(`Tamaño de imagen después de compresión: ${Math.round(finalFile.size/1024)}KB`);
      
      // Usar URL absoluta con axios directamente
      const response = await axios.post('https://handsheetbackend.netlify.app/.netlify/functions/ocr', {
        userId,
        image: imageBase64
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Error creating command:', error);
      throw error;
    }
  },

  /**
   * Get commands for a specific user
   * @param userId - The user ID to fetch commands for
   * @returns Promise with the commands data
   */
  async getCommands(userId: string) {
    try {
      const response = await axios.get(`https://handsheetbackend.netlify.app/.netlify/functions/commands/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching commands:', error);
      throw error;
    }
  },

  /**
   * Update a specific command
   * @param id - The command ID to update
   * @param commandData - The updated command data
   * @returns Promise with the updated command data
   */
  async updateCommand(id: string, commandData: {
    id?: string;
    imageSrc?: string;
    timestamp?: string;
    items: Array<{
      id: string;
      producto: string;
      cantidad: number;
      precio: number;
      total: number;
    }>;
  }) {
    try {
      const response = await axios.put(`https://handsheetbackend.netlify.app/.netlify/functions/commands/${id}`, commandData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Error updating command:', error);
      throw error;
    }
  },

  /**
   * Delete a specific command
   * @param id - The command ID to delete
   * @returns Promise with the result of the deletion
   */
  async deleteCommand(id: string) {
    try {
      const response = await axios.delete(`https://handsheetbackend.netlify.app/.netlify/functions/commands/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting command:', error);
      throw error;
    }
  },

  /**
   * Create a new command
   * @param commandData - The command data to create
   * @returns Promise with the created command data
   */
  async createNewCommand(commandData: {
    userId: string;
    imageSrc: string;
    timestamp: string;
    items: Array<{
      id: string;
      producto: string;
      cantidad: number;
      precio: number;
      total: number;
    }>;
  }) {
    try {
      // Use the full URL to the backend API
      const response = await axios.post('https://handsheetbackend.netlify.app/.netlify/functions/commands', commandData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Error creating new command:', error);
      throw error;
    }
  }
};

export default api;