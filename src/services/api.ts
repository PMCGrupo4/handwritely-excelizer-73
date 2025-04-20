import axios from 'axios';

// Configuración simplificada de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000
});

// Interceptor mínimo para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Función para comprimir una imagen
export const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error("No se pudo crear el contexto del canvas"));
        return;
      }
      
      // Reducir tamaño significativamente
      let width = img.width;
      let height = img.height;
      
      if (width > 800) {
        height = (height * 800) / width;
        width = 800;
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
        0.5 // Reducir calidad para menor tamaño
      );
    };
    
    img.onerror = () => {
      reject(new Error("Error al cargar la imagen"));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Función para convertir archivo a base64
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Servicios simplificados
export const commandService = {
  processImageOCR: async (imageBase64: string, userId: string = 'demo-user') => {
    try {
      // Intentar directamente con la función de Netlify
      const response = await axios.post('https://handsheetbackend.netlify.app/.netlify/functions/ocr', {
        image: imageBase64,
        userId
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error en OCR:', error);
      throw error;
    }
  },

  createCommand: async (userId: string, imageFile: File) => {
    try {
      const compressedFile = await compressImage(imageFile);
      const imageBase64 = await fileToDataUrl(compressedFile);
      
      // Usar la ruta directa a la función
      const response = await axios.post('https://handsheetbackend.netlify.app/.netlify/functions/ocr', {
        userId,
        image: imageBase64
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating command:', error);
      throw error;
    }
  }
};

export default api;