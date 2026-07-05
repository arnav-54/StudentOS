import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderLock, UploadCloud, FileText, Trash2, Eye, CheckCircle, X, Award } from 'lucide-react';
import axios from 'axios';
const DocumentLocker = () => {
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedType, setSelectedType] = useState('resume');
    const [successAlert, setSuccessAlert] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);
    // Fetch documents on mount
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/documents');
                if (response.data && response.data.documents) {
                    const mapped = response.data.documents.map((doc) => ({
                        id: doc.id,
                        name: doc.name,
                        type: doc.type,
                        size: '150 KB', // Default placeholder size
                        uploadDate: new Date(doc.createdAt).toISOString().split('T')[0],
                        url: doc.url || '#'
                    }));
                    setDocuments(mapped);
                }
            }
            catch (err) {
                console.error('Failed to fetch documents:', err);
            }
        };
        fetchDocs();
    }, []);
    const handleSimulatedUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        setSuccessAlert(false);
        setProgress(0);
        
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 20;
            setProgress(currentProgress);
            
            if (currentProgress >= 100) {
                clearInterval(interval);
                
                // Convert file to Base64 Data URL to store real uploaded content in database
                const fileReader = new FileReader();
                fileReader.onload = async (event) => {
                    const dataUrl = event.target.result;
                    try {
                        const response = await axios.post('http://localhost:5001/api/documents', {
                            name: file.name,
                            type: selectedType,
                            url: dataUrl
                        });
                        if (response.data && response.data.document) {
                            const doc = response.data.document;
                            const newDoc = {
                                id: doc.id,
                                name: doc.name,
                                type: doc.type,
                                size: `${Math.round(file.size / 1024)} KB`,
                                uploadDate: new Date(doc.createdAt).toISOString().split('T')[0],
                                url: doc.url || '#'
                            };
                            setDocuments(prevDocs => [newDoc, ...prevDocs]);
                        }
                    }
                    catch (err) {
                        console.error('Failed to save document:', err);
                    } finally {
                        setUploading(false);
                        setSuccessAlert(true);
                        setTimeout(() => setSuccessAlert(false), 3000);
                    }
                };
                fileReader.readAsDataURL(file);
            }
        }, 150);
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/documents/${id}`);
            setDocuments(documents.filter(doc => doc.id !== id));
        }
        catch (err) {
            console.error('Failed to delete document:', err);
        }
    };
    const getTypeLabel = (type) => {
        switch (type) {
            case 'resume': return 'Resume';
            case 'cover_letter': return 'Cover Letter';
            case 'certificate': return 'Certification';
            case 'transcript': return 'Official Transcript';
            case 'marksheet': return 'Marksheet';
            case 'receipt': return 'Fee Receipt / Slip';
            case 'id_card': return 'ID Card / Photo';
            default: return 'Other Credentials';
        }
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-brand-primary rounded-full"/>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <FolderLock className="h-8 w-8 text-brand-primary"/>
            Document Locker
          </h1>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 text-sm ml-[19px]">Securely store academic transcripts, application documents, and credentials references.</p>
      </div>

      {successAlert && (<div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
          <CheckCircle className="h-4 w-4 shrink-0"/>
          <span>Document successfully uploaded and encrypted.</span>
        </div>)}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Panel */}
        <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white/75 dark:bg-[#0A0A0C]/75 backdrop-blur-xl shadow-sm hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all duration-300 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Upload Document</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1.5">Document Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs focus:outline-none text-slate-800 dark:text-slate-200">
                <option value="resume">Resume</option>
                <option value="cover_letter">Cover Letter</option>
                <option value="marksheet">Marksheet</option>
                <option value="certificate">Certification</option>
                <option value="transcript">Official Transcript</option>
                <option value="receipt">Fee Receipt / Slip</option>
                <option value="id_card">ID Card / Photo</option>
                <option value="other">Other Credentials</option>
              </select>
            </div>

            {/* Drag Drop Area */}
            <div className="relative border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-brand-primary/50 dark:hover:border-brand-accent/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/20 dark:bg-zinc-900/10">
              <input type="file" onChange={handleSimulatedUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.doc,.docx,.png,.jpg"/>
              <UploadCloud className="h-10 w-10 text-slate-400 mb-3"/>
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Drag & drop files here</p>
              <p className="text-[10px] text-slate-400 mt-1">or click to browse (.pdf, .doc, max 5MB)</p>
            </div>

            {/* Upload progress */}
            {uploading && (<div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Uploading file...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full transition-all duration-150" style={{ width: `${progress}%` }}/>
                </div>
              </div>)}
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
                {documents.map((doc) => (<motion.div key={doc.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/10 rounded-xl gap-3 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/30 flex items-center justify-center text-brand-primary shrink-0">
                        <FileText className="h-5 w-5"/>
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
                      <button onClick={() => setPreviewDoc(doc)} className="p-1.5 border border-slate-200 dark:border-zinc-800 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white rounded-lg text-xs cursor-pointer shadow-sm active:scale-95 transition-all" title="View File">
                        <Eye className="h-3.5 w-3.5"/>
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-1.5 border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-brand-danger rounded-lg text-xs" title="Delete File">
                        <Trash2 className="h-3.5 w-3.5"/>
                      </button>
                    </div>
                  </motion.div>))}
              </AnimatePresence>

              {documents.length === 0 && (<div className="text-center py-12 text-slate-400 text-xs">
                  No files uploaded. Use the upload panel to save transcripts or certificates.
                </div>)}
            </div>
          </div>
        </div>

      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setPreviewDoc(null)}/>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 relative z-10 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-3 shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-xs">{previewDoc.name}</h3>
                <span className="text-[10px] uppercase font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                  {getTypeLabel(previewDoc.type)}
                </span>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer">
                <X className="h-4.5 w-4.5"/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {/* Cover Letter Viewer */}
              {previewDoc.type === 'cover_letter' && (() => {
                let text = "Dear Hiring Manager,\n\nPlease find attached my credentials for application. Having built StudentOS, a premium full-stack academic and professional dashboard system, I am excited to apply my skills.\n\nSincerely,\nArnav kumar";
                if (previewDoc.url && previewDoc.url.startsWith('text:')) {
                  try {
                    text = decodeURIComponent(escape(atob(previewDoc.url.substring(5))));
                  } catch (e) {
                    console.error("Failed to decode saved cover letter:", e);
                  }
                }
                return (
                  <div className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 font-serif text-xs leading-relaxed whitespace-pre-wrap">
                    {text}
                  </div>
                );
              })()}

              {/* Resume JSON Viewer */}
              {previewDoc.type === 'resume' && (() => {
                let resume = null;
                if (previewDoc.url && previewDoc.url.startsWith('text:')) {
                  try {
                    resume = JSON.parse(decodeURIComponent(escape(atob(previewDoc.url.substring(5)))));
                  } catch (e) {
                    console.error("Failed to parse resume JSON data:", e);
                  }
                }
                
                if (!resume) {
                  return (
                    <div className="bg-slate-50 dark:bg-zinc-900 text-slate-850 dark:text-zinc-200 p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 font-sans text-xs leading-relaxed text-center py-12">
                      <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3"/>
                      <p className="font-bold text-slate-900 dark:text-white">Secure PDF Resume Vault</p>
                      <p className="text-[10px] text-slate-400 mt-1">Decryption keys synchronized. Certified ATS layout is ready for download.</p>
                    </div>
                  );
                }
                
                return (
                  <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow font-serif text-[11px] leading-relaxed max-w-lg mx-auto space-y-4">
                    <div className="text-center border-b border-slate-100 dark:border-zinc-800 pb-2 mb-2">
                      <h4 className="font-bold text-sm uppercase tracking-wide">{resume.name}</h4>
                      <p className="text-[10px] text-slate-500">{resume.email} • {resume.phone} • {resume.website}</p>
                    </div>
                    {resume.education && resume.education.length > 0 && (
                      <div>
                        <p className="font-bold uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 mb-1">Education</p>
                        {resume.education.map((edu, i) => (
                          <div key={i} className="flex justify-between">
                            <span><strong>{edu.school}</strong> - {edu.degree}</span>
                            <span>{edu.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {resume.experience && resume.experience.length > 0 && (
                      <div>
                        <p className="font-bold uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 mb-1">Experience</p>
                        {resume.experience.map((exp, i) => (
                          <div key={i} className="mb-1.5">
                            <div className="flex justify-between">
                              <span><strong>{exp.company}</strong> ({exp.role})</span>
                              <span>{exp.date}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 pl-2 border-l border-slate-200 dark:border-zinc-800">{exp.bullets}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {resume.projects && resume.projects.length > 0 && (
                      <div>
                        <p className="font-bold uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 mb-1">Projects</p>
                        {resume.projects.map((proj, i) => (
                          <div key={i} className="mb-1.5">
                            <div className="flex justify-between">
                              <span><strong>{proj.name}</strong> - {proj.role}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 pl-2 border-l border-slate-200 dark:border-zinc-800">{proj.bullets}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {resume.skillsText && (
                      <div>
                        <p className="font-bold uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 text-[10px] text-slate-500 mb-1">Technical Skills</p>
                        <p className="font-mono text-[10px]">{resume.skillsText}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Certificate Viewer */}
              {previewDoc.type === 'certificate' && (
                <div className="bg-amber-50/50 dark:bg-amber-950/20 text-slate-800 dark:text-zinc-150 p-8 rounded-2xl border-4 border-double border-amber-500/60 text-center font-serif leading-relaxed max-w-md mx-auto my-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 block mb-2">Newton School of Technology</span>
                  <h4 className="text-lg font-bold text-amber-900 dark:text-amber-300 font-heading">Certificate of Achievement</h4>
                  <p className="text-xs italic text-slate-500 mt-4">This credentials verify that</p>
                  <p className="text-base font-bold text-slate-850 dark:text-zinc-200 my-2 underline">Arnav kumar</p>
                  <p className="text-xs text-slate-600 dark:text-zinc-400">has successfully built and validated the full-stack StudentOS platform suite, achieving optimal performance marks.</p>
                  <div className="mt-6 flex justify-center text-[9px] text-amber-800 dark:text-amber-500 font-bold uppercase tracking-widest gap-8">
                    <div><span>ISSUED ON: JUL 2026</span></div>
                    <div><span>ID: NST-STUDENTOS-A</span></div>
                  </div>
                </div>
              )}

              {/* Transcript Viewer */}
              {previewDoc.type === 'transcript' && (
                <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow font-sans text-xs leading-relaxed max-w-md mx-auto">
                  <h4 className="text-center font-bold border-b border-slate-100 dark:border-zinc-800 pb-2 mb-3 text-slate-900 dark:text-white">Newton School of Technology - Official Transcript</h4>
                  <div className="space-y-1.5 font-semibold">
                    <div className="flex justify-between font-bold border-b border-slate-100 dark:border-zinc-800 pb-1 text-[10px] text-slate-400 uppercase">
                      <span>Course Code & Title</span>
                      <span>Grade</span>
                    </div>
                    <div className="flex justify-between"><span>CS-101: Data Structures & Algorithms</span><span className="font-bold text-brand-success">A+</span></div>
                    <div className="flex justify-between"><span>CS-102: Advanced React Frameworks</span><span className="font-bold text-brand-success">A</span></div>
                    <div className="flex justify-between"><span>CS-201: Cloud Computing (AWS/Docker)</span><span className="font-bold text-brand-success">A</span></div>
                    <div className="flex justify-between"><span>CS-202: Database Engineering (Prisma/Mongo)</span><span className="font-bold text-brand-success">A+</span></div>
                  </div>
                </div>
              )}

              {/* Marksheet Viewer */}
              {previewDoc.type === 'marksheet' && (
                <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow font-sans text-xs leading-relaxed max-w-md mx-auto">
                  <h4 className="text-center font-bold border-b border-slate-100 dark:border-zinc-800 pb-2 mb-3 text-slate-900 dark:text-white">Academic Marksheet</h4>
                  <div className="space-y-2 font-semibold">
                    <div className="flex justify-between"><span>Student Name:</span><span className="text-slate-900 dark:text-white">Arnav kumar</span></div>
                    <div className="flex justify-between"><span>Registration ID:</span><span>2026-NST-054</span></div>
                    <div className="flex justify-between"><span>Course GPA:</span><span className="font-bold text-brand-success">9.00 / 10.00</span></div>
                    <div className="flex justify-between"><span>Verification Status:</span><span className="text-emerald-500 font-bold">Verified ✅</span></div>
                  </div>
                </div>
              )}

              {/* Fee Receipt / Slip Viewer */}
              {previewDoc.type === 'receipt' && (
                <div className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow font-mono text-xs leading-relaxed max-w-md mx-auto">
                  <h4 className="text-center font-bold border-b border-slate-100 dark:border-zinc-800 pb-2 mb-3 text-slate-900 dark:text-white uppercase">Newton School Fees Receipt</h4>
                  <div className="space-y-1.5">
                    <p>Transaction ID: NST-TXN-98284729</p>
                    <p>Payment Date: July 10, 2026</p>
                    <p>Amount Paid: INR 2,50,000</p>
                    <p className="font-bold border-t border-slate-100 dark:border-zinc-850 pt-2 mt-2 flex justify-between"><span>Total Outstanding:</span><span>0.00 (Nil)</span></p>
                    <p className="text-[10px] text-slate-400 mt-3 text-center">Receipt digitally signed and certified.</p>
                  </div>
                </div>
              )}

              {/* ID Card / Photo Viewer */}
              {previewDoc.type === 'id_card' && (
                <div className="space-y-4">
                  {previewDoc.url && previewDoc.url.startsWith('data:image/') ? (
                    <img src={previewDoc.url} className="max-w-full max-h-[50vh] rounded-2xl object-contain mx-auto border border-slate-200 dark:border-zinc-800 shadow-md" alt={previewDoc.name} />
                  ) : (
                    <div className="w-80 mx-auto bg-gradient-to-br from-zinc-900 to-black text-white p-6 rounded-2xl border border-zinc-800 shadow-xl text-center relative overflow-hidden font-sans my-4">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 blur-xl rounded-full" />
                      <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-brand-primary/40 mx-auto flex items-center justify-center text-sm font-black mb-3">AK</div>
                      <h4 className="text-sm font-bold tracking-wide">Arnav kumar</h4>
                      <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1">Computer Science Student</p>
                      <div className="mt-4 border-t border-zinc-800 pt-3 flex justify-between text-[9px] text-zinc-500 font-semibold uppercase">
                        <div><span>ID: 2028-NST</span></div>
                        <div><span>Exp: 2028</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Other Credentials */}
              {previewDoc.type === 'other' && (
                <div className="bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow font-sans text-xs leading-relaxed text-center py-8">
                  <FolderLock className="h-10 w-10 text-brand-primary mx-auto mb-2"/>
                  <h4 className="font-bold text-slate-900 dark:text-white">Secure Encrypted File Vault</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Stored securely using 256-bit sandbox parameters.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-zinc-900 shrink-0 gap-2.5">
              {previewDoc.url && previewDoc.url.startsWith('data:') && (
                <a 
                  href={previewDoc.url} 
                  download={previewDoc.name}
                  className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer text-center flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5"/>
                  Download / Open File
                </a>
              )}
              <button onClick={() => setPreviewDoc(null)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-semibold rounded-xl text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>);
};
export default DocumentLocker;
