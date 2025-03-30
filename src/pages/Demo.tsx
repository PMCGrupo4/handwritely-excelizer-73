import React, { useState, useRef } from 'react';
import { Camera, FileImage, FileSpreadsheet, ArrowLeft, Plus, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { createWorker } from 'tesseract.js';
import * as XLSX from 'xlsx';

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
      .filter(line => line.length > 0)
      .map((line, index) => {
        // Normaliza espacios y caracteres especiales
        const cleanLine = line
          .replace(/[^\d\s.a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        const parts = cleanLine.split(' ');
        
        // Intenta detectar cantidades y precios
        const numbers = parts.filter(part => !isNaN(Number(part)))
                            .map(num => Number(num));

        // Caso 1: "Producto Cantidad Precio" (ej: "Café 2 1500")
        if (numbers.length >= 2) {
          const precio = numbers.pop() || 0;
          const cantidad = numbers.pop() || 1;
          const producto = parts.slice(0, parts.length - numbers.length - 2).join(' ');
          return {
            id: `item-${Date.now()}-${index}`,
            producto,
            cantidad,
            precio,
            total: cantidad * precio
          };
        }
        // Caso 2: "Producto Precio" (ej: "Agua 500")
        else if (numbers.length === 1) {
          const precio = numbers[0];
          const producto = parts.slice(0, parts.length - 1).join(' ');
          return {
            id: `item-${Date.now()}-${index}`,
            producto,
            cantidad: 1,
            precio,
            total: precio
          };
        }
        // Caso 3: Solo texto (ej: "Jugo natural")
        else {
          return {
            id: `item-${Date.now()}-${index}`,
            producto: line,
            cantidad: 1,
            precio: 0,
            total: 0
          };
        }
      });
  };

  // Procesa la imagen con Tesseract.js
  const processImageWithOCR = async (imageSrc: string): Promise<CommandTableRow[]> => {
    setIsProcessing(true);
    const worker = await createWorker('spa');
    
    try {
      const { data } = await worker.recognize(imageSrc);
      await worker.terminate();
      return parseCommandText(data.text);
    } catch (error) {
      console.error("Error en OCR:", error);
      toast({
        title: "Error de procesamiento",
        description: "No se pudo leer la comanda. Asegúrate de que la imagen sea clara y esté bien enfocada.",
        variant: "destructive",
      });
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

    const items = await processImageWithOCR(uploadedImage);
    if (items.length === 0) return;

    const newCommand: CommandItem = {
      id: `cmd-${Date.now()}`,
      imageSrc: uploadedImage,
      timestamp: new Date().toLocaleString('es-ES'),
      items
    };
    
    setCommands(prev => [...prev, newCommand]);
    setUploadedImage(null);
    
    toast({
      title: "¡Comanda agregada!",
      description: "Los datos detectados se muestran en la vista previa.",
    });
  };

  // Elimina una comanda del listado
  const removeCommand = (id: string) => {
    setCommands(prev => prev.filter(cmd => cmd.id !== id));
    toast({
      title: "Comanda eliminada",
      description: "La comanda ha sido eliminada de la vista previa.",
    });
  };

  // Genera y descarga el archivo Excel
  const handleGenerateExcel = () => {
    if (commands.length === 0) {
      toast({
        title: "Sin datos",
        description: "Agrega al menos una comanda a la vista previa antes de generar el Excel.",
        variant: "destructive",
      });
      return;
    }

    // Prepara los datos para Excel
    const excelData = commands.flatMap(cmd => 
      cmd.items.map(item => ({
        "Producto": item.producto,
        "Cantidad": item.cantidad,
        "Precio Unitario": `$${item.precio.toLocaleString('es-ES')}`,
        "Total": `$${item.total.toLocaleString('es-ES')}`,
        "Fecha": cmd.timestamp
      }))
    );

    // Crea el libro de Excel
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comandas");
    
    // Descarga el archivo
    XLSX.writeFile(wb, `comandas_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "¡Excel descargado!",
      description: "El archivo se ha guardado en tu dispositivo.",
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
          {/* Panel izquierdo - Subida de imágenes */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4">Subir Comanda</h2>
              
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
                  <li>Escribe cada producto en una línea nueva</li>
                  <li>Formato recomendado: "Producto Cantidad Precio"</li>
                  <li>Ejemplo: "Café con leche 2 1800"</li>
                </ul>
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

          {/* Panel derecho - Vista previa */}
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
                                <TableCell className="font-medium">{item.producto}</TableCell>
                                <TableCell className="text-right">{item.cantidad}</TableCell>
                                <TableCell className="text-right">${item.precio.toLocaleString('es-ES')}</TableCell>
                                <TableCell className="text-right">${item.total.toLocaleString('es-ES')}</TableCell>
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
                        <p className="text-sm text-muted-foreground">Total: <span className="font-semibold">${totalAmount.toLocaleString('es-ES')}</span></p>
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