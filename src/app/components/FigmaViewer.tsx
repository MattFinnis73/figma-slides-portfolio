import { X, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

interface FigmaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  figmaUrl: string;
}

export function FigmaViewer({ isOpen, onClose, projectTitle, figmaUrl }: FigmaViewerProps) {
  // Open Figma in new tab automatically when viewer opens
  useEffect(() => {
    if (isOpen && figmaUrl) {
      window.open(figmaUrl, '_blank', 'noopener,noreferrer');
    }
  }, [isOpen, figmaUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
          aria-label="Close"
        >
          <X className="size-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6 inline-flex rounded-full bg-blue-100 p-4">
            <ExternalLink className="size-12 text-blue-600" />
          </div>
          
          <h2 className="mb-3 text-3xl font-bold text-gray-900">{projectTitle}</h2>
          
          <p className="mb-6 text-gray-600">
            Your Figma prototype has opened in a new tab.
            <br />
            <span className="text-sm">If it didn't open, click the button below.</span>
          </p>

          {/* Open button */}
          <a
            href={figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ExternalLink className="size-5" />
            Open Figma Prototype
          </a>

          <p className="mt-6 text-sm text-gray-500">
            💡 Tip: Figma prototypes can't be embedded directly due to security restrictions,
            <br />
            but opening in a new tab preserves all animations and interactions!
          </p>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-4 rounded-lg bg-gray-100 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}