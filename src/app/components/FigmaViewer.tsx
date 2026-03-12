import { X } from 'lucide-react';

interface FigmaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  figmaUrl: string;
}

export function FigmaViewer({ isOpen, onClose, projectTitle, figmaUrl }: FigmaViewerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative h-[90vh] w-full max-w-7xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">{projectTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Figma Embed */}
        <iframe
          src={figmaUrl}
          className="h-[calc(90vh-73px)] w-full rounded-b-2xl"
          allowFullScreen
          allow="fullscreen"
          title={projectTitle}
        />
      </div>
    </div>
  );
}