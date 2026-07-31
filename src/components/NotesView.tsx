import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

interface NotesViewProps {
  theme?: string;
  userName?: string;
}

interface NotebookPage {
  id: string;
  pageNumber: number;
  template: 'Plain' | 'Cornell' | 'Mindmapping' | 'Outline' | 'Boxing' | 'Charting' | 'Sentence' | 'Slides' | 'Brain Dump' | 'Bullet';
  content: string;
  backgroundStyle: 'plain' | 'ruled' | 'grid';
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  cornellCue?: string;
  cornellSummary?: string;
  boxes?: { id: string; title: string; text: string }[];
  chartData?: { headers: string[]; rows: string[][] };
}

interface NotebookItem {
  id: string;
  title: string;
  createdAt: string;
  author: string;
  pages: NotebookPage[];
}

const MOTIVATIONAL_QUOTES = [
  { text: "The palest ink is better than the best memory.", author: "Chinese Proverb" },
  { text: "We write to taste life twice, in the moment and in retrospect.", author: "Anaïs Nin" },
  { text: "Note-taking is thinking on paper.", author: "Richard Feynman" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "Clear writing is a sign of clear thinking.", author: "William Zinsser" }
];

const PEN_COLORS = [
  { name: 'Classic Black', hex: '#1E293B' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Teal Blue', hex: '#567C8D' },
  { name: 'Deep Purple', hex: '#7C3AED' },
  { name: 'Warm Brown', hex: '#78350F' }
];

const FONT_FAMILIES = [
  { label: 'Clean Sans', value: 'font-sans' },
  { label: 'Academic Serif', value: 'font-serif' },
  { label: 'Personal Script', value: 'font-caveat, cursive' },
  { label: 'Code Monospace', value: 'font-mono' }
];

const TEMPLATES: Array<{
  id: NotebookPage['template'];
  name: string;
  description: string;
  icon: string;
}> = [
  { id: 'Plain', name: 'Plain', description: 'Blank unruled page for free typing', icon: '📝' },
  { id: 'Cornell', name: 'Cornell', description: 'Cue column (left), notes area (right), summary strip', icon: '📑' },
  { id: 'Mindmapping', name: 'Mindmapping', description: 'Open canvas with draggable nodes and connectors', icon: '🧠' },
  { id: 'Outline', name: 'Outline', description: 'Auto-indenting bullet and numbering hierarchy', icon: '📋' },
  { id: 'Boxing', name: 'Boxing', description: 'Page auto-divides into bordered boxes/sections', icon: '📦' },
  { id: 'Charting', name: 'Charting', description: 'Auto-generates a table/grid with editable rows', icon: '📊' },
  { id: 'Sentence', name: 'Sentence', description: 'Auto-numbered sequential list format', icon: '🔢' },
  { id: 'Slides', name: 'Slides/Split', description: 'Two columns: left keywords, right detailed notes', icon: '🌓' },
  { id: 'Brain Dump', name: 'Brain Dump', description: 'Unrestricted free-write canvas without structure', icon: '💭' },
  { id: 'Bullet', name: 'Bullet', description: 'Structured bullet points with sub-indentation', icon: '🔹' }
];

export default function NotesView({ theme, userName = 'Deepika S' }: NotesViewProps) {
  const [currentQuote] = useState(() => {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[idx];
  });

  const [notebooks, setNotebooks] = useState<NotebookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNotebook, setActiveNotebook] = useState<NotebookItem | null>(null);

  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [newAuthor, setNewAuthor] = useState(userName);

  const [selectedFont, setSelectedFont] = useState('font-sans');
  const [selectedSize, setSelectedSize] = useState('16px');
  const [selectedColor, setSelectedColor] = useState('#1E293B');

  useEffect(() => {
    fetch('/api/notebooks')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.notebooks)) {
          setNotebooks(data.notebooks);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const saveNotebookToBackend = (updatedNotebook: NotebookItem) => {
    setNotebooks(prev => prev.map(n => n.id === updatedNotebook.id ? updatedNotebook : n));
    fetch(`/api/notebooks/${updatedNotebook.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedNotebook)
    }).catch(() => {});
  };

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNb: NotebookItem = {
      id: `nb_${Date.now()}`,
      title: newTitle.trim(),
      createdAt: newDate.trim() || new Date().toLocaleDateString(),
      author: newAuthor.trim() || userName,
      pages: [
        {
          id: `page_${Date.now()}_1`,
          pageNumber: 1,
          template: 'Plain',
          content: '',
          backgroundStyle: 'plain',
          fontFamily: 'font-sans',
          fontSize: '16px',
          fontColor: '#1E293B'
        }
      ]
    };

    setNotebooks(prev => [newNb, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setActiveNotebook(newNb);
    setCurrentPageIdx(0);

    fetch('/api/notebooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNb)
    }).catch(() => {});
  };

  const handleDeleteNotebook = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this notebook?')) {
      setNotebooks(prev => prev.filter(n => n.id !== id));
      if (activeNotebook?.id === id) {
        setActiveNotebook(null);
      }
      fetch(`/api/notebooks/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handlePageTurn = (direction: 'next' | 'prev') => {
    if (!activeNotebook) return;
    const maxPage = activeNotebook.pages.length;
    if (direction === 'next' && currentPageIdx >= maxPage) return;
    if (direction === 'prev' && currentPageIdx <= 0) return;

    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      if (direction === 'next') {
        setCurrentPageIdx(prev => Math.min(prev + 1, maxPage));
      } else {
        setCurrentPageIdx(prev => Math.max(prev - 1, 0));
      }
      setIsFlipping(false);
    }, 280);
  };

  const handleAddPage = () => {
    if (!activeNotebook) return;
    const newPageNum = activeNotebook.pages.length + 1;
    const newPage: NotebookPage = {
      id: `page_${Date.now()}_${newPageNum}`,
      pageNumber: newPageNum,
      template: 'Plain',
      content: '',
      backgroundStyle: 'plain',
      fontFamily: selectedFont,
      fontSize: selectedSize,
      fontColor: selectedColor
    };

    const updated: NotebookItem = {
      ...activeNotebook,
      pages: [...activeNotebook.pages, newPage]
    };

    setActiveNotebook(updated);
    saveNotebookToBackend(updated);
    setCurrentPageIdx(updated.pages.length);
  };

  const updateCurrentPage = (partial: Partial<NotebookPage>) => {
    if (!activeNotebook || currentPageIdx === 0) return;
    const pageIndex = currentPageIdx - 1;
    const existingPages = [...activeNotebook.pages];
    existingPages[pageIndex] = {
      ...existingPages[pageIndex],
      ...partial
    };

    const updated: NotebookItem = {
      ...activeNotebook,
      pages: existingPages
    };

    setActiveNotebook(updated);
    saveNotebookToBackend(updated);
  };

  const activePage: NotebookPage | null = activeNotebook && currentPageIdx > 0
    ? activeNotebook.pages[currentPageIdx - 1]
    : null;

  const renderSpiralBinding = (isCover = false) => (
    <div className={`absolute left-0 top-0 bottom-0 ${isCover ? 'w-8' : 'w-10'} flex flex-col justify-between py-6 px-1.5 z-20 pointer-events-none select-none`}>
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="w-full h-3.5 bg-gradient-to-r from-[#0f172a] via-[#334155] to-[#0f172a] rounded-full shadow-md border border-gray-700/80 transform -rotate-6"
        />
      ))}
    </div>
  );

  if (!activeNotebook) {
    return (
      <div className="space-y-8 max-w-[1520px] mx-auto pb-16 font-sans select-none animate-fade-in text-gray-800">
        <div className="bg-[#FAF9F6] border border-gray-200/80 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#2F4156] bg-[#C8D9E6]/30 px-3 py-1 rounded-full">
              Taskaroa Digital Library
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#2F4156] tracking-tight font-display">
              Notes
            </h1>
            <p className="text-gray-600 italic font-serif text-base md:text-lg">
              "{currentQuote.text}"
              <span className="text-xs font-sans not-italic text-gray-400 block mt-1 font-semibold">
                — {currentQuote.author}
              </span>
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="py-3.5 px-6 bg-[#2F4156] hover:bg-[#567C8D] text-white font-extrabold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 text-sm cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            + New Notes
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-black text-[#2F4156] tracking-tight">
              Your Notebooks ({notebooks.length})
            </h2>
            <span className="text-xs font-bold text-gray-400">
              Spiral-bound notebooks • Persistent method templates
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : notebooks.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-700">No notebooks created yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click "+ New Notes" above to create your first spiral-bound digital notebook.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="py-2.5 px-5 bg-[#2F4156] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#567C8D] transition-all cursor-pointer"
              >
                + New Notes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {notebooks.map(nb => (
                <motion.div
                  key={nb.id}
                  whileHover={{ y: -6, rotate: 0.5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setActiveNotebook(nb);
                    setCurrentPageIdx(0);
                  }}
                  className="group relative bg-[#FFFFFF] rounded-r-3xl rounded-l-xl border border-gray-300/80 shadow-lg hover:shadow-2xl transition-all cursor-pointer h-80 flex flex-col justify-between overflow-hidden p-8 pl-14"
                >
                  {renderSpiralBinding(true)}

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
                        SPIRAL NOTEBOOK
                      </span>
                      <button
                        onClick={(e) => handleDeleteNotebook(nb.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete Notebook"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-black text-[#2F4156] tracking-tight leading-snug line-clamp-3 font-display">
                      {nb.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-gray-100/80 space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-gray-700">{nb.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{nb.createdAt}</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#567C8D] pt-1">
                      {nb.pages.length} {nb.pages.length === 1 ? 'Page' : 'Pages'} • Open Notebook →
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 p-8 relative"
              >
                {renderSpiralBinding(true)}

                <div className="pl-6 space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2F4156]">
                      NEW DIGITAL NOTEBOOK
                    </span>
                    <h3 className="text-2xl font-black text-[#2F4156]">
                      Create Notebook Cover Page
                    </h3>
                    <p className="text-xs text-gray-500">
                      This information is permanently printed on your notebook cover for quick identification.
                    </p>
                  </div>

                  <form onSubmit={handleCreateNotebook} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Notebook Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anatomy 150 – Ch. 10"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAF9F6] border border-gray-300 rounded-xl font-bold text-gray-800 text-base focus:outline-none focus:border-[#2F4156] focus:ring-2 focus:ring-[#2F4156]/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          Date Printed
                        </label>
                        <input
                          type="text"
                          value={newDate}
                          onChange={e => setNewDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-gray-300 rounded-xl font-medium text-xs text-gray-800 focus:outline-none focus:border-[#2F4156]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={newAuthor}
                          onChange={e => setNewAuthor(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-gray-300 rounded-xl font-medium text-xs text-gray-800 focus:outline-none focus:border-[#2F4156]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#2F4156] hover:bg-[#567C8D] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Create Notebook
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isCoverPage = currentPageIdx === 0;
  const totalPages = activeNotebook.pages.length;

  return (
    <div className="space-y-4 max-w-[1640px] mx-auto pb-20 font-sans animate-fade-in text-gray-800">
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveNotebook(null)}
            className="flex items-center gap-2 text-xs font-extrabold text-[#2F4156] hover:text-[#567C8D] bg-[#F5EFEB] hover:bg-[#C8D9E6]/30 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
            Back to All Notebooks
          </button>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          <div>
            <h2 className="text-base font-black text-[#2F4156] tracking-tight">
              {activeNotebook.title}
            </h2>
            <p className="text-[11px] text-gray-400 font-semibold">
              {activeNotebook.author} • Created {activeNotebook.createdAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePageTurn('prev')}
            disabled={currentPageIdx === 0 || isFlipping}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-extrabold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl min-w-[110px] text-center">
            {isCoverPage ? 'Cover Page' : `Page ${currentPageIdx} of ${totalPages}`}
          </span>

          <button
            onClick={() => handlePageTurn('next')}
            disabled={currentPageIdx === totalPages || isFlipping}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleAddPage}
            className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-[#2F4156] hover:bg-[#567C8D] text-white text-xs font-extrabold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            + Add Page
          </button>
        </div>
      </div>

      {!isCoverPage && activePage && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mr-1">
              METHOD:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {TEMPLATES.map(t => {
                const isSelected = activePage.template === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => updateCurrentPage({ template: t.id })}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2F4156] text-white shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                    title={t.description}
                  >
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-gray-100">
            <select
              value={selectedFont}
              onChange={e => {
                setSelectedFont(e.target.value);
                updateCurrentPage({ fontFamily: e.target.value });
              }}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              {FONT_FAMILIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={e => {
                setSelectedSize(e.target.value);
                updateCurrentPage({ fontSize: e.target.value });
              }}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              {['14px', '16px', '18px', '20px', '24px'].map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
              {PEN_COLORS.map(color => (
                <button
                  key={color.hex}
                  onClick={() => {
                    setSelectedColor(color.hex);
                    updateCurrentPage({ fontColor: color.hex });
                  }}
                  style={{ backgroundColor: color.hex }}
                  className={`w-4 h-4 rounded-full border border-gray-300 transition-transform cursor-pointer ${
                    selectedColor === color.hex ? 'scale-125 ring-2 ring-offset-1 ring-[#567C8D]' : 'opacity-80'
                  }`}
                  title={`Pen color: ${color.name}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
              {(['plain', 'ruled', 'grid'] as const).map(bg => (
                <button
                  key={bg}
                  onClick={() => updateCurrentPage({ backgroundStyle: bg })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                    activePage.backgroundStyle === bg
                      ? 'bg-white text-[#2F4156] shadow-xs border border-gray-200'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full min-h-[640px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeNotebook.id}_page_${currentPageIdx}`}
            initial={{
              rotateY: flipDirection === 'next' ? -8 : 8,
              opacity: 0.85,
              scale: 0.99
            }}
            animate={{
              rotateY: 0,
              opacity: 1,
              scale: 1
            }}
            exit={{
              rotateY: flipDirection === 'next' ? 8 : -8,
              opacity: 0.85,
              scale: 0.99
            }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="relative bg-[#FAF9F6] rounded-r-[36px] rounded-l-xl border-2 border-gray-300 shadow-2xl min-h-[660px] pl-16 pr-10 py-10 overflow-hidden"
            style={{
              backgroundImage: !isCoverPage && activePage
                ? activePage.backgroundStyle === 'ruled'
                  ? 'linear-gradient(#e2e8f0 1px, transparent 1px)'
                  : activePage.backgroundStyle === 'grid'
                  ? 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)'
                  : 'none'
                : 'none',
              backgroundSize: !isCoverPage && activePage
                ? activePage.backgroundStyle === 'ruled'
                  ? '100% 32px'
                  : '24px 24px'
                : 'auto'
            }}
          >
            {renderSpiralBinding(false)}

            {isCoverPage ? (
              <div className="h-full flex flex-col justify-between min-h-[580px] max-w-2xl mx-auto py-8">
                <div className="text-center space-y-4 pt-12">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#2F4156] bg-[#F5EFEB] px-4 py-1.5 rounded-full inline-block">
                    TASKAROA DIGITAL NOTEBOOK
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-black text-[#2F4156] tracking-tight font-display py-6 border-y-2 border-gray-300">
                    {activeNotebook.title}
                  </h1>
                </div>

                <div className="bg-white/80 border border-gray-300 rounded-3xl p-8 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Author Name</span>
                    <span className="text-base font-extrabold text-[#2F4156]">{activeNotebook.author}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Date Created</span>
                    <span className="text-base font-extrabold text-[#2F4156]">{activeNotebook.createdAt}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Notebook Pages</span>
                    <span className="text-base font-extrabold text-[#567C8D]">{activeNotebook.pages.length} Pages</span>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => handlePageTurn('next')}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#2F4156] hover:bg-[#567C8D] text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm uppercase tracking-wider"
                  >
                    Open First Writing Page <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              activePage && (
                <div className={`space-y-6 ${activePage.fontFamily}`} style={{ fontSize: activePage.fontSize, color: activePage.fontColor }}>
                  <div className="flex justify-between items-center pb-4 border-b-2 border-gray-300/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-[#2F4156] bg-white px-3 py-1 rounded-lg border border-gray-200">
                        {TEMPLATES.find(t => t.id === activePage.template)?.name || activePage.template} Method
                      </span>
                      <span className="text-xs text-gray-400 font-bold">
                        • {activeNotebook.title}
                      </span>
                    </div>

                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      Page {activePage.pageNumber}
                    </span>
                  </div>

                  {(activePage.template === 'Plain' || activePage.template === 'Brain Dump') && (
                    <textarea
                      value={activePage.content.replace(/<[^>]+>/g, '')}
                      onChange={e => updateCurrentPage({ content: e.target.value })}
                      placeholder={
                        activePage.template === 'Plain'
                          ? "Start writing your notes freely on this unruled page..."
                          : "Brain dump! Write down thoughts, tasks, and raw ideas without restrictions..."
                      }
                      className="w-full min-h-[480px] bg-transparent outline-none resize-none leading-relaxed text-gray-800 placeholder-gray-400"
                    />
                  )}

                  {activePage.template === 'Cornell' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[380px]">
                        <div className="md:col-span-4 border-r-2 border-[#567C8D]/40 pr-4 space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-[#2F4156] block">
                            Cue / Keywords Column
                          </label>
                          <textarea
                            value={activePage.cornellCue || ''}
                            onChange={e => updateCurrentPage({ cornellCue: e.target.value })}
                            placeholder="Key terms, questions, dates, prompts..."
                            className="w-full h-80 bg-transparent outline-none resize-none text-sm font-bold text-gray-800 placeholder-gray-400"
                          />
                        </div>

                        <div className="md:col-span-8 space-y-2">
                          <label className="text-xs font-black uppercase tracking-wider text-[#2F4156] block">
                            Detailed Notes Area
                          </label>
                          <textarea
                            value={activePage.content.replace(/<[^>]+>/g, '')}
                            onChange={e => updateCurrentPage({ content: e.target.value })}
                            placeholder="Take detailed notes during lecture or reading..."
                            className="w-full h-80 bg-transparent outline-none resize-none leading-relaxed text-gray-800 placeholder-gray-400"
                          />
                        </div>
                      </div>

                      <div className="border-t-2 border-[#567C8D]/40 pt-4 space-y-1">
                        <label className="text-xs font-black uppercase tracking-wider text-[#2F4156] block">
                          Summary Strip
                        </label>
                        <textarea
                          value={activePage.cornellSummary || ''}
                          onChange={e => updateCurrentPage({ cornellSummary: e.target.value })}
                          placeholder="Summarize the main takeaways of this page in 2-3 concise sentences..."
                          className="w-full h-20 bg-transparent outline-none resize-none text-sm font-medium text-gray-700 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  )}

                  {(activePage.template === 'Outline' || activePage.template === 'Sentence' || activePage.template === 'Bullet') && (
                    <div className="space-y-4">
                      <div className="p-3 bg-white/60 rounded-xl border border-gray-200 text-xs text-gray-600 font-bold">
                        {activePage.template === 'Outline' && "📋 Auto-indented hierarchical structure (I. A. 1. a.)"}
                        {activePage.template === 'Sentence' && "🔢 Sequential numbered sentence format for step-by-step clarity"}
                        {activePage.template === 'Bullet' && "🔹 Clean bullet points with sub-bullet organization"}
                      </div>
                      <textarea
                        value={activePage.content.replace(/<[^>]+>/g, '')}
                        onChange={e => updateCurrentPage({ content: e.target.value })}
                        placeholder={
                          activePage.template === 'Outline'
                            ? "I. First Main Topic\n    A. Subtopic 1\n        1. Detail point\nII. Second Main Topic"
                            : activePage.template === 'Sentence'
                            ? "1. First observation or statement.\n2. Second sequentially numbered finding.\n3. Third conclusion."
                            : "• Primary bullet point\n    - Secondary indented bullet\n• Next main bullet point"
                        }
                        className="w-full min-h-[440px] bg-transparent outline-none resize-none leading-loose text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  )}

                  {activePage.template === 'Boxing' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-[#2F4156]">
                          📦 Categorized Boxing Layout
                        </span>
                        <button
                          onClick={() => {
                            const newBox = { id: `box_${Date.now()}`, title: 'New Box Category', text: '' };
                            updateCurrentPage({ boxes: [...(activePage.boxes || []), newBox] });
                          }}
                          className="px-3 py-1.5 bg-[#2F4156] text-white text-xs font-extrabold rounded-xl hover:bg-[#567C8D] cursor-pointer"
                        >
                          + Add Box Section
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(activePage.boxes || [
                          { id: 'b1', title: 'Key Definitions', text: '' },
                          { id: 'b2', title: 'Important Formulas', text: '' },
                          { id: 'b3', title: 'Exam Tips', text: '' },
                          { id: 'b4', title: 'Questions to Ask', text: '' }
                        ]).map((box, idx) => (
                          <div
                            key={box.id}
                            className="bg-white/80 p-4 rounded-2xl border-2 border-gray-300 shadow-xs space-y-2"
                          >
                            <input
                              type="text"
                              value={box.title}
                              onChange={e => {
                                const list = [...(activePage.boxes || [
                                  { id: 'b1', title: 'Key Definitions', text: '' },
                                  { id: 'b2', title: 'Important Formulas', text: '' },
                                  { id: 'b3', title: 'Exam Tips', text: '' },
                                  { id: 'b4', title: 'Questions to Ask', text: '' }
                                ])];
                                list[idx].title = e.target.value;
                                updateCurrentPage({ boxes: list });
                              }}
                              className="font-extrabold text-sm text-[#2F4156] bg-transparent outline-none w-full"
                            />
                            <textarea
                              value={box.text}
                              onChange={e => {
                                const list = [...(activePage.boxes || [
                                  { id: 'b1', title: 'Key Definitions', text: '' },
                                  { id: 'b2', title: 'Important Formulas', text: '' },
                                  { id: 'b3', title: 'Exam Tips', text: '' },
                                  { id: 'b4', title: 'Questions to Ask', text: '' }
                                ])];
                                list[idx].text = e.target.value;
                                updateCurrentPage({ boxes: list });
                              }}
                              placeholder="Type box contents here..."
                              className="w-full h-28 bg-transparent outline-none resize-none text-xs text-gray-700"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activePage.template === 'Charting' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-[#2F4156]">
                          📊 Structured Charting Table
                        </span>
                        <button
                          onClick={() => {
                            const currentData = activePage.chartData || {
                              headers: ['Topic', 'Definition / Detail', 'Importance / Notes'],
                              rows: [['Alveoli', 'Primary pulmonary gas exchange unit', 'High exam priority']]
                            };
                            updateCurrentPage({
                              chartData: {
                                ...currentData,
                                rows: [...currentData.rows, ['', '', '']]
                              }
                            });
                          }}
                          className="px-3 py-1.5 bg-[#2F4156] text-white text-xs font-extrabold rounded-xl hover:bg-[#567C8D] cursor-pointer"
                        >
                          + Add Row
                        </button>
                      </div>

                      <div className="overflow-x-auto bg-white/80 rounded-2xl border-2 border-gray-300 shadow-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-[#F5EFEB] border-b-2 border-gray-300">
                              {(activePage.chartData?.headers || ['Topic', 'Definition / Detail', 'Importance / Notes']).map((h, i) => (
                                <th key={i} className="p-3 text-xs font-black text-[#2F4156]">
                                  <input
                                    type="text"
                                    value={h}
                                    onChange={e => {
                                      const currentData = activePage.chartData || {
                                        headers: ['Topic', 'Definition / Detail', 'Importance / Notes'],
                                        rows: [['Alveoli', 'Primary pulmonary gas exchange unit', 'High exam priority']]
                                      };
                                      const newHeaders = [...currentData.headers];
                                      newHeaders[i] = e.target.value;
                                      updateCurrentPage({ chartData: { ...currentData, headers: newHeaders } });
                                    }}
                                    className="bg-transparent font-black w-full outline-none"
                                  />
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(activePage.chartData?.rows || [['Alveoli', 'Primary pulmonary gas exchange unit', 'High exam priority']]).map((row, rowIdx) => (
                              <tr key={rowIdx} className="border-b border-gray-200">
                                {row.map((cell, colIdx) => (
                                  <td key={colIdx} className="p-3 text-xs">
                                    <input
                                      type="text"
                                      value={cell}
                                      onChange={e => {
                                        const currentData = activePage.chartData || {
                                          headers: ['Topic', 'Definition / Detail', 'Importance / Notes'],
                                          rows: [['Alveoli', 'Primary pulmonary gas exchange unit', 'High exam priority']]
                                        };
                                        const newRows = [...currentData.rows];
                                        newRows[rowIdx] = [...newRows[rowIdx]];
                                        newRows[rowIdx][colIdx] = e.target.value;
                                        updateCurrentPage({ chartData: { ...currentData, rows: newRows } });
                                      }}
                                      placeholder="Type cell value..."
                                      className="bg-transparent w-full outline-none font-medium"
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {(activePage.template === 'Mindmapping' || activePage.template === 'Slides') && (
                    <div className="space-y-4">
                      <div className="p-4 bg-white/60 rounded-2xl border border-gray-200 text-xs text-gray-600 font-bold">
                        {activePage.template === 'Mindmapping'
                          ? "🧠 Mindmap & Flow Layout — Use bullet points or arrows (->) below to map visual relationships and branches."
                          : "🌓 Slides / Split Page — Left column for presentation slides/keywords, right column for detailed speaker notes."}
                      </div>
                      <textarea
                        value={activePage.content.replace(/<[^>]+>/g, '')}
                        onChange={e => updateCurrentPage({ content: e.target.value })}
                        placeholder={
                          activePage.template === 'Mindmapping'
                            ? "[Central Concept: Respiration]\n   ---> Branch 1: Upper Tract (Nasal Cavity, Pharynx)\n   ---> Branch 2: Lower Tract (Trachea, Alveoli)\n        ---> Sub-node: Surfactant reduces surface tension"
                            : "SLIDE 1 / KEYWORDS:          | DETAILED NOTES:\nAlveoli & Gas Exchange         | Discuss partial pressure gradient across alveolar membrane...\n\nSLIDE 2 / KEYWORDS:          | DETAILED NOTES:\nSurfactant Properties          | Explain collapse prevention..."
                        }
                        className="w-full min-h-[440px] bg-transparent outline-none resize-none leading-relaxed text-gray-800 placeholder-gray-400 font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
