// src/components/modals/ViewAttachmentModal.jsx - ENHANCED UI VERSION
import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaDownload, 
  FaEye, 
  FaSpinner,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileImage,
  FaFileArchive,
  FaFileAudio,
  FaFileVideo,
  FaFileCode,
  FaFileAlt,
  FaExternalLinkAlt,
  FaPrint,
  FaExpand,
  FaCompress,
  FaMinus,
  FaPlus,
  FaRedo,
  FaInfoCircle,
  FaFile
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ViewAttachmentModal = ({ isOpen, onClose, attachment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get file extension
  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // Get file icon based on extension
  const getFileIcon = (filename, size = '6xl') => {
    const ext = getFileExtension(filename);
    const className = `text-${size}`;
    switch (ext) {
      case 'pdf': return <FaFilePdf className={`text-red-500 ${className}`} />;
      case 'doc': case 'docx': return <FaFileWord className={`text-blue-500 ${className}`} />;
      case 'xls': case 'xlsx': return <FaFileExcel className={`text-green-500 ${className}`} />;
      case 'ppt': case 'pptx': return <FaFilePowerpoint className={`text-orange-500 ${className}`} />;
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'svg': case 'webp':
        return <FaFileImage className={`text-purple-500 ${className}`} />;
      case 'zip': case 'rar': case '7z': return <FaFileArchive className={`text-yellow-500 ${className}`} />;
      case 'mp3': case 'wav': case 'aac': return <FaFileAudio className={`text-pink-500 ${className}`} />;
      case 'mp4': case 'avi': case 'mov': case 'mkv': return <FaFileVideo className={`text-indigo-500 ${className}`} />;
      case 'js': case 'css': case 'html': case 'json': case 'xml': case 'txt': case 'md':
        return <FaFileCode className={`text-gray-500 ${className}`} />;
      default: return <FaFileAlt className={`text-gray-400 ${className}`} />;
    }
  };

  // Get file size display
  const getFileSize = (size) => {
    if (!size) return 'Unknown size';
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Get file type display
  const getFileType = (filename) => {
    const ext = getFileExtension(filename);
    switch (ext) {
      case 'pdf': return 'PDF Document';
      case 'doc': return 'Word Document (Old)';
      case 'docx': return 'Word Document';
      case 'xls': return 'Excel Spreadsheet (Old)';
      case 'xlsx': return 'Excel Spreadsheet';
      case 'ppt': return 'PowerPoint Presentation (Old)';
      case 'pptx': return 'PowerPoint Presentation';
      case 'jpg': case 'jpeg': return 'JPEG Image';
      case 'png': return 'PNG Image';
      case 'gif': return 'GIF Image';
      case 'svg': return 'SVG Image';
      case 'webp': return 'WebP Image';
      case 'zip': return 'ZIP Archive';
      case 'rar': return 'RAR Archive';
      case '7z': return '7-Zip Archive';
      case 'mp3': return 'MP3 Audio';
      case 'wav': return 'WAV Audio';
      case 'mp4': return 'MP4 Video';
      case 'avi': return 'AVI Video';
      case 'mov': return 'QuickTime Video';
      case 'mkv': return 'Matroska Video';
      case 'txt': return 'Text File';
      case 'json': return 'JSON File';
      case 'xml': return 'XML File';
      case 'html': return 'HTML File';
      case 'css': return 'CSS File';
      case 'js': return 'JavaScript File';
      case 'md': return 'Markdown File';
      default: return ext ? ext.toUpperCase() + ' File' : 'File';
    }
  };

  // Check file types
  const isPreviewableImage = (filename) => {
    const ext = getFileExtension(filename);
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
  };

  const isPDF = (filename) => getFileExtension(filename) === 'pdf';
  
  const isTextFile = (filename) => {
    const ext = getFileExtension(filename);
    return ['txt', 'json', 'xml', 'html', 'css', 'js', 'md', 'csv'].includes(ext);
  };
  
  const isVideo = (filename) => {
    const ext = getFileExtension(filename);
    return ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'].includes(ext);
  };
  
  const isAudio = (filename) => {
    const ext = getFileExtension(filename);
    return ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma'].includes(ext);
  };
  
  const isOfficeDocument = (filename) => {
    const ext = getFileExtension(filename);
    return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
  };

  // Get the attachment URL
  const getAttachmentUrl = () => {
    if (!attachment) return null;
    
    const url = attachment.fileUrl || attachment.url || attachment.path || 
                attachment.downloadUrl || attachment.filePath || '';
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (url.startsWith('data:')) {
      return url;
    }
    
    const fileName = attachment.fileName || attachment.name || '';
    
    if (fileName) {
      const cleanFileName = fileName.split('/').pop();
      return `http://localhost:5000/uploads/${cleanFileName}`;
    }
    
    if (url) {
      const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
      return `http://localhost:5000/${cleanUrl}`;
    }
    
    return null;
  };

  const attachmentUrl = getAttachmentUrl();

  // Handle download
  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!attachmentUrl && !attachment.fileName) {
      toast.error('File URL not available');
      return;
    }

    try {
      setIsLoading(true);
      
      let downloadUrl = attachmentUrl;
      
      if (!downloadUrl || downloadUrl.startsWith('/')) {
        const fileName = attachment.fileName || attachment.name || 'file';
        const cleanFileName = fileName.split('/').pop();
        downloadUrl = `http://localhost:5000/uploads/${cleanFileName}`;
      }
      
      console.log('📥 Downloading from:', downloadUrl);
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream, */*',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName || attachment.name || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle open in new tab
  const handleOpenInNewTab = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (attachmentUrl) {
      if (attachmentUrl.startsWith('data:')) {
        const fetchDataUrl = async () => {
          try {
            const response = await fetch(attachmentUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } catch (error) {
            console.error('Error opening data URL:', error);
            toast.error('Failed to open file');
          }
        };
        fetchDataUrl();
      } else {
        window.open(attachmentUrl, '_blank');
      }
    } else {
      toast.error('File URL not available');
    }
  };

  // Handle print
  const handlePrint = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPDF(attachment.fileName) && attachmentUrl) {
      const printWindow = window.open(attachmentUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
      return;
    }
    
    const printContent = document.getElementById('attachment-content');
    if (printContent) {
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>${attachment.fileName || 'Document'}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .content { max-width: 800px; margin: 0 auto; }
                img { max-width: 100%; }
                pre { white-space: pre-wrap; word-wrap: break-word; }
              </style>
            </head>
            <body>
              <div class="content">
                <h2>${attachment.fileName || 'Document'}</h2>
                <hr/>
                ${printContent.innerHTML}
              </div>
            </body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  // Handle image error
  const handleImageError = (e) => {
    setPreviewError(true);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Zoom controls
  const zoomIn = () => setPdfZoom(Math.min(200, pdfZoom + 10));
  const zoomOut = () => setPdfZoom(Math.max(50, pdfZoom - 10));
  const resetZoom = () => setPdfZoom(100);

  // Load file content for text files
  useEffect(() => {
    const loadTextFile = async () => {
      if (!isOpen || !attachmentUrl || !isTextFile(attachment?.fileName)) {
        return;
      }
      
      try {
        const response = await fetch(attachmentUrl);
        if (response.ok) {
          const text = await response.text();
          setFileContent(text);
        } else {
          setFileContent('Unable to load file content');
        }
      } catch (error) {
        setFileContent('Error loading file content');
      }
    };
    
    loadTextFile();
  }, [isOpen, attachmentUrl, attachment?.fileName]);

  if (!isOpen || !attachment) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-[200] bg-[#1B262C]/80 backdrop-blur-sm transition-all duration-300 ${isFullscreen ? 'bg-[#1B262C]/95' : ''}`} 
        onClick={onClose} 
      />
      <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${isFullscreen ? 'p-0' : ''}`}>
        <div className={`bg-white rounded-3xl shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20 flex flex-col ${isFullscreen ? 'w-full h-full rounded-none max-w-none' : 'max-w-5xl w-full max-h-[92vh]'}`}>
          
          {/* Header - Enhanced */}
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-4 rounded-t-3xl flex-shrink-0">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                  {getFileIcon(attachment.fileName, 'xl')}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-white truncate">{attachment.fileName || 'File Preview'}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-2">
                    <span>{getFileType(attachment.fileName)}</span>
                    <span>•</span>
                    <span>{getFileSize(attachment.fileSize)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaFile className="text-[10px]" />
                      {getFileExtension(attachment.fileName).toUpperCase() || 'FILE'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {attachmentUrl && (
                  <>
                    {/* ✅ Zoom controls for PDF */}
                    {isPDF(attachment.fileName) && (
                      <>
                        <button onClick={zoomOut} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Zoom Out" type="button">
                          <FaMinus className="text-lg" />
                        </button>
                        <span className="text-white/80 text-xs font-medium min-w-[40px] text-center">{pdfZoom}%</span>
                        <button onClick={zoomIn} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Zoom In" type="button">
                          <FaPlus className="text-lg" />
                        </button>
                        <button onClick={resetZoom} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Reset Zoom" type="button">
                          <FaRedo className="text-lg" />
                        </button>
                        <div className="w-px h-8 bg-white/20 mx-1"></div>
                      </>
                    )}
                    <button onClick={handleDownload} disabled={isLoading} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Download" type="button">
                      {isLoading ? <FaSpinner className="animate-spin text-sm" /> : <FaDownload className="text-lg" />}
                    </button>
                    <button onClick={handlePrint} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Print" type="button">
                      <FaPrint className="text-lg" />
                    </button>
                    <button onClick={handleOpenInNewTab} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Open in new tab" type="button">
                      <FaExternalLinkAlt className="text-lg" />
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Fullscreen" type="button">
                      {isFullscreen ? <FaCompress className="text-lg" /> : <FaExpand className="text-lg" />}
                    </button>
                    <div className="w-px h-8 bg-white/20 mx-1"></div>
                    <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Close" type="button">
                      <FaTimes className="text-xl" />
                    </button>
                  </>
                )}
                {!attachmentUrl && (
                  <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Close" type="button">
                    <FaTimes className="text-xl" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content - Enhanced */}
          <div className={`p-6 overflow-y-auto flex-1 ${isFullscreen ? 'max-h-none' : 'max-h-[calc(92vh-80px)]'}`}>
            <div className={`bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30 min-h-[350px] flex items-center justify-center ${isFullscreen ? 'min-h-[70vh]' : ''}`} id="attachment-content">
              {attachmentUrl ? (
                <>
                  {/* Image Preview */}
                  {isPreviewableImage(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 w-full">
                      {!previewError ? (
                        <img 
                          src={attachmentUrl} 
                          alt={attachment.fileName} 
                          className={`max-w-full object-contain rounded-lg shadow-md ${isFullscreen ? 'max-h-[70vh]' : 'max-h-[550px]'}`}
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 py-8">
                          <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                          <p className="text-[#6B7280]">Unable to preview image</p>
                          <button onClick={handleDownload} className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2" type="button">
                            <FaDownload className="text-xs" /> Download
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PDF Preview - Enhanced with zoom */}
                  {isPDF(attachment.fileName) && (
                    <div className={`w-full flex flex-col ${isFullscreen ? 'h-[70vh]' : 'h-[600px]'}`}>
                      <div className="flex-1 rounded-lg border border-[#BBE1FA]/30 overflow-hidden bg-[#F0F4F8]">
                        <iframe 
                          src={`${attachmentUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`} 
                          className="w-full h-full" 
                          title="PDF Preview"
                          style={{ border: 'none', transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top left' }}
                          onLoad={() => setIsLoading(false)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 px-2">
                        <span className="text-xs text-[#6B7280]">📄 PDF Document</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#6B7280]">{pdfZoom}% zoom</span>
                          <span className="text-xs text-[#6B7280]">Page 1 of 1</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text File Preview */}
                  {isTextFile(attachment.fileName) && (
                    <div className="w-full">
                      <div className="bg-white rounded-lg border border-[#BBE1FA]/30 p-4 max-h-[550px] overflow-auto">
                        <pre className="text-sm text-[#1B262C] whitespace-pre-wrap font-mono">
                          {fileContent || 'Loading file content...'}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Video Preview */}
                  {isVideo(attachment.fileName) && (
                    <video 
                      controls 
                      className={`w-full rounded-lg border border-[#BBE1FA]/30 ${isFullscreen ? 'max-h-[70vh]' : 'max-h-[550px]'}`} 
                      src={attachmentUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Audio Preview */}
                  {isAudio(attachment.fileName) && (
                    <audio controls className="w-full rounded-lg" src={attachmentUrl}>
                      Your browser does not support the audio tag.
                    </audio>
                  )}

                  {/* Office Documents */}
                  {isOfficeDocument(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                      <h4 className="text-lg font-semibold text-[#1B262C]">{attachment.fileName}</h4>
                      <p className="text-[#6B7280] text-center max-w-md">{getFileType(attachment.fileName)} - {getFileSize(attachment.fileSize)}</p>
                      <p className="text-sm text-[#9CA3AF] text-center">Office documents can be viewed by downloading the file.</p>
                      <button onClick={handleDownload} className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2" type="button">
                        <FaDownload className="text-xs" /> Download
                      </button>
                    </div>
                  )}

                  {/* Unknown File Type */}
                  {!isPreviewableImage(attachment.fileName) && 
                   !isPDF(attachment.fileName) && 
                   !isTextFile(attachment.fileName) && 
                   !isVideo(attachment.fileName) && 
                   !isAudio(attachment.fileName) && 
                   !isOfficeDocument(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                      <h4 className="text-lg font-semibold text-[#1B262C]">{attachment.fileName}</h4>
                      <p className="text-[#6B7280] text-center">{getFileType(attachment.fileName)} - {getFileSize(attachment.fileSize)}</p>
                      <p className="text-sm text-[#9CA3AF] text-center">Preview not available for this file type.</p>
                      <button onClick={handleDownload} className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2" type="button">
                        <FaDownload className="text-xs" /> Download
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                  <p className="text-[#6B7280] text-sm">File URL not available</p>
                  <p className="text-xs text-[#9CA3AF]">The file may not be uploaded or the path is invalid</p>
                </div>
              )}
            </div>

            {/* File Info - Enhanced */}
            <div className="mt-4 bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-[#BBE1FA]/20">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold flex items-center gap-1">
                    <FaFileAlt className="text-[#3282B8] text-xs" /> File Name
                  </p>
                  <p className="text-sm font-medium text-[#1B262C] break-all mt-1">{attachment.fileName || 'N/A'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-[#BBE1FA]/20">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold flex items-center gap-1">
                    <FaFilePdf className="text-red-500 text-xs" /> File Type
                  </p>
                  <p className="text-sm font-medium text-[#1B262C] mt-1">{getFileType(attachment.fileName)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-[#BBE1FA]/20">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold flex items-center gap-1">
                    <FaDownload className="text-[#0F4C75] text-xs" /> File Size
                  </p>
                  <p className="text-sm font-medium text-[#1B262C] mt-1">{getFileSize(attachment.fileSize)}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-[#BBE1FA]/20">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold flex items-center gap-1">
                    <FaFileCode className="text-[#F59E0B] text-xs" /> Extension
                  </p>
                  <p className="text-sm font-medium text-[#1B262C] uppercase mt-1">{getFileExtension(attachment.fileName) || 'N/A'}</p>
                </div>
              </div>
              {attachment.description && (
                <div className="mt-3 pt-3 border-t border-[#BBE1FA]/30">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold flex items-center gap-1">
                    <FaInfoCircle className="text-[#3282B8] text-xs" /> Description
                  </p>
                  <p className="text-sm text-[#1B262C] mt-1 bg-white rounded-lg p-2 border border-[#BBE1FA]/20">{attachment.description}</p>
                </div>
              )}
            </div>

            {/* Actions - Enhanced */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#BBE1FA]/30">
              {attachmentUrl && (
                <>
                  <button onClick={handleDownload} disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" type="button">
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin text-xs" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FaDownload className="text-xs" />
                        Download
                      </>
                    )}
                  </button>
                  <button onClick={handleOpenInNewTab} className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2" type="button">
                    <FaExternalLinkAlt className="text-xs" />
                    Open in New Tab
                  </button>
                </>
              )}
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200" type="button">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAttachmentModal;