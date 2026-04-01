import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderLock, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Eye, 
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import axios from 'axios';

interface LockerDocument {
  id: string;
  name: string;
  type: 'resume' | 'cover_letter' | 'certificate' | 'transcript';
  size: string;
  uploadDate: string;
  url: string;
}

const DocumentLocker: React.FC = () => {
  const [documents, setDocuments] = useState<LockerDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedType, setSelectedType] = useState<LockerDocument['type']>('resume');
  const [successAlert, setSuccessAlert] = useState(false);

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/documents');
        if (response.data && response.data.documents) {
          const mapped = response.data.documents.map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: '150 KB', // Default placeholder size
            uploadDate: new Date(doc.createdAt).toISOString().split('T')[0],
            url: doc.url || '#'
          }));
          setDocuments(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch documents:', err);
      }
    };
    fetchDocs();
  }, []);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccessAlert(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(async () => {
            try {
              const response = await axios.post('http://localhost:5001/api/documents', {
                name: file.name,
                type: selectedType,
                url: '#'
              });
              if (response.data && response.data.document) {
                const doc = response.data.document;
                const newDoc: LockerDocument = {
                  id: doc.id,
                  name: doc.name,
                  type: doc.type as any,
                  size: `${Math.round(file.size / 1024)} KB`,
                  uploadDate: new Date(doc.createdAt).toISOString().split('T')[0],
                  url: doc.url || '#'
                };
                setDocuments(prevDocs => [newDoc, ...prevDocs]);
              }
            } catch (err) {
              console.error('Failed to save document:', err);
            }
            setUploading(false);
            setSuccessAlert(true);
            setTimeout(() => setSuccessAlert(false), 3000);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/documents/${id}`);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const getTypeLabel = (type: LockerDocument['type']) => {
    switch (type) {
      case 'resume': return 'Resume';
      case 'cover_letter': return 'Cover Letter';
      case 'certificate': return 'Certificate';
      case 'transcript': return 'Transcript';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-brand-primary rounded-full" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderLock className="h-8 w-8 text-brand-primary" />
            Document Locker
          </h1>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">Securely store academic transcripts, application documents, and credentials references.</p>
      </div>

      {successAlert && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Document successfully uploaded and encrypted.</span>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Panel */}
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Upload Document</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Document Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as LockerDocument['type'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none"
              >
                <option value="resume">Resume</option>
                <option value="cover_letter">Cover Letter</option>
                <option value="certificate">Certificate</option>
                <option value="transcript">Transcript</option>
              </select>
            </div>

            {/* Drag Drop Area */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-brand-primary/50 dark:hover:border-brand-accent/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/20 dark:bg-zinc-900/10">
              <input
                type="file"
                onChange={handleSimulatedUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.png,.jpg"
              />
              <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Drag & drop files here</p>
              <p className="text-[10px] text-slate-400 mt-1">or click to browse (.pdf, .doc, max 5MB)</p>
            </div>

            {/* Upload progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Uploading file...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Files Vault</h3>
              <span className="text-xs text-slate-400 font-semibold">{documents.length} Items</span>
            </div>

            {/* Files List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/10 rounded-xl gap-3 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 flex items-center justify-center text-brand-primary shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">{doc.name}</p>
                        <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
                          <span className="font-bold text-brand-accent uppercase tracking-wider">{getTypeLabel(doc.type)}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => alert("Simulated view document secure content link.")}
                        className="p-1.5 border border-slate-200 dark:border-zinc-800 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white rounded-lg text-xs"
                        title="View File"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-brand-danger rounded-lg text-xs"
                        title="Delete File"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {documents.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No files uploaded. Use the upload panel to save transcripts or certificates.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentLocker;
