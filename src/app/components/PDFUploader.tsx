import { Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFUploaderProps {
  onPDFLoad: (pages: string[]) => void;
  currentPDF?: string;
  onRemove?: () => void;
}

export function PDFUploader({ onPDFLoad, currentPDF, onRemove }: PDFUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file');
      return;
    }

    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const pageImages: string[] = [];

      // Render each page to canvas and convert to image
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Reduced from 2 to 1.5 for smaller file size
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Use JPEG format with quality to reduce file size
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        pageImages.push(imageDataUrl);
      }

      console.log(`PDF processed: ${pageImages.length} pages`);
      console.log('First page data URL preview:', pageImages[0]?.substring(0, 100));
      setSuccess(true);
      onPDFLoad(pageImages);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF file. Please try again.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Reset success state after a short delay
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (currentPDF) {
    return (
      <div className="flex items-center gap-2 rounded-lg border-2 border-green-300 bg-green-50 px-4 py-3">
        <span className="text-sm text-green-700">PDF Loaded</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-auto rounded-full p-1 transition-colors hover:bg-green-200"
            aria-label="Remove PDF"
          >
            <X className="size-4 text-green-700" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload PDF"
      />
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span>Processing PDF...</span>
        ) : success ? (
          <span className="text-green-600">PDF Uploaded Successfully!</span>
        ) : (
          <>
            <Upload className="size-5" />
            <span>Upload PDF</span>
          </>
        )}
      </button>
    </div>
  );
}