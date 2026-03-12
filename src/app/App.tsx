import { SlideCard } from './components/SlideCard';
import { SlideViewer } from './components/SlideViewer';
import { PDFUploader } from './components/PDFUploader';
import { useState, useEffect } from 'react';
import slide1Image from 'figma:asset/7c7624895ce832c65c336ff7e62398219f9b4bc7.png';
import { Upload, Pencil, Check, Share2, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

interface Project {
  id: number;
  title: string;
  description: string;
  slides: string[];
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showUploader, setShowUploader] = useState(false);
  const [editingProject, setEditingProject] = useState<number | null>(null);

  const [siteTitle, setSiteTitle] = useState('My Figma Slides');
  const [siteDescription, setSiteDescription] = useState('A showcase of my design work');
  const [isEditingSiteTitle, setIsEditingSiteTitle] = useState(false);
  const [isEditingSiteDescription, setIsEditingSiteDescription] = useState(false);
  const [tempSiteTitle, setTempSiteTitle] = useState('');
  const [tempSiteDescription, setTempSiteDescription] = useState('');

  const [portfolioId, setPortfolioId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'Driving Quality at Scale',
      description: 'THG/UX Presentation',
      slides: [
        slide1Image,
      ]
    },
    {
      id: 2,
      title: 'Project 2',
      description: 'Your second project presentation',
      slides: [
        'https://images.unsplash.com/photo-1629494893504-d41e26a02631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBtb2NrdXAlMjBzY3JlZW58ZW58MXx8fHwxNzczMjA2NjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ]
    },
    {
      id: 3,
      title: 'Project 3',
      description: 'Your third project presentation',
      slides: [
        'https://images.unsplash.com/photo-1559028012-481c04fa702d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwaW50ZXJmYWNlJTIwZGVzaWdufGVufDF8fHx8MTc3MzE5NzMzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ]
    },
    {
      id: 4,
      title: 'Project 4',
      description: 'Your fourth project presentation',
      slides: [
        'https://images.unsplash.com/photo-1569766670290-f5581d3bb53f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcG9ydGZvbGlvJTIwbGF5b3V0fGVufDF8fHx8MTc3MzI5ODYyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ]
    }
  ]);

  // Add console log immediately when component mounts
  console.log('App component mounting...');
  console.log('Current URL:', window.location.href);
  console.log('Search params:', window.location.search);

  // Load from localStorage on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Check if we're viewing a shared portfolio from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sharedPortfolioId = urlParams.get('id');

        console.log('Shared portfolio ID from URL:', sharedPortfolioId);

        if (sharedPortfolioId) {
          // We're in view mode - load from server
          console.log('Entering view mode, loading from server...');
          setIsViewMode(true);
          setIsLoading(true);
          await loadPortfolioFromServer(sharedPortfolioId);
        } else {
          // We're in edit mode - load from localStorage
          console.log('Entering edit mode, loading from localStorage...');
          const savedProjects = localStorage.getItem('figmaSlides_projects');
          const savedSiteTitle = localStorage.getItem('figmaSlides_siteTitle');
          const savedSiteDescription = localStorage.getItem('figmaSlides_siteDescription');
          const savedPortfolioId = localStorage.getItem('figmaSlides_portfolioId');

          if (savedProjects) {
            try {
              const parsed = JSON.parse(savedProjects);
              console.log('Loaded projects from localStorage:', parsed);
              setProjects(parsed);
            } catch (e) {
              console.error('Failed to load projects from localStorage', e);
            }
          }

          if (savedSiteTitle) {
            setSiteTitle(savedSiteTitle);
          }

          if (savedSiteDescription) {
            setSiteDescription(savedSiteDescription);
          }

          if (savedPortfolioId) {
            setPortfolioId(savedPortfolioId);
          } else {
            // Generate a new portfolio ID
            const newId = 'portfolio-' + Math.random().toString(36).substring(2, 15);
            console.log('Generated new portfolio ID:', newId);
            setPortfolioId(newId);
            localStorage.setItem('figmaSlides_portfolioId', newId);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        setLoadError(error.message || 'Failed to initialize app');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    // Save all projects including data URLs
    try {
      localStorage.setItem('figmaSlides_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      // If storage fails due to quota (large PDFs), user will need to re-upload after refresh
      // But they can always publish to save permanently
    }
  }, [projects]);

  // Save site title to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('figmaSlides_siteTitle', siteTitle);
  }, [siteTitle]);

  // Save site description to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('figmaSlides_siteDescription', siteDescription);
  }, [siteDescription]);

  const handleProjectClick = (projectId: number) => {
    setSelectedProject(projectId);
    setCurrentSlideIndex(0);
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    const currentProject = projects.find(p => p.id === selectedProject);
    if (currentProject && currentSlideIndex < currentProject.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleClose = () => {
    setSelectedProject(null);
    setCurrentSlideIndex(0);
  };

  const handleUploadClick = (projectId: number) => {
    setEditingProject(projectId);
    setShowUploader(true);
  };

  const handlePDFLoad = (pages: string[]) => {
    console.log('handlePDFLoad called with pages:', pages.length, 'editingProject:', editingProject);
    if (editingProject !== null) {
      setProjects(prevProjects => {
        const updatedProjects = prevProjects.map(project =>
          project.id === editingProject
            ? { ...project, slides: pages }
            : project
        );
        console.log('Updated projects state:', updatedProjects);
        return updatedProjects;
      });
      // Don't auto-close the modal - let user close it manually to see the update
      alert(`PDF uploaded! ${pages.length} slides added to project ${editingProject}`);
    } else {
      console.error('editingProject is null! Cannot update slides.');
    }
  };

  const handleRemovePDF = (projectId: number) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, slides: [] }
          : project
      )
    );
  };

  const handleTitleChange = (projectId: number, newTitle: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, title: newTitle }
          : project
      )
    );
  };

  const handleDescriptionChange = (projectId: number, newDescription: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, description: newDescription }
          : project
      )
    );
  };

  const currentProject = selectedProject !== null ? projects.find(p => p.id === selectedProject) : null;

  const handleSiteTitleSave = () => {
    if (tempSiteTitle.trim()) {
      setSiteTitle(tempSiteTitle);
    }
    setIsEditingSiteTitle(false);
  };

  const handleSiteTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSiteTitleSave();
    } else if (e.key === 'Escape') {
      setTempSiteTitle(siteTitle);
      setIsEditingSiteTitle(false);
    }
  };

  const handleSiteDescriptionSave = () => {
    if (tempSiteDescription.trim()) {
      setSiteDescription(tempSiteDescription);
    }
    setIsEditingSiteDescription(false);
  };

  const handleSiteDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSiteDescriptionSave();
    } else if (e.key === 'Escape') {
      setTempSiteDescription(siteDescription);
      setIsEditingSiteDescription(false);
    }
  };

  const loadPortfolioFromServer = async (id: string) => {
    setIsLoading(true);
    try {
      console.log('Loading portfolio from server with ID:', id);
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-44157e71/projects/load/${id}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error('Failed to load portfolio');
      }

      const data = await response.json();
      console.log('Loaded data from server:', data);
      
      setProjects(data.projects);
      setSiteTitle(data.siteTitle);
      setSiteDescription(data.siteDescription);
      setPortfolioId(id);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      alert('Failed to load portfolio. Please check the URL and try again.');
      // Show default content instead of blank page
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      console.log('Publishing portfolio...');
      console.log('Portfolio ID:', portfolioId);
      console.log('Projects:', projects);
      console.log('Site Title:', siteTitle);
      console.log('Site Description:', siteDescription);
      
      const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-44157e71/projects/save`;
      console.log('Publishing to URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          portfolioId,
          projects,
          siteTitle,
          siteDescription,
        }),
      });

      console.log('Publish response status:', response.status);
      const responseText = await response.text();
      console.log('Publish response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to save portfolio: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Publish response data:', data);
      
      // Save portfolio ID to localStorage
      localStorage.setItem('figmaSlides_portfolioId', portfolioId);
      
      // Generate share URL
      const shareLink = `${window.location.origin}${window.location.pathname}?id=${portfolioId}`;
      console.log('Generated share URL:', shareLink);
      setShareUrl(shareLink);
      setShowShareModal(true);
      
      alert('Portfolio published successfully!');
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      alert(`Failed to publish portfolio: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const copyShareUrl = () => {
    // Use fallback method directly since Clipboard API is blocked in this environment
    fallbackCopyToClipboard();
  };

  const fallbackCopyToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = shareUrl;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Link copied to clipboard!');
      } else {
        alert('Unable to copy automatically. Please copy the link manually.');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('Unable to copy automatically. Please copy the link manually.');
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {loadError ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Failed to Load Portfolio</h2>
            <p className="mb-4 text-gray-600">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading portfolio...</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl">
          {/* Header with Publish Button - only show in edit mode */}
          {!isViewMode && (
            <div className="mb-8 flex items-center justify-between">
              <div className="flex-1"></div>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Share2 className="size-5" />
                    Publish & Share
                  </>
                )}
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-12 text-center">
            {isEditingSiteTitle ? (
              <div className="mb-4 flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={tempSiteTitle}
                  onChange={(e) => setTempSiteTitle(e.target.value)}
                  onKeyDown={handleSiteTitleKeyDown}
                  onBlur={handleSiteTitleSave}
                  autoFocus
                  className="rounded border-2 border-blue-400 px-3 py-2 text-4xl font-bold text-gray-900 focus:outline-none sm:text-5xl"
                />
                <button
                  onClick={handleSiteTitleSave}
                  className="rounded p-2 text-green-600 hover:bg-green-50"
                  aria-label="Save site title"
                >
                  <Check className="size-5" />
                </button>
              </div>
            ) : (
              <div className="group mb-4 flex items-center justify-center gap-3">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                  {siteTitle}
                </h1>
                <button
                  onClick={() => {
                    setTempSiteTitle(siteTitle);
                    setIsEditingSiteTitle(true);
                  }}
                  className="rounded p-2 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
                  aria-label="Edit site title"
                >
                  <Pencil className="size-5" />
                </button>
              </div>
            )}
            
            {isEditingSiteDescription ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={tempSiteDescription}
                  onChange={(e) => setTempSiteDescription(e.target.value)}
                  onKeyDown={handleSiteDescriptionKeyDown}
                  onBlur={handleSiteDescriptionSave}
                  autoFocus
                  className="rounded border-2 border-blue-400 px-3 py-1 text-lg text-gray-600 focus:outline-none"
                />
                <button
                  onClick={handleSiteDescriptionSave}
                  className="rounded p-1 text-green-600 hover:bg-green-50"
                  aria-label="Save site description"
                >
                  <Check className="size-4" />
                </button>
              </div>
            ) : (
              <div className="group flex items-center justify-center gap-2">
                <p className="text-lg text-gray-600">
                  {siteDescription}
                </p>
                <button
                  onClick={() => {
                    setTempSiteDescription(siteDescription);
                    setIsEditingSiteDescription(true);
                  }}
                  className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100"
                  aria-label="Edit site description"
                >
                  <Pencil className="size-4" />
                </button>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {projects.map((project) => (
              <div key={project.id} className="space-y-4">
                <SlideCard
                  title={project.title}
                  imageUrl={project.slides[0] || 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1080'}
                  onClick={() => project.slides.length > 0 && handleProjectClick(project.id)}
                  onTitleChange={(newTitle) => handleTitleChange(project.id, newTitle)}
                />
                <div className="px-2">
                  {project.slides.length === 0 ? (
                    <button
                      onClick={() => handleUploadClick(project.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Upload className="size-5" />
                      <span>Upload PDF</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUploadClick(project.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-700 transition-all hover:bg-blue-100"
                      >
                        <Upload className="size-4" />
                        Replace PDF
                      </button>
                      <button
                        onClick={() => handleRemovePDF(project.id)}
                        className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 transition-all hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Upload Modal */}
      {showUploader && editingProject !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Upload PDF for {projects.find(p => p.id === editingProject)?.title}
            </h2>
            <PDFUploader onPDFLoad={handlePDFLoad} />
            <button
              onClick={() => {
                setShowUploader(false);
                setEditingProject(null);
              }}
              className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Slide Viewer Modal */}
      {currentProject && currentProject.slides.length > 0 && (
        <SlideViewer
          isOpen={selectedProject !== null}
          onClose={handleClose}
          projectTitle={currentProject.title}
          slides={currentProject.slides}
          currentSlideIndex={currentSlideIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3">
                <Share2 className="size-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Portfolio Published!
              </h2>
            </div>
            
            <p className="mb-4 text-gray-600">
              Your portfolio is now live. Share this link with anyone:
            </p>
            
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700"
              />
              <button
                onClick={copyShareUrl}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Copy
              </button>
            </div>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50"
            >
              <ExternalLink className="size-4" />
              Open in new tab
            </a>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}