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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="flex h-full w-full max-w-7xl flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{projectTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close viewer"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Figma Embed */}
        <div className="flex-1 overflow-hidden rounded-lg bg-white shadow-2xl">
          <iframe
            src={figmaUrl}
            className="size-full"
            allowFullScreen
            title={projectTitle}
          />
        </div>
      </div>
    </div>
  );
}
