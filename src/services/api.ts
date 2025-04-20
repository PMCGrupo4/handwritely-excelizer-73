import axios from 'axios';

// Datos de ejemplo para cuando el servidor no estÃ© disponible
const mockCommands = [
  {
    id: '1',
    image_url: 'https://via.placeholder.com/150',
    created_at: new Date().toISOString(),
    items: [
      { id: '1', producto: 'CafÃ© Americano', cantidad: 2, precio: 2500, total: 5000 },
      { id: '2', producto: 'Croissant', cantidad: 1, precio: 3500, total: 3500 },
    ],
  },
  {
    id: '2',
    image_url: 'https://via.placeholder.com/150',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dÃ­a atrÃ¡s
    items: [
      { id: '3', producto: 'Sandwich', cantidad: 1, precio: 4500, total: 4500 },
      { id: '4', producto: 'Jugo de naranja', cantidad: 1, precio: 3000, total: 3000 },
    ],
  },
];

// FunciÃ³n para verificar si estamos en modo desarrollo
const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};

// FunciÃ³n para verificar si debemos usar datos de ejemplo
const shouldUseMockData = () => {
  // Siempre usar datos de ejemplo en desarrollo si la variable de entorno estÃ¡ configurada
  if (isDevelopment() && import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return true;
  }
  
  // También podemos devolver true cuando estamos en modo de prueba local
  return true; // Cambia esto a false cuando el backend esté funcionando
};

// ConfiguraciÃ³n base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://handsheetbackend.netlify.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
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
      console.error('CORS Error: No se pudo establecer conexiÃ³n con el servidor');
    }

    return Promise.reject(error);
  }
);

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// FunciÃ³n para comprimir una imagen
export const compressImage = async (file: File, quality = 0.8, maxWidth = 1920): Promise<File> => {

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
      reject(new Error("Error al cargar la imagen para compresiÃ³n"));
    };

    img.src = URL.createObjectURL(file);
  });
};

// FunciÃ³n para convertir un archivo a URL de datos
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
      const response = await api.get(`/commands/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user commands:', error);
      throw error;
    }
  },

  // Procesar imagen con OCR
  processImageOCR: async (imageBase64: string, userId: string = 'demo-user') => {
    try {
      // Si estamos en modo de prueba, usar datos simulados
      if (shouldUseMockData()) {
        console.log('Using mock OCR data during development');
        // Retardo simulado para imitar el procesamiento del servidor
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          success: true,
          data: {
            receipt: {
              items: [
                { name: 'CafÃ© Americano', quantity: 2, price: 2500, subtotal: 5000 },
                { name: 'Croissant', quantity: 1, price: 3500, subtotal: 3500 },
              ],
              total: 8500,
              currency: 'COP',
              merchant: { name: 'Café Demo' }
            },
            rawText: "CafÃ© Americano 2 2500\nCroissant 1 3500"
          }
        };
      }
      
      // Si no estamos en modo de prueba, intentar la llamada real
      const response = await api.post('/commands/ocr', {
        image: imageBase64,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error processing image with OCR:', error);
      
      // Si hay un error, podemos mostrar datos de prueba en desarrollo
      if (isDevelopment()) {
        console.log('Falling back to mock data after error');
        return {
          success: true,
          data: {
            receipt: {
              items: [
                { name: 'CafÃ© Americano (fallback)', quantity: 2, price: 2500, subtotal: 5000 },
                { name: 'Croissant (fallback)', quantity: 1, price: 3500, subtotal: 3500 },
              ],
              total: 8500,
              currency: 'COP',
              merchant: { name: 'Café Demo (Error fallback)' }
            },
            rawText: "CafÃ© Americano 2 2500\nCroissant 1 3500"
          }
        };
      }
      
      throw error;
    }
  },

  // Crear un nuevo comando
  createCommand: async (userId: string, imageFile: File) => {
    try {
      const compressedFile = await compressImage(imageFile);
      const imageBase64 = await fileToDataUrl(compressedFile);
      const response = await api.post('/commands/ocr', {
        userId,
        image: imageBase64
      });
      return response.data;
    } catch (error) {
      console.error('Error creating command:', error);
      throw error;
    }
  },

  // Eliminar un comando
  deleteCommand: async (commandId: string) => {
    try {
      const response = await api.delete(`/commands/${commandId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting command:', error);
      throw error;
    }
  },
};

export default api; 