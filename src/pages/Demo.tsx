
import React, { useState, useRef } from 'react';
import { Camera, FileImage, FileSpreadsheet, ArrowLeft, Plus, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

// Define the structure for our command data
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

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Generate random data for our excel preview (in real app, this would come from OCR/AI processing)
  const generateSampleData = (): CommandTableRow[] => {
    const products = ["Café Americano", "Latte", "Capuchino", "Espresso", "Té Verde", "Pastel", "Sandwich"];
    const rowCount = Math.floor(Math.random() * 5) + 2; // Between 2-6 items
    
    return Array.from({ length: rowCount }, (_, i) => {
      const producto = products[Math.floor(Math.random() * products.length)];
      const cantidad = Math.floor(Math.random() * 3) + 1;
      const precio = Math.floor(Math.random() * 50) + 30;
      return {
        id: `item-${Date.now()}-${i}`,
        producto,
        cantidad,
        precio,
        total: cantidad * precio
      };
    });
  };

  const addCommandToPreview = () => {
    if (!uploadedImage) {
      toast({
        title: "Imagen requerida",
        description: "Por favor, sube o toma una foto de una comanda primero.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const newCommand: CommandItem = {
        id: `cmd-${Date.now()}`,
        imageSrc: uploadedImage,
        timestamp: new Date().toLocaleString('es-ES'),
        items: generateSampleData()
      };
      
      setCommands(prev => [...prev, newCommand]);
      setUploadedImage(null);
      setIsProcessing(false);
      
      toast({
        title: "¡Procesado con éxito!",
        description: "La comanda ha sido agregada a la vista previa.",
      });
    }, 1500);
  };

  const removeCommand = (id: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== id));
    toast({
      title: "Comanda eliminada",
      description: "La comanda ha sido eliminada de la vista previa.",
    });
  };

  const handleGenerateExcel = () => {
    if (commands.length === 0) {
      toast({
        title: "Sin datos",
        description: "Agrega al menos una comanda a la vista previa antes de generar el Excel.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "¡Éxito!",
        description: "Archivo Excel generado correctamente. Descargando...",
      });
      
      // In a real implementation, here you would generate and download the Excel file
      // For now, we'll just log to console
      console.log("Generating Excel with data:", commands);
      
      // Simulate download after a brief delay
      setTimeout(() => {
        console.log("Excel file downloaded");
      }, 1000);
    }, 1500);
  };

  // Calculate totals for all commands
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
          <div className="text-sm text-muted-foreground">Demostración</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Convierte tu Comanda a Excel
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sube o toma una foto de tu comanda y conviértela en un archivo Excel en segundos
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Upload Section - Left Panel */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4">Subir Comanda</h2>
              
              <div className="space-y-4">
                {/* Hidden file input for image upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  capture="environment"
                />
                
                {/* Upload/Camera Buttons */}
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  <FileImage className="h-5 w-5" />
                  Subir Imagen
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={handleCameraCapture} 
                  className="w-full flex items-center justify-center gap-2 h-12"
                >
                  <Camera className="h-5 w-5" />
                  Tomar Foto
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Consejos para mejores resultados:</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Asegúrate de que la comanda esté bien iluminada</li>
                  <li>Evita sombras o reflejos en la imagen</li>
                  <li>Mantén la comanda plana y sin dobleces</li>
                  <li>Encuadra toda la comanda en la foto</li>
                </ul>
              </div>
            </div>

            {/* Process and Generate Excel Buttons */}
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
                    Agregar a Excel
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
                    Descargar Excel
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preview Section - Right Panel */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 border h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Vista Previa Excel</h2>
              
              <div className="flex-grow overflow-auto">
                {uploadedImage && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-sm font-medium mb-2">Imagen Actual</h3>
                    <img 
                      src={uploadedImage} 
                      alt="Vista previa de la comanda" 
                      className="max-h-[200px] max-w-full object-contain rounded-md mb-3" 
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={addCommandToPreview}
                        disabled={isProcessing}
                        size="sm"
                        className="text-xs"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Procesar y Agregar
                      </Button>
                    </div>
                  </div>
                )}
                
                {commands.length > 0 ? (
                  <div className="space-y-6">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {commands.flatMap(cmd => 
                            cmd.items.map(item => (
                              <TableRow key={item.id}>
                                <TableCell>{item.producto}</TableCell>
                                <TableCell className="text-right">{item.cantidad}</TableCell>
                                <TableCell className="text-right">${item.precio}</TableCell>
                                <TableCell className="text-right">${item.total}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Comandas: <span className="font-semibold">{commands.length}</span></p>
                        <p className="text-sm text-muted-foreground">Productos totales: <span className="font-semibold">{totalItems}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total: <span className="font-semibold">${totalAmount}</span></p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Comandas procesadas:</h3>
                      <div className="space-y-2">
                        {commands.map(cmd => (
                          <div key={cmd.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <img 
                                src={cmd.imageSrc} 
                                alt="Comanda" 
                                className="h-10 w-10 object-cover rounded-md mr-3" 
                              />
                              <span className="text-sm">{cmd.timestamp}</span>
                            </div>
                            <Button
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeCommand(cmd.id)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="inline-flex h-16 w-16 rounded-full bg-secondary/20 items-center justify-center mb-4">
                      <FileSpreadsheet className="h-8 w-8 text-primary/60" />
                    </div>
                    <p className="text-muted-foreground">
                      Aquí aparecerá la vista previa del Excel. <br />
                      Sube una imagen y procésala para comenzar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} HandSheet. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Demo;
