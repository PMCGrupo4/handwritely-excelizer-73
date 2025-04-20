import axios from 'axios';

// Datos de ejemplo para cuando el servidor no esté disponible
const mockCommands = [
  {
    id: '1',
    image_url: 'https://via.placeholder.com/150',
    created_at: new Date().toISOString(),
    items: [
      { id: '1', producto: 'Café Americano', cantidad: 2, precio: 2500, total: 5000 },
      { id: '2', producto: 'Croissant', cantidad: 1, precio: 3500, total: 3500 },
    ],
  },
  {
    id: '2',
    image_url: 'https://via.placeholder.com/150',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
    items: [
      { id: '3', producto: 'Sandwich', cantidad: 1, precio: 4500, total: 4500 },
      { id: '4', producto: 'Jugo de naranja', cantidad: 1, precio: 3000, total: 3000 },
    ],
  },
];

// Función para verificar si estamos en modo desarrollo
const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};

// Función para verificar si debemos usar datos de ejemplo
const shouldUseMockData = () => {
  // Siempre usar datos de ejemplo en desarrollo si la variable de entorno está configurada
  if (isDevelopment() && import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return true;
  }
  
  return false;
};

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Aumentar el tiempo de espera para evitar errores de red
  timeout: 30000, // Aumentado a 30 segundos
  withCredentials: true, // Importante para CORS con credenciales
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Función para comprimir una imagen
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
      
      // Calcular dimensiones manteniendo proporción
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Dibujar imagen en el canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("No se pudo comprimir la imagen"));
            return;
          }
          
          const compressedFile = new File([blob], file.name, {
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
    // Si estamos en desarrollo y debemos usar datos de ejemplo, devolverlos directamente
    if (shouldUseMockData()) {
      console.log('Using mock data for development (getUserCommands)');
      // Devolver un array vacío en lugar de datos de ejemplo
      return [];
    }
    
    try {
      const response = await api.get(`/commands/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user commands:', error);
      
      // En desarrollo, devolver un array vacío si hay un error de red
      if (isDevelopment() && (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED')) {
        console.log('Using empty array for development (error fallback)');
        return [];
      }
      
      throw error;
    }
  },

  // Crear un nuevo comando
  createCommand: async (userId: string, imageFile: File) => {
    try {
      // Comprimir la imagen antes de enviarla
      const compressedFile = await compressImage(imageFile);
      
      // Convertir la imagen a base64
      const imageBase64 = await fileToDataUrl(compressedFile);

      const response = await api.post('/commands/ocr', {
        userId,
        image: imageBase64
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating command:', error);
      throw error;
    }
  },

  // Eliminar un comando
  deleteCommand: async (commandId: string) => {
    // Si estamos en desarrollo y debemos usar datos de ejemplo, simular éxito
    if (shouldUseMockData()) {
      console.log('Using mock data for development (deleteCommand)');
      return { success: true };
    }
    
    try {
      const response = await api.delete(`/commands/${commandId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting command:', error);
      
      // En desarrollo, simular éxito si hay un error de red
      if (isDevelopment() && (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED')) {
        console.log('Using mock data for development (error fallback)');
        return { success: true };
      }
      
      throw error;
    }
  },
};

export default api; 