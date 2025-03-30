
import React, { useState, useRef } from 'react';
import { Camera, FileImage, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Demo = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleGenerateExcel = () => {
    if (!uploadedImage) {
      toast({
        title: "Imagen requerida",
        description: "Por favor, sube o toma una foto de una comanda primero.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simular procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "¡Éxito!",
        description: "Archivo Excel generado correctamente. Descargando...",
      });
      
      // Simulación de descarga después de un breve retraso
      setTimeout(() => {
        // En una implementación real, aquí se descargaría el archivo generado
        console.log("Archivo Excel descargado");
      }, 1000);
    }, 2000);
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

            {/* Generate Excel Button */}
            <Button 
              onClick={handleGenerateExcel}
              disabled={!uploadedImage || isProcessing}
              className="w-full h-14 text-lg"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Procesando...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Generar Excel
                </>
              )}
            </Button>
          </div>

          {/* Preview Section - Right Panel */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 border h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>
              
              <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-lg p-4 min-h-[400px]">
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Vista previa de la comanda" 
                    className="max-h-full max-w-full object-contain rounded-md" 
                  />
                ) : (
                  <div className="text-center p-6">
                    <div className="inline-flex h-16 w-16 rounded-full bg-secondary/20 items-center justify-center mb-4">
                      <FileImage className="h-8 w-8 text-primary/60" />
                    </div>
                    <p className="text-muted-foreground">
                      Aquí aparecerá la imagen de tu comanda. <br />
                      Sube una imagen o toma una foto para comenzar.
                    </p>
                  </div>
                )}
              </div>
              
              {uploadedImage && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Imagen cargada correctamente. Haz clic en "Generar Excel" para convertir esta comanda.
                  </p>
                </div>
              )}
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
