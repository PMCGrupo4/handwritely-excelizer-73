import React, { useState, useRef, useEffect } from 'react';
import { Camera, FileImage, FileSpreadsheet, ArrowLeft, Plus, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { createWorker } from 'tesseract.js';
import * as XLSX from 'xlsx';
import { commandService } from '@/services/api';
import axios from 'axios';

interface CommandItem {
  id: string;
  imageSrc: string;
  timestamp: string;
  items: CommandTableRow[];
}

interface CommandTableRow {
  id: string;
  producto: string;
  cantidad: number;
  precio: number;
  total: number;
}

const Demo = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commands, setCommands] = useState<CommandItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentCommandId, setCurrentCommandId] = useState<string | null>(null);
  const [editingCommands, setEditingCommands] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string | null>(null);

  // Load user commands on mount
  useEffect(() => {
    // For demo purposes, you can set a default user ID
    // In a real app, this would come from authentication
    const demoUserId = "demo-user-123";
    setUserId(demoUserId);
    
    // Load commands for the user
    if (demoUserId) {
      loadUserCommands(demoUserId);
    }
  }, []);

  // Load commands from the backend
  const loadUserCommands = async (userId: string) => {
    try {
      setIsProcessing(true);
      const response = await commandService.getCommands(userId);
      if (response && response.success && response.data) {
        setCommands(response.data);
        
        // Initialize editing state for each command
        const editingState: { [key: string]: boolean } = {};
        response.data.forEach((command: CommandItem) => {
          editingState[command.id] = false;
        });
        setEditingCommands(editingState);
        
        toast({
          title: "Comandas cargadas",
          description: `Se han cargado ${response.data.length} comandas.`,
        });
      }
    } catch (error) {
      console.error("Error loading commands:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Maneja la subida de imágenes
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Activa el input de archivo para la cámara
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Procesa el texto del OCR para extraer productos, cantidades y precios
  const parseCommandText = (text: string): CommandTableRow[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 2) // Ignora líneas muy cortas
      .map((line, index) => {
        // Extrae números (incluye decimales y comas)
        const numbers = line.match(/(\d+[.,]?\d*)/g)?.map(num => 
          parseFloat(num.replace(',', '.'))
        ) || [];

        // Extrae el nombre del producto (elimina números y símbolos)
        const producto = line
          .replace(/(\d+[.,]?\d*)/g, '')  // Elimina números
          .replace(/[^\w\sáéíóúÁÉÍÓÚñÑ]/g, '') // Elimina símbolos
          .replace(/\s+/g, ' ') // Normaliza espacios
          .trim();

        // Determina cantidad y precio
        let cantidad = 1;
        let precio = 0;
        
        if (numbers.length >= 2) {
          // Si hay 2+ números: [cantidad, precio]
          cantidad = numbers[0];
          precio = numbers[1];
        } 
        else if (numbers.length === 1) {
          // Si solo hay un número: asume que es precio (cantidad=1)
          precio = numbers[0];
        }

        return {
          id: `item-${Date.now()}-${index}`,
          producto: producto || `Producto ${index + 1}`,
          cantidad,
          precio,
          total: cantidad * precio
        };
      });
  };

  // Procesa la imagen con el backend en lugar de Tesseract.js local
  const processImageWithOCR = async (): Promise<CommandTableRow[]> => {
    if (!uploadedImage) {
      return [];
    }
  
    setIsProcessing(true);
  
    try {
      const response = await commandService.processImageOCR(uploadedImage);
      
      if (response && response.success && response.data && response.data.receipt) {
        const receiptData = response.data.receipt;
  
        // Mapear los items del recibo al formato CommandTableRow
        return receiptData.items.map((item, index) => ({
          id: `item-${Date.now()}-${index}`,
          producto: item.name,
          cantidad: item.quantity,
          precio: item.price,
          total: item.subtotal
        }));
      } else {
        // Si el backend devuelve un raw text, lo podemos procesar con la lógica existente
        if (response?.data?.rawText) {
          console.log("Texto detectado por OCR (desde backend):", response.data.rawText);
          return parseCommandText(response.data.rawText);
        }
        return [];
      }
    } catch (error) {
      console.error("Error en OCR (backend):", error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  // Agrega una comanda procesada al listado
  const addCommandToPreview = async () => {
    if (!uploadedImage) {
      toast({
        title: "Imagen requerida",
        description: "Por favor, sube o toma una foto de una comanda primero.",
        variant: "destructive",
      });
      return;
    }

    const items = await processImageWithOCR();
    if (items.length === 0) return;

    const newCommand: CommandItem = {
      id: `cmd-${Date.now()}`,
      imageSrc: uploadedImage,
      timestamp: new Date().toLocaleString('es-ES'),
      items
    };
    
    setCommands(prev => [...prev, newCommand]);
    setEditingCommands(prev => ({ ...prev, [newCommand.id]: false }));
    setUploadedImage(null);
    
    // Save the new command to backend if userId is available
    if (userId) {
      try {
        // Use createNewCommand to properly create a new command in the database
        await commandService.createNewCommand({
          userId,
          imageSrc: newCommand.imageSrc,
          timestamp: newCommand.timestamp,
          items: newCommand.items
        });
        
        toast({
          title: "¡Comanda agregada!",
          description: "La comanda ha sido guardada en el servidor.",
        });
      } catch (error) {
        console.error("Error saving new command:", error);
      }
    } else {
      toast({
        title: "¡Comanda agregada!",
        description: "Revisa que los datos detectados sean correctos.",
      });
    }
  };

  // Elimina una comanda del listado
  const removeCommand = (id: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== id));
    
    // Delete from backend if userId is available
    if (userId) {
      commandService.deleteCommand(id)
        .then(response => {
          if (response && response.success) {
            toast({
              title: "Comanda eliminada",
              description: "La comanda ha sido eliminada del servidor.",
            });
          }
        })
        .catch(error => {
          console.error("Error deleting command:", error);
        });
    } else {
      toast({
        title: "Comanda eliminada",
        description: "La comanda ha sido eliminada de la vista previa.",
      });
    }
  };

  // Genera y descarga el archivo Excel
  const handleGenerateExcel = () => {
    if (commands.length === 0) {
      toast({
        title: "Sin datos",
        description: "Agrega al menos una comanda a la vista previa.",
        variant: "destructive",
      });
      return;
    }

    // Prepara los datos para Excel
    const excelData = commands.flatMap(cmd => 
      cmd.items.map(item => ({
        "Producto": item.producto,
        "Cantidad": item.cantidad,
        "Precio Unitario": item.precio,
        "Total": item.total,
        "Fecha": cmd.timestamp
      }))
    );

    // Crea el libro de Excel
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comandas");
    
    // Descarga el archivo (formato: "comandas_YYYY-MM-DD.xlsx")
    const fileName = `comandas_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast({
      title: "¡Excel descargado!",
      description: `Archivo "${fileName}" guardado.`,
    });
  };

  // Calcula los totales generales
  const calculateTotals = () => {
    let totalItems = 0;
    let totalAmount = 0;
    
    commands.forEach(cmd => {
      cmd.items.forEach(item => {
        totalItems += item.cantidad;
        totalAmount += item.total;
      });
    });
    
    return { totalItems, totalAmount };
  };

  const { totalItems, totalAmount } = calculateTotals();

  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (itemId: string, field: keyof CommandTableRow, value: string | number) => {
    setCommands(prevCommands => prevCommands.map(command => {
      if (command.id === currentCommandId) {
        return {
          ...command,
          items: command.items.map(item => {
            if (item.id === itemId) {
              const updatedItem = { ...item, [field]: value };
              // Recalculate total if quantity or price is changed
              if (field === 'cantidad' || field === 'precio') {
                updatedItem.total = updatedItem.cantidad * updatedItem.precio;
              }
              return updatedItem;
            }
            return item;
          })
        };
      }
      return command;
    }));
  };

  // Función para guardar los cambios
  const saveCommand = () => {
    if (!currentCommandId) return;
    
    const commandToUpdate = commands.find(cmd => cmd.id === currentCommandId);
    if (!commandToUpdate) return;
    
    // Save to backend
    if (userId) {
      commandService.updateCommand(currentCommandId, commandToUpdate)
        .then(response => {
          if (response && response.success) {
            toast({
              title: "Cambios guardados",
              description: "Los cambios han sido guardados exitosamente.",
            });
          }
        })
        .catch(error => {
          console.error("Error saving command:", error);
        });
    } else {
      // If no userId (local mode), just show a toast
      toast({
        title: "Cambios guardados",
        description: "Los cambios han sido guardados localmente.",
      });
    }
  };

  const toggleEditMode = (commandId: string) => {
    setEditingCommands(prev => {
      const isCurrentlyEditing = prev[commandId];
      const newEditingState = !isCurrentlyEditing;

      // If switching to edit mode, ensure the command is saved first
      if (newEditingState) {
        setCurrentCommandId(commandId);
        saveCommand();
      }

      return {
        ...prev,
        [commandId]: newEditingState
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <FileSpreadsheet className="h-6 w-6 text-primary mr-2" />
              <span className="font-display text-xl font-medium">HandSheet</span>
            </div>
          </Link>
          <div className="text-sm text-muted-foreground">Procesamiento de comandas</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Convierte comandas a Excel
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Toma una foto o sube una imagen de tu comanda para generar un Excel automáticamente
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Panel izquierdo - Subida de imágenes */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4">Captura la comanda</h2>
              
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  capture="environment"
                />
                
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  <FileImage className="h-5 w-5" />
                  Subir imagen
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={handleCameraCapture} 
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  <Camera className="h-5 w-5" />
                  Usar cámara
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Formato recomendado:</h3>
                <div className="text-sm bg-gray-50 p-3 rounded-md">
                  <p className="font-mono">Café latte 2 1800</p>
                  <p className="font-mono">Sandwich jamón 1 1200</p>
                  <p className="font-mono">Agua mineral 3 800</p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-4">
              <Button 
                onClick={addCommandToPreview}
                disabled={!uploadedImage || isProcessing}
                className="w-full h-12 text-lg"
                variant="secondary"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar comanda
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleGenerateExcel}
                disabled={commands.length === 0 || isProcessing}
                className="w-full h-12 text-lg"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generando...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Descargar Excel ({commands.length})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Panel derecho - Vista previa */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 border h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Vista previa</h2>
                <div className="text-sm text-muted-foreground">
                  Total: <span className="font-semibold">${totalAmount.toLocaleString('es-ES')}</span>
                </div>
              </div>
              
              <div className="flex-grow overflow-auto">
                {uploadedImage && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Imagen a procesar</h3>
                      <Button
                        onClick={addCommandToPreview}
                        disabled={isProcessing}
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Procesar
                      </Button>
                    </div>
                    <img 
                      src={uploadedImage} 
                      alt="Comanda a procesar" 
                      className="max-h-[200px] max-w-full object-contain rounded-md" 
                    />
                  </div>
                )}
                
                {commands.length > 0 ? (
                  <div className="space-y-6">
                    {commands.map(command => (
                      <div key={command.id} className="command-preview">
                        <div className="flex justify-between items-center mb-2">
                          <h3>Comanda procesada el {command.timestamp}</h3>
                          <Button 
                            onClick={() => removeCommand(command.id)} 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                        <img src={command.imageSrc} alt="Comanda" className="command-image" />
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Producto</TableHead>
                              <TableHead>Cantidad</TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {command.items.map(item => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={item.producto}
                                    onChange={(e) => handleEditChange(item.id, 'producto', e.target.value)}
                                    disabled={!editingCommands[command.id]}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={item.cantidad}
                                    onChange={(e) => handleEditChange(item.id, 'cantidad', parseFloat(e.target.value))}
                                    disabled={!editingCommands[command.id]}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={item.precio}
                                    onChange={(e) => handleEditChange(item.id, 'precio', parseFloat(e.target.value))}
                                    disabled={!editingCommands[command.id]}
                                  />
                                </TableCell>
                                <TableCell>{item.total}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Button onClick={() => toggleEditMode(command.id)}>
                          {editingCommands[command.id] ? 'Cancelar' : 'Editar'}
                        </Button>
                        {editingCommands[command.id] && (
                          <Button onClick={() => {
                            setCurrentCommandId(command.id);
                            saveCommand();
                            toggleEditMode(command.id);
                          }}>Guardar cambios</Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="inline-flex h-16 w-16 rounded-full bg-secondary/20 items-center justify-center mb-4">
                      <FileSpreadsheet className="h-8 w-8 text-primary/60" />
                    </div>
                    <p className="text-muted-foreground">
                      {uploadedImage 
                        ? "Procesa la imagen para ver los resultados aquí" 
                        : "Aquí aparecerán las comandas procesadas"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} HandSheet · Procesamiento inteligente de comandas</p>
        </div>
      </footer>
    </div>
  );
};

export default Demo;