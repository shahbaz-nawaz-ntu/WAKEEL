// src/utils/attachmentViewer.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
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
  FaTimes,
  FaDownload,
  FaEye,
  FaExternalLinkAlt,
  FaPrint,
  FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// ============================================
// ATTACHMENT VIEWER COMPONENT
// ============================================
const AttachmentViewer = ({ attachment, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  if (!attachment) return null;

  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename);
    switch (ext) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-5xl" />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-500 text-5xl" />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-green-500 text-5xl" />;
      case 'ppt':
      case 'pptx': return <FaFilePowerpoint className="text-orange-500 text-5xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp': return <FaFileImage className="text-purple-500 text-5xl" />;
      case 'zip':
      case 'rar':
      case '7z': return <FaFileArchive className="text-yellow-500 text-5xl" />;
      case 'mp3':
      case 'wav':
      case 'aac': return <FaFileAudio className="text-pink-500 text-5xl" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv': return <FaFileVideo className="text-indigo-500 text-5xl" />;
      case 'js':
      case 'css':
      case 'html':
      case 'json':
      case 'xml':
      case 'txt':
      case 'md': return <FaFileCode className="text-gray-500 text-5xl" />;
      default: return <FaFileAlt className="text-gray-400 text-5xl" />;
    }
  };

  const getFileSize = (size) => {
    if (!size) return 'Unknown size';
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

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
      case 'jpg':
      case 'jpeg': return 'JPEG Image';
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

  const isPreviewableImage = (filename) => {
    const ext = getFileExtension(filename);
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
  };

  const isPDF = (filename) => {
    return getFileExtension(filename) === 'pdf';
  };

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
    
    if (attachment.fileName) {
      if (attachment.fileName.startsWith('/uploads/') || attachment.fileName.startsWith('uploads/')) {
        return attachment.fileName.startsWith('/') ? attachment.fileName : `/${attachment.fileName}`;
      }
      return `/uploads/${attachment.fileName}`;
    }
    
    if (url) {
      return url.startsWith('/') ? url : `/${url}`;
    }
    
    return null;
  };

  const attachmentUrl = getAttachmentUrl();

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!attachmentUrl && !attachment.fileName) {
      toast.error('File URL not available');
      return;
    }

    try {
      setIsLoading(true);
      
      if (attachmentUrl && (attachmentUrl.startsWith('http://') || attachmentUrl.startsWith('https://'))) {
        if (isPDF(attachment.fileName)) {
          const response = await fetch(attachmentUrl);
          if (!response.ok) throw new Error('Failed to fetch file');
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = attachment.fileName || 'document.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          toast.success('Download started!');
        } else {
          window.open(attachmentUrl, '_blank');
        }
        setIsLoading(false);
        return;
      }

      if (attachmentUrl && attachmentUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = attachmentUrl;
        link.download = attachment.fileName || 'download.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started!');
        setIsLoading(false);
        return;
      }

      const response = await fetch(attachmentUrl || `/uploads/${attachment.fileName}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
                .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .file-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <div class="content">
                <div class="header">
                  <h2>${attachment.fileName || 'Document'}</h2>
                  <p><strong>Type:</strong> ${getFileType(attachment.fileName)}</p>
                  <p><strong>Size:</strong> ${getFileSize(attachment.fileSize)}</p>
                </div>
                <div class="file-info">
                  ${printContent.innerHTML}
                </div>
              </div>
            </body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  const handleImageError = (e) => {
    setPreviewError(true);
  };

  useEffect(() => {
    const loadTextFile = async () => {
      if (!attachmentUrl || !isTextFile(attachment?.fileName)) {
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
  }, [attachmentUrl, attachment?.fileName]);

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-[#1B262C]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-4 rounded-t-3xl flex-shrink-0">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaEye className="text-xl text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-white truncate">{attachment.fileName || 'File Preview'}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-2">
                    <span>{getFileType(attachment.fileName)}</span>
                    <span>•</span>
                    <span>{getFileSize(attachment.fileSize)}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                {attachmentUrl && (
                  <>
                    <button onClick={handleDownload} disabled={isLoading} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Download" type="button">
                      {isLoading ? <FaSpinner className="animate-spin text-sm" /> : <FaDownload className="text-lg" />}
                    </button>
                    <button onClick={handlePrint} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Print" type="button">
                      <FaPrint className="text-lg" />
                    </button>
                    <button onClick={handleOpenInNewTab} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" title="Open in new tab" type="button">
                      <FaExternalLinkAlt className="text-lg" />
                    </button>
                  </>
                )}
                <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" type="button">
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(92vh-80px)]">
            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30 min-h-[300px] flex items-center justify-center" id="attachment-content">
              {attachmentUrl ? (
                <>
                  {isPreviewableImage(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 w-full">
                      {!previewError ? (
                        <img src={attachmentUrl} alt={attachment.fileName} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md" onError={handleImageError} />
                      ) : (
                        <div className="flex flex-col items-center gap-4 py-8">
                          <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                          <p className="text-[#6B7280]">Unable to preview image</p>
                          <div className="flex gap-3">
                            <button onClick={handleDownload} className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2" type="button">
                              <FaDownload className="text-xs" /> Download
                            </button>
                            <button onClick={handleOpenInNewTab} className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2" type="button">
                              <FaExternalLinkAlt className="text-xs" /> Open in New Tab
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isPDF(attachment.fileName) && (
                    <div className="w-full h-[600px] flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">PDF Document Preview</span>
                        <div className="flex gap-2">
                          <button onClick={handleDownload} className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1" type="button">
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button onClick={handleOpenInNewTab} className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1" type="button">
                            <FaExternalLinkAlt className="text-xs" /> Open
                          </button>
                        </div>
                      </div>
                      <iframe src={attachmentUrl.startsWith('data:') ? attachmentUrl : `${attachmentUrl}#toolbar=1&navpanes=1`} className="w-full h-full rounded-lg border border-[#BBE1FA]/30" title="PDF Preview" />
                    </div>
                  )}

                  {isTextFile(attachment.fileName) && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">Text Document Preview</span>
                        <div className="flex gap-2">
                          <button onClick={handleDownload} className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1" type="button">
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button onClick={handleOpenInNewTab} className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1" type="button">
                            <FaExternalLinkAlt className="text-xs" /> Open
                          </button>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-[#BBE1FA]/30 p-4 max-h-[500px] overflow-auto">
                        <pre className="text-sm text-[#1B262C] whitespace-pre-wrap font-mono">
                          {fileContent || 'Loading file content...'}
                        </pre>
                      </div>
                    </div>
                  )}

                  {isVideo(attachment.fileName) && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">Video Preview</span>
                        <div className="flex gap-2">
                          <button onClick={handleDownload} className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1" type="button">
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button onClick={handleOpenInNewTab} className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1" type="button">
                            <FaExternalLinkAlt className="text-xs" /> Open
                          </button>
                        </div>
                      </div>
                      <video controls className="w-full rounded-lg border border-[#BBE1FA]/30 max-h-[500px]" src={attachmentUrl}>
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {isAudio(attachment.fileName) && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">Audio Preview</span>
                        <div className="flex gap-2">
                          <button onClick={handleDownload} className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1" type="button">
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button onClick={handleOpenInNewTab} className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1" type="button">
                            <FaExternalLinkAlt className="text-xs" /> Open
                          </button>
                        </div>
                      </div>
                      <audio controls className="w-full rounded-lg" src={attachmentUrl}>
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}

                  {isOfficeDocument(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                      <h4 className="text-lg font-semibold text-[#1B262C]">{attachment.fileName}</h4>
                      <p className="text-[#6B7280] text-center max-w-md">{getFileType(attachment.fileName)} - {getFileSize(attachment.fileSize)}</p>
                      <p className="text-sm text-[#9CA3AF] text-center">Office documents can be viewed by downloading the file.</p>
                      <div className="flex gap-3">
                        <button onClick={handleDownload} className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2" type="button">
                          <FaDownload className="text-xs" /> Download
                        </button>
                        <button onClick={handleOpenInNewTab} className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2" type="button">
                          <FaExternalLinkAlt className="text-xs" /> Open in New Tab
                        </button>
                      </div>
                    </div>
                  )}

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
                      <div className="flex gap-3">
                        <button onClick={handleDownload} className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2" type="button">
                          <FaDownload className="text-xs" /> Download
                        </button>
                        <button onClick={handleOpenInNewTab} className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2" type="button">
                          <FaExternalLinkAlt className="text-xs" /> Open in New Tab
                        </button>
                      </div>
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

            <div className="mt-4 bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">File Name</p>
                  <p className="text-sm font-medium text-[#1B262C] break-all">{attachment.fileName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">File Type</p>
                  <p className="text-sm font-medium text-[#1B262C]">{getFileType(attachment.fileName)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">File Size</p>
                  <p className="text-sm font-medium text-[#1B262C]">{getFileSize(attachment.fileSize)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Extension</p>
                  <p className="text-sm font-medium text-[#1B262C] uppercase">{getFileExtension(attachment.fileName) || 'N/A'}</p>
                </div>
              </div>
              {attachment.description && (
                <div className="mt-3 pt-3 border-t border-[#BBE1FA]/30">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Description</p>
                  <p className="text-sm text-[#1B262C]">{attachment.description}</p>
                </div>
              )}
            </div>

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

// ============================================
// VIEW ATTACHMENT FUNCTION
// ============================================
let attachmentViewerContainer = null;

/**
 * Open the attachment viewer
 * @param {Object} attachment - The attachment object
 * @param {string} attachment.fileName - The file name
 * @param {string} attachment.fileUrl - The file URL
 * @param {number} attachment.fileSize - The file size in bytes
 * @param {string} attachment.description - The file description
 */
export const viewAttachment = (attachment) => {
  if (!attachment) {
    toast.error('No attachment data found');
    return;
  }

  if (!attachmentViewerContainer) {
    attachmentViewerContainer = document.createElement('div');
    document.body.appendChild(attachmentViewerContainer);
  }

  const handleClose = () => {
    ReactDOM.unmountComponentAtNode(attachmentViewerContainer);
  };

  let formattedAttachment = attachment;
  if (typeof attachment === 'string') {
    formattedAttachment = {
      fileName: attachment,
      fileUrl: `/uploads/${attachment}`,
      fileSize: 0,
      description: ''
    };
  }

  ReactDOM.render(
    <AttachmentViewer attachment={formattedAttachment} onClose={handleClose} />,
    attachmentViewerContainer
  );
};

/**
 * Close the attachment viewer
 */
export const closeAttachmentViewer = () => {
  if (attachmentViewerContainer) {
    ReactDOM.unmountComponentAtNode(attachmentViewerContainer);
  }
};

// ============================================
// HOOK: useAttachmentViewer
// ============================================
export const useAttachmentViewer = () => {
  const [attachment, setAttachment] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openViewer = useCallback((file) => {
    if (!file) {
      toast.error('No attachment data found');
      return;
    }

    let formattedFile = file;
    if (typeof file === 'string') {
      formattedFile = {
        fileName: file,
        fileUrl: `/uploads/${file}`,
        fileSize: 0,
        description: ''
      };
    }

    setAttachment(formattedFile);
    setIsOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setAttachment(null);
  }, []);

  const ViewerComponent = useMemo(() => {
    if (!isOpen || !attachment) return null;
    return <AttachmentViewer attachment={attachment} onClose={closeViewer} />;
  }, [isOpen, attachment, closeViewer]);

  return {
    openViewer,
    closeViewer,
    ViewerComponent,
    isOpen,
    attachment
  };
};

// ============================================
// HELPERS
// ============================================
export const createAttachment = (fileName, fileUrl = null, fileSize = 0, description = '') => {
  return {
    fileName: fileName,
    fileUrl: fileUrl || `/uploads/${fileName}`,
    fileSize: fileSize,
    description: description
  };
};

export default {
  viewAttachment,
  closeAttachmentViewer,
  useAttachmentViewer,
  createAttachment,
  AttachmentViewer
};