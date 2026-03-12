import { ImageWithFallback } from './figma/ImageWithFallback';
import { Pencil, Check } from 'lucide-react';
import { useState } from 'react';

interface SlideCardProps {
  title: string;
  imageUrl: string;
  onClick: () => void;
  onTitleChange: (newTitle: string) => void;
  isViewMode?: boolean;
}

export function SlideCard({ title, imageUrl, onClick, onTitleChange, isViewMode }: SlideCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTempTitle(title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-2xl">
      <div 
        className="aspect-video overflow-hidden bg-gray-100 cursor-pointer relative"
        onClick={onClick}
      >
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {/* Click to view overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-lg font-semibold text-white">Click to view</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={handleTitleSave}
                autoFocus
                className="flex-1 rounded border-2 border-blue-400 px-2 py-1 text-xl font-semibold text-gray-900 focus:outline-none"
              />
              <button
                onClick={handleTitleSave}
                className="rounded p-1 text-green-600 hover:bg-green-50"
                aria-label="Save title"
              >
                <Check className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              {!isViewMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempTitle(title);
                    setIsEditingTitle(true);
                  }}
                  className="ml-auto rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
                  aria-label="Edit title"
                >
                  <Pencil className="size-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}