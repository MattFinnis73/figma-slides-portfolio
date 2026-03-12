import { X, ExternalLink } from 'lucide-react';

interface FigmaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  figmaUrl: string;
}

export function FigmaViewer({ isOpen, onClose, projectTitle, figmaUrl }: FigmaViewerProps) {
  if (!isOpen) return null;

  // Convert embed URL to regular Figma URL for "Open in Figma" button
  const getFigmaDirectUrl = (embedUrl: string) => {
    // If it's already an embed URL, extract the actual Figma URL
    // embed.figma.com/slides/FILE_KEY/... -> figma.com/slides/FILE_KEY/...
    if (embedUrl.includes('embed.figma.com')) {
      return embedUrl.replace('embed.figma.com', 'www.figma.com').split('?')[0];
    }
    return embedUrl;
  };

  const directUrl = getFigmaDirectUrl(figmaUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative h-[95vh] w-full max-w-[95vw] rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">{projectTitle}</h2>
          <div className="flex items-center gap-3">
            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
            >
              <ExternalLink className="size-4" />
              Open in Figma
            </a>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
              aria-label="Close"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>

        {/* Figma Embed */}
        <iframe
          src={figmaUrl}
          className="h-[calc(95vh-73px)] w-full rounded-b-2xl border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          title={projectTitle}
        />
      </div>
    </div>
  );
}