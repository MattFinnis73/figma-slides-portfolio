import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect } from 'react';

interface SlideViewerProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  slides: string[];
  currentSlideIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function SlideViewer({ isOpen, onClose, projectTitle, slides, currentSlideIndex, onPrevious, onNext }: SlideViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        onPrevious();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrevious, onNext]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-[95vw] max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex items-start justify-between">
            <Dialog.Title className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-gray-900">{projectTitle}</span>
            </Dialog.Title>
            <Dialog.Close className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none" aria-label="Close">
              <X className="size-6" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            View full size slide image
          </Dialog.Description>
          <div className="relative mt-4 flex items-center justify-center bg-gray-50 rounded-lg p-4">
            {/* Previous Button */}
            <button
              onClick={onPrevious}
              disabled={currentSlideIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-6" />
            </button>

            <ImageWithFallback
              src={slides[currentSlideIndex]}
              alt={`${projectTitle} - Slide ${currentSlideIndex + 1}`}
              className="max-h-[70vh] w-auto object-contain"
            />

            {/* Next Button */}
            <button
              onClick={onNext}
              disabled={currentSlideIndex === slides.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex size-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
          
          {/* Slide Counter */}
          <div className="text-center text-sm text-gray-600">
            Slide {currentSlideIndex + 1} / {slides.length}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}