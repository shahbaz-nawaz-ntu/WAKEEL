// src/components/modals/CaseDetailModal.jsx - COMPLETE FIXED VERSION
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  FaTimes, 
  FaUser, 
  FaGavel, 
  FaFileAlt,
  FaUserFriends,
  FaBuilding,
  FaClock,
  FaFilePdf,
  FaCalendarCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBookOpen,
  FaClipboardList,
  FaTag,
  FaFileInvoice,
  FaChevronDown,
  FaChevronRight,
  FaDownload,
  FaEye,
  FaUniversity,
  FaLandmark,
  FaFolderOpen,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaGavel as FaGavelIcon,
  FaMapMarkerAlt,
  FaUserCircle,
  FaIdCard,
  FaBriefcase,
  FaTrash,
  FaSync,
  FaArrowRight,
  FaSearch,
  FaCalendarAlt,
  FaCheck,
  FaQuestionCircle,
  FaComment,
  FaUsers,
  FaPlusCircle,
  FaSave,
  FaFile,
  FaHistory,
  FaBookmark,
  FaIdCard as FaIdCardIcon,
  FaSpinner,
  FaFileImage,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAudio,
  FaFileVideo,
  FaFileCode,
  FaExternalLinkAlt,
  FaPrint
} from 'react-icons/fa';
import { GiScales, GiJusticeStar } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { api } from '../../api/client';

// Helper function to display values
const displayValue = (value, fallback = 'N/A') => {
  if (value === undefined || value === null || value === '' || value === 'N/A') {
    return fallback;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) return fallback;
    const hasValue = Object.values(value).some(v => v && v !== '' && v !== 'N/A');
    if (!hasValue) return fallback;
    const nonEmptyValue = Object.values(value).find(v => v && v !== '' && v !== 'N/A');
    return nonEmptyValue || fallback;
  }
  return value;
};

// ============================================
// VIEW ATTACHMENT MODAL - COMPLETE FIXED VERSION
// ============================================
const ViewAttachmentModal = ({ isOpen, onClose, attachment }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const [fileBlobUrl, setFileBlobUrl] = useState(null);

  // Get file extension
  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // Get file icon based on extension
  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename);
    switch (ext) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-5xl" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500 text-5xl" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-500 text-5xl" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500 text-5xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp':
        return <FaFileImage className="text-purple-500 text-5xl" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FaFileArchive className="text-yellow-500 text-5xl" />;
      case 'mp3':
      case 'wav':
      case 'aac':
        return <FaFileAudio className="text-pink-500 text-5xl" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
        return <FaFileVideo className="text-indigo-500 text-5xl" />;
      case 'js':
      case 'css':
      case 'html':
      case 'json':
      case 'xml':
      case 'txt':
      case 'md':
        return <FaFileCode className="text-gray-500 text-5xl" />;
      default:
        return <FaFileAlt className="text-gray-400 text-5xl" />;
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

  // Check if file is an image that can be previewed
  const isPreviewableImage = (filename) => {
    const ext = getFileExtension(filename);
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext);
  };

  // Check if file is a PDF that can be previewed
  const isPDF = (filename) => {
    return getFileExtension(filename) === 'pdf';
  };

  // Check if file is a text file that can be previewed
  const isTextFile = (filename) => {
    const ext = getFileExtension(filename);
    return ['txt', 'json', 'xml', 'html', 'css', 'js', 'md', 'csv'].includes(ext);
  };

  // Check if file is a video
  const isVideo = (filename) => {
    const ext = getFileExtension(filename);
    return ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'].includes(ext);
  };

  // Check if file is an audio file
  const isAudio = (filename) => {
    const ext = getFileExtension(filename);
    return ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma'].includes(ext);
  };

  // Check if file is an office document
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

  // Handle image error
  const handleImageError = (e) => {
    setPreviewError(true);
  };

  // Load file content for text files - ALWAYS CALLED (hook order fixed)
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

  // Cleanup blob URLs - ALWAYS CALLED (hook order fixed)
  useEffect(() => {
    return () => {
      if (fileBlobUrl) {
        window.URL.revokeObjectURL(fileBlobUrl);
      }
    };
  }, [fileBlobUrl]);

  // Early return AFTER all hooks are called
  if (!isOpen || !attachment) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-[#1B262C]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          
          {/* Header */}
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
                    <button
                      onClick={handleDownload}
                      disabled={isLoading}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                      title="Download"
                      type="button"
                    >
                      {isLoading ? <FaSpinner className="animate-spin text-sm" /> : <FaDownload className="text-lg" />}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                      title="Print"
                      type="button"
                    >
                      <FaPrint className="text-lg" />
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                      title="Open in new tab"
                      type="button"
                    >
                      <FaExternalLinkAlt className="text-lg" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  type="button"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(92vh-80px)]">
            {/* File Preview */}
            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30 min-h-[300px] flex items-center justify-center" id="attachment-content">
              {attachmentUrl ? (
                <>
                  {/* Image Preview */}
                  {isPreviewableImage(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 w-full">
                      {!previewError ? (
                        <img 
                          src={attachmentUrl} 
                          alt={attachment.fileName}
                          className="max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 py-8">
                          <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                          <p className="text-[#6B7280]">Unable to preview image</p>
                          <div className="flex gap-3">
                            <button
                              onClick={handleDownload}
                              className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                              type="button"
                            >
                              <FaDownload className="text-xs" />
                              Download
                            </button>
                            <button
                              onClick={handleOpenInNewTab}
                              className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2"
                              type="button"
                            >
                              <FaExternalLinkAlt className="text-xs" />
                              Open in New Tab
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PDF Preview */}
                  {isPDF(attachment.fileName) && (
                    <div className="w-full h-[600px] flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">PDF Document Preview</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button
                            onClick={handleOpenInNewTab}
                            className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
                            <FaExternalLinkAlt className="text-xs" /> Open
                          </button>
                        </div>
                      </div>
                      <iframe
                        src={attachmentUrl.startsWith('data:') ? attachmentUrl : `${attachmentUrl}#toolbar=1&navpanes=1`}
                        className="w-full h-full rounded-lg border border-[#BBE1FA]/30"
                        title="PDF Preview"
                      />
                    </div>
                  )}

                  {/* Text File Preview */}
                  {isTextFile(attachment.fileName) && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">Text Document Preview</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button
                            onClick={handleOpenInNewTab}
                            className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
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

                  {/* Video Preview */}
                  {isVideo(attachment.fileName) && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">Video Preview</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button
                            onClick={handleOpenInNewTab}
                            className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
                            <FaExternalLinkAlt className="text-xs" /> Open
                          </button>
                        </div>
                      </div>
                      <video 
                        controls 
                        className="w-full rounded-lg border border-[#BBE1FA]/30 max-h-[500px]"
                        src={attachmentUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  {/* Audio Preview */}
                  {isAudio(attachment.fileName) && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#6B7280]">Audio Preview</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDownload}
                            className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
                            <FaDownload className="text-xs" /> Download
                          </button>
                          <button
                            onClick={handleOpenInNewTab}
                            className="px-3 py-1.5 text-xs font-medium bg-[#F0F4F8] text-[#1B262C] rounded-lg hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-1"
                            type="button"
                          >
                            <FaExternalLinkAlt className="text-xs" /> Open
                          </button>
                        </div>
                      </div>
                      <audio 
                        controls 
                        className="w-full rounded-lg"
                        src={attachmentUrl}
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}

                  {/* Office Document - Open in new tab */}
                  {isOfficeDocument(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                      <h4 className="text-lg font-semibold text-[#1B262C]">{attachment.fileName}</h4>
                      <p className="text-[#6B7280] text-center max-w-md">
                        {getFileType(attachment.fileName)} - {getFileSize(attachment.fileSize)}
                      </p>
                      <p className="text-sm text-[#9CA3AF] text-center">
                        Office documents can be viewed by downloading the file.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                          type="button"
                        >
                          <FaDownload className="text-xs" />
                          Download
                        </button>
                        <button
                          onClick={handleOpenInNewTab}
                          className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2"
                          type="button"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                          Open in New Tab
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fallback for unsupported files */}
                  {!isPreviewableImage(attachment.fileName) && 
                   !isPDF(attachment.fileName) && 
                   !isTextFile(attachment.fileName) && 
                   !isVideo(attachment.fileName) && 
                   !isAudio(attachment.fileName) && 
                   !isOfficeDocument(attachment.fileName) && (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="text-6xl">{getFileIcon(attachment.fileName)}</div>
                      <h4 className="text-lg font-semibold text-[#1B262C]">{attachment.fileName}</h4>
                      <p className="text-[#6B7280] text-center">
                        {getFileType(attachment.fileName)} - {getFileSize(attachment.fileSize)}
                      </p>
                      <p className="text-sm text-[#9CA3AF] text-center">
                        Preview not available for this file type.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                          type="button"
                        >
                          <FaDownload className="text-xs" />
                          Download
                        </button>
                        <button
                          onClick={handleOpenInNewTab}
                          className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2"
                          type="button"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                          Open in New Tab
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

            {/* File Details */}
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

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#BBE1FA]/30">
              {attachmentUrl && (
                <>
                  <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
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
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-4 py-2 bg-[#F0F4F8] text-[#1B262C] rounded-xl text-sm font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200 flex items-center gap-2"
                    type="button"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    Open in New Tab
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
                type="button"
              >
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
// ADD COMMENT MODAL INLINE
// ============================================
const AddCommentModalInline = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    remarks: '',
    requestToClientDepartment: '',
    clientDepartments: '',
    attachments: [],
    status: 'Select Status'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestOptions = [
    'Select',
    'Attendance of departmental representative required in court.',
    'Attendance of departmental representatives for cross-examination of witnesses.',
    'Attendance of Departmental representatives for oral evidence.',
    'In case of transfer/leave/retirement etc. Alternate Departmental Representative.',
    'Provision of record and assistance from Departmental Representative for arguments.',
    'Provision of record for documentary evidence. (time limitation)',
    'Provision of record for preparation of written statement/ reply. (time limitation)'
  ];

  const clientDepartmentOptions = [
    'Select',
    'Agriculture Department',
    'Board of Revenue Department',
    'Communication and Works Department',
    'Cooperation Department',
    'Energy Department',
    'Finance Department',
    'Food Department',
    'Forestry and Wildlife Department',
    'Health Department',
    'Higher Education Department',
    'Home Department',
    'Housing Department',
    'Industries Department',
    'Information and Culture Department',
    'Irrigation Department',
    'Labour Department',
    'Law and Parliamentary Affairs Department',
    'Livestock Department',
    'Local Government Department',
    'Mines and Mineral Department',
    'Planning and Development Department',
    'Public Prosecution Department',
    'School Education Department',
    'Services and General Administration Department',
    'Social Welfare Department',
    'Special Education Department',
    'Specialized Healthcare Department'
  ];

  const statusOptions = [
    'Select Status',
    'Pending',
    'In Progress',
    'Completed',
    'Closed'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.remarks) {
      toast.error('Please enter remarks');
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      caseId: caseId,
      remarks: formData.remarks || '',
      requestToClientDepartment: formData.requestToClientDepartment || '',
      clientDepartments: formData.clientDepartments || '',
      attachments: formData.attachments || [],
      status: formData.status,
      date: new Date().toISOString().split('T')[0]
    };
    
    if (typeof onSave === 'function') {
      onSave(submitData);
    } else {
      toast.error('Cannot save: function not available');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <FaComment className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add Comment</h3>
                  <p className="text-white/70 text-sm">Add comment to this case</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" type="button">
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Request to Client Department
              </label>
              <select
                value={formData.requestToClientDepartment}
                onChange={(e) => handleChange('requestToClientDepartment', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                {requestOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Client Departments
              </label>
              <select
                value={formData.clientDepartments}
                onChange={(e) => handleChange('clientDepartments', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                {clientDepartmentOptions.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Remarks *
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Enter Remarks"
                required
                rows="3"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Attach Files
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 px-4 py-3 border-2 border-dashed border-[#BBE1FA] rounded-xl cursor-pointer hover:border-[#3282B8] transition-all duration-200 bg-[#F8FAFC] hover:bg-[#F0F4F8]">
                  <div className="flex items-center justify-center gap-2">
                    <FaFileAlt className="text-[#3282B8]" />
                    <span className="text-sm text-[#6B7280]">Choose Files</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const fileNames = files.map(f => f.name);
                      handleChange('attachments', [...formData.attachments, ...fileNames]);
                    }}
                  />
                </label>
                {formData.attachments.length > 0 ? (
                  <span className="text-sm text-[#0F4C75] font-medium">
                    {formData.attachments.length} file(s) chosen
                  </span>
                ) : (
                  <span className="text-sm text-[#9CA3AF]">No file chosen</span>
                )}
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">Each file must be less than 20MB</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200">
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================
// ADD PROCEEDING MODAL INLINE
// ============================================
const AddProceedingModalInline = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    createdBy: '',
    progress: '',
    nextHearingDate: '',
    status: '',
    attachment: null,
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomStatusInput, setShowCustomStatusInput] = useState(false);
  const [customStatus, setCustomStatus] = useState('');

  const defaultStatusOptions = [
    'Adjournment by the Court.',
    'Adjournment by the law officer',
    'Adjournment by the private counsel',
    'Arguments on maintainability of the case.',
    'Decision',
    'Dismissed for non-prosecution of law officer',
    'Dismissed for non-prosecution of private party.',
    'Dismissed in limine.',
    'Pending for arguments.',
    'Pending for case laws discussion',
    'Pending for decision on Misc. Application.',
    'Pending for evidence. (time limitation)',
    'Pending for final arguments',
    'Pending for framing of issues.',
    'Pending for written statement/reply. (time limitation)',
    'Preliminary stage/process of summons and notices etc.',
    'Right of evidence of department closed',
    'Withdraw by private party',
    'Others'
  ];

  const [statusOptions, setStatusOptions] = useState(defaultStatusOptions);

  const addCustomStatus = (newStatus) => {
    if (newStatus && !statusOptions.includes(newStatus)) {
      setStatusOptions(prev => [...prev, newStatus]);
      setFormData(prev => ({ ...prev, status: newStatus }));
      setCustomStatus('');
      setShowCustomStatusInput(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.createdBy) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.progress) {
      toast.error('Please enter progress details');
      return;
    }
    if (!formData.nextHearingDate) {
      toast.error('Please select next hearing date');
      return;
    }
    if (!formData.status) {
      toast.error('Please select status');
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      caseId: caseId,
      createdBy: formData.createdBy,
      progress: formData.progress,
      nextHearingDate: formData.nextHearingDate,
      status: formData.status,
      date: formData.date,
      attachment: formData.attachment || null
    };
    
    if (typeof onSave === 'function') {
      onSave(submitData);
    } else {
      toast.error('Cannot save: function not available');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <FaGavel className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add Proceeding</h3>
                  <p className="text-white/70 text-sm">Add hearing progress to this case</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" type="button">
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Created By *
              </label>
              <input
                type="text"
                value={formData.createdBy}
                onChange={(e) => handleChange('createdBy', e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Progress on Date of Hearing *
              </label>
              <textarea
                value={formData.progress}
                onChange={(e) => handleChange('progress', e.target.value)}
                placeholder="Enter progress details..."
                required
                rows="3"
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Next Date of Hearing *
              </label>
              <input
                type="date"
                value={formData.nextHearingDate}
                onChange={(e) => handleChange('nextHearingDate', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Status of the Case *
              </label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'Others') {
                    setShowCustomStatusInput(true);
                    setFormData(prev => ({ ...prev, status: '' }));
                  } else {
                    setShowCustomStatusInput(false);
                    setFormData(prev => ({ ...prev, status: value }));
                  }
                }}
                required={!showCustomStatusInput}
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                <option value="">- Select Status -</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              {showCustomStatusInput && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    placeholder="Enter custom status..."
                    className="flex-1 px-4 py-2 border-2 border-[#3282B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-[#F8FAFC] text-[#1B262C]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customStatus.trim()) {
                        addCustomStatus(customStatus.trim());
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomStatusInput(false);
                      setCustomStatus('');
                      setFormData(prev => ({ ...prev, status: '' }));
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Attachment
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 px-4 py-3 border-2 border-dashed border-[#BBE1FA] rounded-xl cursor-pointer hover:border-[#3282B8] transition-all duration-200 bg-[#F8FAFC] hover:bg-[#F0F4F8]">
                  <div className="flex items-center justify-center gap-2">
                    <FaFileAlt className="text-[#3282B8]" />
                    <span className="text-sm text-[#6B7280]">Choose File</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleChange('attachment', e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                {formData.attachment ? (
                  <span className="text-sm text-[#0F4C75] font-medium flex items-center gap-2">
                    <FaFile className="text-xs" />
                    {formData.attachment}
                  </span>
                ) : (
                  <span className="text-sm text-[#9CA3AF]">No file chosen</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="text-xs" />
                    Add Proceeding
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================
// ADD PARTY MODAL INLINE
// ============================================
const AddPartyModalInline = ({ isOpen, onClose, onSave, caseId }) => {
  const [formData, setFormData] = useState({
    caseId: caseId || '',
    type: '',
    name: '',
    phone: '',
    email: '',
    cnic: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partyTypes = [
    'Appellant(s)',
    'Defendant(s)',
    'Petitioner(s)',
    'Plaintiff(s)',
    'Respondent(s)',
    'Applicant(s)',
    'Complainant(s)',
    'Accused'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type) {
      toast.error('Please select party type');
      return;
    }
    if (!formData.name) {
      toast.error('Please enter party name');
      return;
    }

    setIsSubmitting(true);
    
    const submitData = {
      caseId: caseId,
      type: formData.type,
      name: formData.name,
      phone: formData.phone || '-',
      email: formData.email || '-',
      cnic: formData.cnic || '-',
      address: formData.address || '-',
      createdBy: 'Current User',
    };
    
    if (typeof onSave === 'function') {
      onSave(submitData);
    } else {
      toast.error('Cannot save: function not available');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200 border border-[#3282B8]/20">
          <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
            <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Add Party</h3>
                  <p className="text-white/70 text-sm">Add a party to this case</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200" type="button">
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
              >
                <option value="">- Select Type -</option>
                {partyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter party name"
                required
                className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="party@example.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                CNIC
              </label>
              <div className="relative">
                <FaIdCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={(e) => handleChange('cnic', e.target.value)}
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                Address
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-[#9CA3AF]" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter address"
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200">
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    Save Party
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ============================================
// DELETE CONFIRMATION MODAL
// ============================================
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B262C]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in duration-200 border border-red-500/20">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
            <FaExclamationTriangle className="text-3xl text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#1B262C] text-center mb-2">
          {title || 'Delete?'}
        </h3>
        <p className="text-[#6B7280] text-center text-sm mb-6">
          {message || 'This action cannot be undone. Are you sure you want to delete this?'}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-[#F0F4F8] rounded-xl hover:bg-[#E5E7EB] transition-all duration-200" type="button">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200 flex items-center justify-center gap-2" type="button">
            <FaTrash className="text-sm" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN CASE DETAIL MODAL
// ============================================
const CaseDetailModal = ({ 
  isOpen, 
  case: caseItem, 
  onClose, 
  onStatusChange, 
  onEdit,
  onDelete,
  onDeleteComplete,
  onRefresh,
  proceedings = [],
  onAddProceeding,
  onUpdateProceeding,
  onDeleteProceeding,
  comments = [],
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  parties = [],
  onAddParty,
  onUpdateParty,
  onDeleteParty,
}) => {
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Proceeding states
  const [showProceedingForm, setShowProceedingForm] = useState(false);
  const [showEditProceedingForm, setShowEditProceedingForm] = useState(false);
  const [editingProceeding, setEditingProceeding] = useState(null);
  const [editProceedingFormData, setEditProceedingFormData] = useState({
    createdBy: '',
    progress: '',
    nextHearingDate: '',
    status: '',
    attachment: null,
    date: ''
  });
  const [showEditCustomStatusInput, setShowEditCustomStatusInput] = useState(false);
  const [editCustomStatus, setEditCustomStatus] = useState('');
  const [editStatusOptions, setEditStatusOptions] = useState([
    'Adjournment by the Court.',
    'Adjournment by the law officer',
    'Adjournment by the private counsel',
    'Arguments on maintainability of the case.',
    'Decision',
    'Dismissed for non-prosecution of law officer',
    'Dismissed for non-prosecution of private party.',
    'Dismissed in limine.',
    'Pending for arguments.',
    'Pending for case laws discussion',
    'Pending for decision on Misc. Application.',
    'Pending for evidence. (time limitation)',
    'Pending for final arguments',
    'Pending for framing of issues.',
    'Pending for written statement/reply. (time limitation)',
    'Preliminary stage/process of summons and notices etc.',
    'Right of evidence of department closed',
    'Withdraw by private party',
    'Others'
  ]);

  // Comment states
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showEditCommentForm, setShowEditCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentFormData, setEditCommentFormData] = useState({
    remarks: '',
    requestToClientDepartment: '',
    clientDepartments: '',
    attachments: [],
    status: 'Pending',
    date: ''
  });

  // Party states
  const [showAddPartyForm, setShowAddPartyForm] = useState(false);
  const [showEditPartyForm, setShowEditPartyForm] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [editPartyFormData, setEditPartyFormData] = useState({
    type: '',
    name: '',
    phone: '',
    email: '',
    cnic: '',
    address: '',
    createdBy: '',
  });

  // Delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetType, setDeleteTargetType] = useState('');

  // Proceeding detail view
  const [selectedProceeding, setSelectedProceeding] = useState(null);
  const [showProceedingDetail, setShowProceedingDetail] = useState(false);

  // Search states
  const [proceedingSearch, setProceedingSearch] = useState('');
  const [commentSearch, setCommentSearch] = useState('');
  const [partySearch, setPartySearch] = useState('');

  // Attachment view states
  const [viewAttachmentModal, setViewAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  // Get case ID
  const caseId = caseItem?._id || caseItem?.id || caseItem?.caseId;
  
  const partyTypes = [
    'Appellant(s)',
    'Defendant(s)',
    'Petitioner(s)',
    'Plaintiff(s)',
    'Respondent(s)',
    'Applicant(s)',
    'Complainant(s)',
    'Accused'
  ];

  // ============================================
  // GET FUNCTIONS
  // ============================================
  const getAddProceedingFn = useCallback(() => {
    if (typeof onAddProceeding === 'function') {
      return onAddProceeding;
    }
    if (typeof window !== 'undefined' && typeof window.__handleAddProceeding === 'function') {
      return window.__handleAddProceeding;
    }
    return null;
  }, [onAddProceeding]);

  const getAddCommentFn = useCallback(() => {
    if (typeof onAddComment === 'function') {
      return onAddComment;
    }
    if (typeof window !== 'undefined' && typeof window.__handleAddComment === 'function') {
      return window.__handleAddComment;
    }
    return null;
  }, [onAddComment]);

  const getAddPartyFn = useCallback(() => {
    if (typeof onAddParty === 'function') {
      return onAddParty;
    }
    if (typeof window !== 'undefined' && typeof window.__handleAddParty === 'function') {
      return window.__handleAddParty;
    }
    return null;
  }, [onAddParty]);

  // ============================================
  // REFRESH DATA FUNCTION
  // ============================================
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      let freshParties = [];
      let freshComments = [];
      let freshProceedings = [];
      
      try {
        const [partiesRes, commentsRes, proceedingsRes] = await Promise.all([
          api.get('/parties'),
          api.get('/comments'),
          api.get('/proceedings')
        ]);
        
        freshParties = partiesRes.data || [];
        freshComments = commentsRes.data || [];
        freshProceedings = proceedingsRes.data || [];
        
      } catch (error) {
        if (typeof window !== 'undefined') {
          freshParties = window.__allParties || [];
          freshComments = window.__allComments || [];
          freshProceedings = window.__allProceedings || [];
        }
      }
      
      if (typeof window !== 'undefined') {
        window.__allParties = freshParties;
        window.__allComments = freshComments;
        window.__allProceedings = freshProceedings;
      }
      
      if (typeof onRefresh === 'function') {
        await onRefresh();
      }
      
      setRefreshTrigger(prev => prev + 1);
      
      return true;
      
    } catch (error) {
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, caseId]);

  // ============================================
  // FILTER DATA
  // ============================================
  const caseProceedings = useMemo(() => {
    const caseIdFromItem = caseItem?._id || caseItem?.id || caseItem?.caseId || '';
    const caseIdStr = String(caseIdFromItem || '');
    
    const dataSource = proceedings.length > 0 ? proceedings : (window.__allProceedings || []);
    
    if (dataSource.length === 0) return [];
    
    return dataSource.filter(p => {
      const pCaseId = p.caseId || p.case_id || p.case?._id || p.case?.id;
      const pCaseIdStr = String(pCaseId || '');
      return pCaseIdStr === caseIdStr;
    });
  }, [caseItem, proceedings, refreshTrigger]);

  const caseComments = useMemo(() => {
    const caseIdFromItem = caseItem?._id || caseItem?.id || caseItem?.caseId || '';
    const caseIdStr = String(caseIdFromItem || '');
    
    const dataSource = comments.length > 0 ? comments : (window.__allComments || []);
    
    if (dataSource.length === 0) return [];
    
    return dataSource.filter(c => {
      const cCaseId = c.caseId || c.case_id || c.case?._id || c.case?.id;
      const cCaseIdStr = String(cCaseId || '');
      return cCaseIdStr === caseIdStr;
    });
  }, [caseItem, comments, refreshTrigger]);

  const caseParties = useMemo(() => {
    const caseIdFromItem = caseItem?._id || caseItem?.id || caseItem?.caseId || '';
    const caseIdStr = String(caseIdFromItem || '');
    
    const dataSource = parties.length > 0 ? parties : (window.__allParties || []);
    
    if (dataSource.length === 0) return [];
    
    return dataSource.filter(p => {
      const pCaseId = p.caseId || p.case_id || p.case?._id || p.case?.id;
      if (!pCaseId || pCaseId === null || pCaseId === 'null' || pCaseId === 'undefined') {
        return false;
      }
      const pCaseIdStr = String(pCaseId || '');
      return pCaseIdStr === caseIdStr;
    });
  }, [caseItem, parties, refreshTrigger]);

  // ============================================
  // SEARCH FILTERS
  // ============================================
  const filteredProceedings = useMemo(() => {
    if (!proceedingSearch.trim()) return caseProceedings;
    const search = proceedingSearch.toLowerCase().trim();
    return caseProceedings.filter(p => 
      p.createdBy?.toLowerCase().includes(search) ||
      p.progress?.toLowerCase().includes(search) ||
      p.status?.toLowerCase().includes(search)
    );
  }, [caseProceedings, proceedingSearch]);

  const filteredComments = useMemo(() => {
    if (!commentSearch.trim()) return caseComments;
    const search = commentSearch.toLowerCase().trim();
    return caseComments.filter(c => 
      c.remarks?.toLowerCase().includes(search) ||
      c.requestToClientDepartment?.toLowerCase().includes(search) ||
      c.clientDepartments?.toLowerCase().includes(search) ||
      c.status?.toLowerCase().includes(search)
    );
  }, [caseComments, commentSearch]);

  const filteredParties = useMemo(() => {
    if (!partySearch.trim()) return caseParties;
    const search = partySearch.toLowerCase().trim();
    return caseParties.filter(p => 
      p.name?.toLowerCase().includes(search) ||
      p.type?.toLowerCase().includes(search) ||
      p.phone?.includes(search) ||
      p.email?.toLowerCase().includes(search)
    );
  }, [caseParties, partySearch]);

  // ============================================
  // VIEW ATTACHMENT HANDLER - FIXED
  // ============================================
  const handleViewAttachment = useCallback((attachment, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!attachment) {
      toast.error('No attachment data found');
      return;
    }
    
    // If attachment is a string (filename), create an object
    if (typeof attachment === 'string') {
      setSelectedAttachment({
        fileName: attachment,
        fileUrl: `/uploads/${attachment}`,
        fileSize: 0,
        description: ''
      });
    } else {
      setSelectedAttachment({
        fileName: attachment.fileName || attachment.name || 'File',
        fileUrl: attachment.fileUrl || attachment.url || attachment.path || 
                 (attachment.fileName ? `/uploads/${attachment.fileName}` : ''),
        fileSize: attachment.fileSize || attachment.size || 0,
        description: attachment.description || attachment.desc || ''
      });
    }
    setViewAttachmentModal(true);
  }, []);

  // ============================================
  // PROCEEDING HANDLERS
  // ============================================
  const handleAddProceedingSubmit = async (data) => {
    setShowProceedingForm(false);
    
    const addFn = getAddProceedingFn();
    if (typeof addFn !== 'function') {
      toast.error('Cannot add proceeding: function not available');
      return;
    }
    
    try {
      const proceedingData = {
        caseId: caseId,
        createdBy: data.createdBy || 'Unknown',
        progress: data.progress || 'N/A',
        nextHearingDate: data.nextHearingDate || '',
        status: data.status || 'Pending',
        date: data.date || new Date().toISOString().split('T')[0],
        attachment: data.attachment || null
      };
      
      await addFn(proceedingData);
      await refreshData();
      toast.success('Proceeding added successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to add proceeding');
    }
  };

  const handleEditProceedingFormChange = (field, value) => {
    setEditProceedingFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditProceedingSubmit = async (e) => {
    e.preventDefault();
    const id = editingProceeding?._id || editingProceeding?.id;
    
    if (!id) {
      toast.error('Proceeding ID not found');
      return;
    }
    
    try {
      let result;
      if (typeof onUpdateProceeding === 'function') {
        result = await onUpdateProceeding(id, editProceedingFormData);
      } else if (typeof window !== 'undefined' && typeof window.__handleUpdateProceeding === 'function') {
        result = await window.__handleUpdateProceeding(id, editProceedingFormData);
      } else {
        result = await api.put(`/proceedings/${id}`, editProceedingFormData);
      }
      
      setShowEditProceedingForm(false);
      setEditingProceeding(null);
      await refreshData();
      toast.success('Proceeding updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update proceeding');
    }
  };

  const addEditCustomStatus = (newStatus) => {
    if (newStatus && !editStatusOptions.includes(newStatus)) {
      setEditStatusOptions(prev => [...prev, newStatus]);
      setEditProceedingFormData(prev => ({ ...prev, status: newStatus }));
      setEditCustomStatus('');
      setShowEditCustomStatusInput(false);
    }
  };

  const openEditProceedingForm = (proceeding) => {
    if (!proceeding) {
      toast.error('No proceeding data found');
      return;
    }
    setEditingProceeding(proceeding);
    const formatDate = (date) => {
      if (!date) return '';
      try {
        return new Date(date).toISOString().split('T')[0];
      } catch {
        return '';
      }
    };
    setEditProceedingFormData({
      createdBy: proceeding.createdBy || '',
      progress: proceeding.progress || '',
      nextHearingDate: formatDate(proceeding.nextHearingDate),
      status: proceeding.status || '',
      attachment: proceeding.attachment || null,
      date: formatDate(proceeding.date) || formatDate(new Date())
    });
    setShowEditProceedingForm(true);
  };

  const openProceedingDetail = (proceeding) => {
    setSelectedProceeding(proceeding);
    setShowProceedingDetail(true);
  };

  // ============================================
  // COMMENT HANDLERS
  // ============================================
  const handleAddCommentSubmit = async (data) => {
    setShowCommentForm(false);
    
    const caseIdStr = caseId?.toString ? caseId.toString() : caseId;
    
    if (!caseIdStr || caseIdStr === 'null' || caseIdStr === 'undefined') {
      toast.error('Case ID is missing. Please refresh and try again.');
      return;
    }
    
    const addFn = getAddCommentFn();
    if (typeof addFn !== 'function') {
      toast.error('Cannot add comment: function not available');
      return;
    }
    
    try {
      const commentData = {
        caseId: caseIdStr,
        remarks: data.remarks || '',
        requestToClientDepartment: data.requestToClientDepartment || '',
        clientDepartments: data.clientDepartments || '',
        attachments: data.attachments || [],
        status: data.status || 'Select Status',
        date: new Date().toISOString().split('T')[0]
      };
      
      await addFn(commentData);
      await refreshData();
      toast.success('Comment added successfully!');
      
    } catch (error) {
      toast.error(error.message || 'Failed to add comment');
    }
  };

  const openEditCommentForm = (comment) => {
    setEditingComment(comment);
    setEditCommentFormData({
      remarks: comment.remarks || '',
      requestToClientDepartment: comment.requestToClientDepartment || '',
      clientDepartments: comment.clientDepartments || '',
      attachments: comment.attachments || [],
      status: comment.status || 'Pending',
      date: comment.date ? new Date(comment.date).toISOString().split('T')[0] : ''
    });
    setShowEditCommentForm(true);
  };

  const handleEditCommentFormChange = (field, value) => {
    setEditCommentFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditCommentSubmit = async (e) => {
    e.preventDefault();
    const id = editingComment?._id || editingComment?.id;
    
    if (!id) {
      toast.error('Comment ID not found');
      return;
    }
    
    try {
      let result;
      if (typeof onUpdateComment === 'function') {
        result = await onUpdateComment(id, editCommentFormData);
      } else if (typeof window !== 'undefined' && typeof window.__handleUpdateComment === 'function') {
        result = await window.__handleUpdateComment(id, editCommentFormData);
      } else {
        result = await api.put(`/comments/${id}`, editCommentFormData);
      }
      
      setShowEditCommentForm(false);
      setEditingComment(null);
      await refreshData();
      toast.success('Comment updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update comment');
    }
  };

  // ============================================
  // PARTY HANDLERS
  // ============================================
  const handleAddPartySubmit = async (data) => {
    setShowAddPartyForm(false);
    
    const addFn = getAddPartyFn();
    if (typeof addFn !== 'function') {
      toast.error('Cannot add party: function not available');
      return;
    }
    
    try {
      const partyData = {
        caseId: caseId,
        type: data.type || 'Party',
        name: data.name || 'Unknown',
        phone: data.phone || '-',
        email: data.email || '-',
        cnic: data.cnic || '-',
        address: data.address || '-',
        createdBy: data.createdBy || 'Current User'
      };
      
      await addFn(partyData);
      await refreshData();
      toast.success('Party added successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to add party');
    }
  };

  const openEditPartyForm = (party) => {
    if (!party) {
      toast.error('No party data found');
      return;
    }
    
    const partyId = party._id || party.id || party.partyId;
    
    if (!partyId) {
      toast.error('Party ID not found');
      return;
    }
    
    const partyWithId = {
      ...party,
      id: partyId,
      _id: partyId
    };
    
    const formData = {
      type: partyWithId.type || '',
      name: partyWithId.name || '',
      phone: partyWithId.phone || '',
      email: partyWithId.email || '',
      cnic: partyWithId.cnic || '',
      address: partyWithId.address || '',
      createdBy: partyWithId.createdBy || '',
    };
    
    setEditingParty(partyWithId);
    setEditPartyFormData(formData);
    setShowEditPartyForm(true);
  };

  const handleEditPartyFormChange = (field, value) => {
    setEditPartyFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditPartySubmit = async (e) => {
    e.preventDefault();
    
    let id = editingParty?._id || editingParty?.id || editingParty?.partyId;
    
    if (!id) {
      toast.error('Party ID not found');
      return;
    }
    
    const updateData = {
      id: id,
      _id: id,
      partyId: id,
      type: editPartyFormData.type || editingParty?.type || '',
      name: editPartyFormData.name || editingParty?.name || '',
      phone: editPartyFormData.phone || editingParty?.phone || '-',
      email: editPartyFormData.email || editingParty?.email || '-',
      cnic: editPartyFormData.cnic || editingParty?.cnic || '-',
      address: editPartyFormData.address || editingParty?.address || '-',
      createdBy: editPartyFormData.createdBy || editingParty?.createdBy || 'Current User'
    };
    
    try {
      let result;
      
      if (typeof onUpdateParty === 'function') {
        result = await onUpdateParty(updateData);
      } else if (typeof window.__handleUpdateParty === 'function') {
        result = await window.__handleUpdateParty(updateData);
      } else {
        const response = await api.put(`/parties/${id}`, updateData);
        result = response.data;
      }
      
      setShowEditPartyForm(false);
      setEditingParty(null);
      
      await refreshData();
      toast.success('Party updated successfully!');
      
    } catch (error) {
      toast.error(error.message || 'Failed to update party');
    }
  };

  // ============================================
  // DELETE HANDLERS
  // ============================================
  const openDeleteConfirm = (id, type) => {
    setDeleteTargetId(id);
    setDeleteTargetType(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTargetId) {
      toast.error('ID not found');
      return;
    }
    
    try {
      let deleteFn = null;
      
      if (deleteTargetType === 'proceeding') {
        deleteFn = onDeleteProceeding || window.__handleDeleteProceeding;
      } else if (deleteTargetType === 'comment') {
        deleteFn = onDeleteComment || window.__handleDeleteComment;
      } else if (deleteTargetType === 'party') {
        deleteFn = onDeleteParty || window.__handleDeleteParty;
      }
      
      if (typeof deleteFn !== 'function') {
        toast.error(`Delete function not available for ${deleteTargetType}`);
        return;
      }
      
      await deleteFn(deleteTargetId);
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetType('');
      await refreshData();
      toast.success(`${deleteTargetType} deleted successfully!`);
    } catch (error) {
      toast.error(error.message || `Failed to delete ${deleteTargetType}`);
    }
  };

  if (!isOpen || !caseItem) return null;

  // ============================================
  // HANDLE CLOSE
  // ============================================
  const handleCloseClick = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowClosePopup(true);
  }, []);

  const confirmClose = useCallback(() => {
    setShowClosePopup(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const cancelClose = useCallback(() => {
    setShowClosePopup(false);
  }, []);

  // ============================================
  // STATUS CONFIG
  // ============================================
  const statusConfig = {
    active: {
      badge: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
      dot: 'bg-[#22C55E]',
      icon: FaClock,
      label: 'Active',
    },
    pending: {
      badge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      dot: 'bg-[#F59E0B]',
      icon: FaExclamationTriangle,
      label: 'Pending',
    },
    closed: {
      badge: 'bg-[#9CA3AF]/10 text-[#6B7280] border-[#9CA3AF]/20',
      dot: 'bg-[#9CA3AF]',
      icon: FaCheckCircle,
      label: 'Closed',
    },
  };

  const status = caseItem?.status || 'pending';
  const statusInfo = statusConfig[status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = (newStatus) => {
    if (onStatusChange && caseId) {
      onStatusChange(caseId, newStatus);
    }
  };

  const getCaseTitle = () => {
    if (caseItem?.plaintiff && caseItem?.defendant) {
      return `${caseItem.plaintiff} VS ${caseItem.defendant}`;
    }
    if (caseItem?.caseTitle) return caseItem.caseTitle;
    if (caseItem?.title) return caseItem.title;
    return 'Untitled Case';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  // ============================================
  // HELPER FUNCTIONS FOR STATUS COLORS
  // ============================================
  const getProceedingStatusColor = (status) => {
    if (status?.toLowerCase().includes('adjournment')) 
      return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
    if (status?.toLowerCase().includes('decision')) 
      return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
    if (status?.toLowerCase().includes('dismissed')) 
      return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
    return 'bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20';
  };

  const getCommentStatusColor = (status) => {
    if (status === 'Completed') 
      return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
    if (status === 'In Progress') 
      return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
    if (status === 'Closed') 
      return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20';
    return 'bg-[#3282B8]/10 text-[#0F4C75] border-[#3282B8]/20';
  };

  // ============================================
  // TABS
  // ============================================
  const tabs = [
    { id: 'details', label: 'Case Details' },
    { id: 'proceedings', label: `Proceedings (${caseProceedings.length})` },
    { id: 'comments', label: `Comments (${caseComments.length})` },
    { id: 'parties', label: `Parties (${caseParties.length})` },
  ];

  // ============================================
  // RENDER DETAILS TAB WITH VIEW ATTACHMENT BUTTONS
  // ============================================
  const renderDetails = () => (
    <div className="space-y-5 max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
              <FaLandmark className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Division</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.division)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#BBE1FA] p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
              <FaLandmark className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">District</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.district)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
            <FaBookOpen className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Case Number</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.caseNumber)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
            <FaFileAlt className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Title of the Case</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {caseItem.caseTitle || caseItem.title || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-center">
        <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
              <FaUser className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Plaintiff</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.plaintiff)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-[#3282B8] tracking-wider">VS</span>
        </div>
        <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
              <FaUser className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Defendant</p>
              <p className="text-base font-semibold text-[#1B262C] truncate">{displayValue(caseItem.defendant)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
            <FaBuilding className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Name of the Court</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {displayValue(caseItem.nameOfCourt || caseItem.courtDetails?.courtName || caseItem.courtName || 'N/A')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
            <FaClipboardList className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Nature of the Case</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {displayValue(caseItem.natureOfCase || caseItem.caseNature?.trial || 'N/A')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
            <FaCalendarAlt className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Next Date of Hearing</p>
            <p className="text-base font-semibold text-[#1B262C] truncate">
              {caseItem.nextDateOfHearing ? formatDate(caseItem.nextDateOfHearing) : 
               caseItem.nextDate ? formatDate(caseItem.nextDate) : 
               caseItem.courtDetails?.nextDate ? formatDate(caseItem.courtDetails.nextDate) : 
               'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Attachments Section with View Button */}
      {(caseItem.attachments || caseItem.copyOfSummon || caseItem.copyOfPlaint || caseItem.relevantDepartmentalRecord) && (
        <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
              <FaFileAlt className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Attachments</h3>
          </div>
          <div className="space-y-2">
            {(caseItem.copyOfSummon || caseItem.attachments?.copyOfSummon) && (
              <div className="flex items-center justify-between p-2 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all group">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FaFilePdf className="text-red-500 flex-shrink-0" />
                  <span className="text-sm text-[#1B262C] truncate">
                    Copy of summon/Notices/Request to defend
                  </span>
                </div>
                <button
                  onClick={(e) => handleViewAttachment({
                    fileName: caseItem.copyOfSummon || caseItem.attachments?.copyOfSummon,
                    fileUrl: caseItem.copyOfSummonUrl || caseItem.attachments?.copyOfSummonUrl || `/uploads/${caseItem.copyOfSummon || caseItem.attachments?.copyOfSummon}`,
                    description: 'Copy of summon/Notices/Request to defend'
                  }, e)}
                  className="flex-shrink-0 ml-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-1 opacity-70 group-hover:opacity-100"
                  type="button"
                >
                  <FaEye className="text-xs" /> View
                </button>
              </div>
            )}
            {(caseItem.copyOfPlaint || caseItem.attachments?.copyOfPlaint) && (
              <div className="flex items-center justify-between p-2 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all group">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FaFilePdf className="text-red-500 flex-shrink-0" />
                  <span className="text-sm text-[#1B262C] truncate">
                    Copy of plaint / petition
                  </span>
                </div>
                <button
                  onClick={(e) => handleViewAttachment({
                    fileName: caseItem.copyOfPlaint || caseItem.attachments?.copyOfPlaint,
                    fileUrl: caseItem.copyOfPlaintUrl || caseItem.attachments?.copyOfPlaintUrl || `/uploads/${caseItem.copyOfPlaint || caseItem.attachments?.copyOfPlaint}`,
                    description: 'Copy of plaint / petition'
                  }, e)}
                  className="flex-shrink-0 ml-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-1 opacity-70 group-hover:opacity-100"
                  type="button"
                >
                  <FaEye className="text-xs" /> View
                </button>
              </div>
            )}
            {(caseItem.relevantDepartmentalRecord || caseItem.attachments?.relevantDepartmentalRecord) && (
              <div className="flex items-center justify-between p-2 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all group">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FaFilePdf className="text-red-500 flex-shrink-0" />
                  <span className="text-sm text-[#1B262C] truncate">
                    Relevant Departmental Record
                  </span>
                </div>
                <button
                  onClick={(e) => handleViewAttachment({
                    fileName: caseItem.relevantDepartmentalRecord || caseItem.attachments?.relevantDepartmentalRecord,
                    fileUrl: caseItem.relevantDepartmentalRecordUrl || caseItem.attachments?.relevantDepartmentalRecordUrl || `/uploads/${caseItem.relevantDepartmentalRecord || caseItem.attachments?.relevantDepartmentalRecord}`,
                    description: 'Relevant Departmental Record'
                  }, e)}
                  className="flex-shrink-0 ml-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-1 opacity-70 group-hover:opacity-100"
                  type="button"
                >
                  <FaEye className="text-xs" /> View
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {caseItem.writtenStatements && caseItem.writtenStatements.length > 0 && (
        <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
              <FaFileAlt className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Written Statements</h3>
          </div>
          <div className="space-y-2">
            {caseItem.writtenStatements.map((statement, index) => (
              <div key={index} className="p-3 bg-[#F0F4F8] rounded-lg border border-[#BBE1FA]/30">
                <p className="text-sm font-semibold text-[#1B262C]">{statement.title || `Statement ${index + 1}`}</p>
                {statement.content && (
                  <p className="text-sm text-[#6B7280] mt-1">{statement.content}</p>
                )}
                {statement.fileName && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#BBE1FA]/30">
                    <p className="text-xs text-[#6B7280]">File: {statement.fileName}</p>
                    <button
                      onClick={(e) => handleViewAttachment({
                        fileName: statement.fileName,
                        fileUrl: statement.fileUrl || `/uploads/${statement.fileName}`,
                        description: statement.title || `Statement ${index + 1}`
                      }, e)}
                      className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-1"
                      type="button"
                    >
                      <FaEye className="text-xs" /> View
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {caseItem.lawOfficer && (
        <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-lg">
              <FaUser className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Law Officer / Departmental Representative</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Type</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.type)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Name</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.name)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Designation</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.designation)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Office Address</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.officeAddress)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Official Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.officialNumber)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#3282B8]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Cell Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.lawOfficer.cellNumber)}</p>
            </div>
          </div>
        </div>
      )}

      {caseItem.alternateLawOfficer && (
        <div className="bg-white rounded-xl border border-[#BBE1FA]/30 p-4 shadow-sm w-full">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-[#BBE1FA]/40">
            <div className="p-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-lg">
              <FaUser className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[#1B262C] uppercase tracking-wider">Alternate Law Officer / Departmental Representative</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#D97706]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Type</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.type)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#D97706]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Name</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.name)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#D97706]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Designation</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.designation)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#D97706]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Office Address</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.officeAddress)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#D97706]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Official Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.officialNumber)}</p>
            </div>
            <div className="bg-gradient-to-r from-[#F0F4F8] to-[#F8FAFC] rounded-lg p-3 border border-[#BBE1FA]/30 hover:border-[#D97706]/50 transition-all">
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Cell Number</p>
              <p className="text-sm font-semibold text-[#1B262C]">{displayValue(caseItem.alternateLawOfficer.cellNumber)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-[#BBE1FA]/40 w-full">
        {caseItem.status !== 'closed' && onStatusChange && (
          <button
            onClick={() => handleStatusChange('closed')}
            className="flex-1 min-w-[120px] px-5 py-2.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
            type="button"
          >
            <FaGavelIcon className="inline mr-2" /> Close Case
          </button>
        )}
        <button 
          onClick={handleCloseClick}
          className="flex-1 min-w-[120px] px-5 py-2.5 bg-[#F0F4F8] text-[#1B262C] border border-[#BBE1FA] rounded-xl font-medium hover:bg-[#BBE1FA]/50 transition-all duration-200"
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseClick(e);
          }
        }}
      >
        <div 
          className="w-screen h-screen bg-[#F8FAFC] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* HEADER */}
          <div className="w-full px-6 py-4 border-b border-[#BBE1FA]/40 bg-white flex-shrink-0 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B262C] via-[#0F4C75] to-[#3282B8]"></div>
            
            <div className="flex items-start justify-between w-full pt-1">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] rounded-xl flex items-center justify-center shadow-lg shadow-[#0F4C75]/25">
                    <GiScales className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[#1B262C] tracking-tight truncate">
                    {getCaseTitle()}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[#6B7280] font-mono bg-[#F0F4F8] px-3 py-1 rounded-full border border-[#BBE1FA]">
                      #{displayValue(caseId, 'N/A')}
                    </span>
                    {caseItem.caseNumber && (
                      <span className="text-xs px-3 py-1 bg-[#3282B8]/10 rounded-full text-[#0F4C75] border border-[#3282B8]/20 font-mono flex items-center gap-1">
                        <FaBookOpen className="text-[10px]" />
                        {caseItem.caseNumber}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.badge} flex items-center gap-1.5`}>
                      <StatusIcon className="text-xs" />
                      {statusInfo.label}
                    </span>
                    {isRefreshing && (
                      <span className="text-xs text-[#6B7280] flex items-center gap-1">
                        <FaSync className="animate-spin" /> refreshing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button 
                  onClick={handleCloseClick}
                  className="p-2 text-[#9CA3AF] hover:text-[#1B262C] hover:bg-[#3282B8]/10 rounded-xl transition-all duration-200"
                  title="Close"
                  type="button"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="border-b border-[#BBE1FA]/40 bg-white px-6 flex-shrink-0 overflow-x-auto">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#3282B8] text-[#0F4C75]'
                      : 'border-transparent text-[#6B7280] hover:text-[#1B262C] hover:border-[#BBE1FA]'
                  }`}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-[#F8FAFC] p-6">
            
            {/* DETAILS TAB */}
            {activeTab === 'details' && renderDetails()}

            {/* PROCEEDINGS TAB */}
            {activeTab === 'proceedings' && (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <FaHistory className="text-[#0F4C75]" />
                    <span className="font-medium">{filteredProceedings.length} proceeding(s) recorded</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <input
                        type="text"
                        value={proceedingSearch}
                        onChange={(e) => setProceedingSearch(e.target.value)}
                        placeholder="Search by name, progress, status..."
                        className="pl-9 pr-4 py-2 border border-[#BBE1FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent w-64"
                      />
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
                    </div>
                    <button
                      onClick={() => setShowProceedingForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                      type="button"
                    >
                      <FaPlusCircle className="text-xs" />
                      Add Proceeding
                    </button>
                  </div>
                </div>

                {filteredProceedings.length > 0 ? (
                  <div className="bg-white rounded-xl border border-[#BBE1FA]/30 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-2 text-center">Created By</div>
                      <div className="col-span-2 text-center">Next Hearing</div>
                      <div className="col-span-3 text-center">Progress</div>
                      <div className="col-span-2 text-center">Status</div>
                      <div className="col-span-1 text-center">Date</div>
                      <div className="col-span-1 text-center">Actions</div>
                    </div>
                    
                    <div className="divide-y divide-[#BBE1FA]/20">
                      {filteredProceedings.map((p, idx) => (
                        <div 
                          key={p._id || p.id || idx}
                          className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-[#F0F4F8] transition-all items-center text-sm cursor-pointer min-h-[52px]"
                          onClick={() => {
                            setSelectedProceeding(p);
                            setShowProceedingDetail(true);
                          }}
                        >
                          <div className="col-span-1 text-center font-medium text-[#6B7280]">#{idx + 1}</div>
                          <div className="col-span-2 text-center font-medium text-[#1B262C] truncate">{p.createdBy || 'N/A'}</div>
                          <div className="col-span-2 text-center text-[#6B7280]">
                            {p.nextHearingDate ? new Date(p.nextHearingDate).toLocaleDateString('en-GB') : 'N/A'}
                          </div>
                          <div className="col-span-3 text-center text-[#6B7280] truncate px-1">{p.progress || 'N/A'}</div>
                          <div className="col-span-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getProceedingStatusColor(p.status)} inline-block`}>
                              {p.status || 'N/A'}
                            </span>
                          </div>
                          <div className="col-span-1 text-center text-[#6B7280]">
                            {p.date ? new Date(p.date).toLocaleDateString('en-GB') : 'N/A'}
                          </div>
                          <div className="col-span-1 flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditProceedingForm(p); }}
                              className="p-1.5 text-[#3282B8] hover:bg-[#3282B8]/10 rounded-lg transition-all"
                              title="Edit"
                              type="button"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openDeleteConfirm(p._id || p.id, 'proceeding'); }}
                              className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete"
                              type="button"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/30">
                    <div className="text-5xl mb-3">📋</div>
                    <h3 className="text-base font-semibold text-[#1B262C] mb-1">
                      {proceedingSearch ? 'No matching proceedings found' : 'No proceedings recorded'}
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      {proceedingSearch ? 'Try adjusting your search' : 'Click "Add Proceeding" to create your first record'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* COMMENTS TAB */}
            {activeTab === 'comments' && (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <FaComment className="text-[#0F4C75]" />
                    <span className="font-medium">{filteredComments.length} comment(s)</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <input
                        type="text"
                        value={commentSearch}
                        onChange={(e) => setCommentSearch(e.target.value)}
                        placeholder="Search by remarks, request..."
                        className="pl-9 pr-4 py-2 border border-[#BBE1FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent w-64"
                      />
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
                    </div>
                    <button
                      onClick={() => setShowCommentForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                      type="button"
                    >
                      <FaPlusCircle className="text-xs" />
                      Add Comment
                    </button>
                  </div>
                </div>

                {filteredComments.length > 0 ? (
                  <div className="bg-white rounded-xl border border-[#BBE1FA]/30 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-3 text-center">Remarks</div>
                      <div className="col-span-2 text-center">Request to Client Dept</div>
                      <div className="col-span-2 text-center">Client Dept</div>
                      <div className="col-span-2 text-center">Status</div>
                      <div className="col-span-1 text-center">Date</div>
                      <div className="col-span-1 text-center">Actions</div>
                    </div>
                    
                    <div className="divide-y divide-[#BBE1FA]/20">
                      {filteredComments.map((c, idx) => (
                        <div 
                          key={c._id || c.id || idx}
                          className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-[#F0F4F8] transition-all items-center text-sm min-h-[52px]"
                        >
                          <div className="col-span-1 text-center font-medium text-[#6B7280]">#{idx + 1}</div>
                          <div className="col-span-3 text-center text-[#6B7280] truncate px-1">{c.remarks || 'N/A'}</div>
                          <div className="col-span-2 text-center text-[#6B7280] truncate px-1">{c.requestToClientDepartment || 'N/A'}</div>
                          <div className="col-span-2 text-center text-[#6B7280] truncate px-1">{c.clientDepartments || 'N/A'}</div>
                          <div className="col-span-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCommentStatusColor(c.status)} inline-block`}>
                              {c.status || 'Pending'}
                            </span>
                          </div>
                          <div className="col-span-1 text-center text-[#6B7280]">
                            {c.date ? new Date(c.date).toLocaleDateString('en-GB') : 'N/A'}
                          </div>
                          <div className="col-span-1 flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditCommentForm(c)}
                              className="p-1.5 text-[#3282B8] hover:bg-[#3282B8]/10 rounded-lg transition-all"
                              title="Edit"
                              type="button"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(c._id || c.id, 'comment')}
                              className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete"
                              type="button"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/30">
                    <div className="text-5xl mb-3">💬</div>
                    <h3 className="text-base font-semibold text-[#1B262C] mb-1">
                      {commentSearch ? 'No matching comments found' : 'No comments'}
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      {commentSearch ? 'Try adjusting your search' : 'Click "Add Comment" to start the conversation'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PARTIES TAB */}
            {activeTab === 'parties' && (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <FaUsers className="text-[#0F4C75]" />
                    <span className="font-medium">{filteredParties.length} party(ies)</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <input
                        type="text"
                        value={partySearch}
                        onChange={(e) => setPartySearch(e.target.value)}
                        placeholder="Search by name, type, phone..."
                        className="pl-9 pr-4 py-2 border border-[#BBE1FA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent w-64"
                      />
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm" />
                    </div>
                    <button
                      onClick={() => setShowAddPartyForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                      type="button"
                    >
                      <FaPlusCircle className="text-xs" />
                      Add Party
                    </button>
                  </div>
                </div>

                {filteredParties.length > 0 ? (
                  <div className="bg-white rounded-xl border border-[#BBE1FA]/30 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 gap-2 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-4 py-3 text-xs font-semibold text-white uppercase tracking-wider">
                      <div className="col-span-1 text-center">#</div>
                      <div className="col-span-2 text-center">Type</div>
                      <div className="col-span-3 text-center">Name</div>
                      <div className="col-span-2 text-center">Phone</div>
                      <div className="col-span-2 text-center">Email</div>
                      <div className="col-span-1 text-center">CNIC</div>
                      <div className="col-span-1 text-center">Actions</div>
                    </div>
                    
                    <div className="divide-y divide-[#BBE1FA]/20">
                      {filteredParties.map((p, idx) => (
                        <div 
                          key={p._id || p.id || idx}
                          className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-[#F0F4F8] transition-all items-center text-sm min-h-[52px]"
                        >
                          <div className="col-span-1 text-center font-medium text-[#6B7280]">#{idx + 1}</div>
                          <div className="col-span-2 text-center">
                            <span className="px-2 py-0.5 bg-[#3282B8]/10 text-[#0F4C75] rounded text-xs font-medium border border-[#3282B8]/20">
                              {p.type || 'Party'}
                            </span>
                          </div>
                          <div className="col-span-3 text-center font-medium text-[#1B262C] truncate">{p.name || 'N/A'}</div>
                          <div className="col-span-2 text-center text-[#6B7280]">{p.phone || '-'}</div>
                          <div className="col-span-2 text-center text-[#6B7280] truncate">{p.email || '-'}</div>
                          <div className="col-span-1 text-center text-[#6B7280]">{p.cnic || '-'}</div>
                          <div className="col-span-1 flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditPartyForm(p)}
                              className="p-1.5 text-[#3282B8] hover:bg-[#3282B8]/10 rounded-lg transition-all"
                              title="Edit"
                              type="button"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(p._id || p.id, 'party')}
                              className="p-1.5 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                              title="Delete"
                              type="button"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-[#BBE1FA]/30">
                    <div className="text-5xl mb-3">👥</div>
                    <h3 className="text-base font-semibold text-[#1B262C] mb-1">
                      {partySearch ? 'No matching parties found' : 'No parties added'}
                    </h3>
                    <p className="text-sm text-[#6B7280]">
                      {partySearch ? 'Try adjusting your search' : 'Click "Add Party" to add parties to this case'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== ADD PROCEEDING MODAL ===== */}
      <AddProceedingModalInline
        isOpen={showProceedingForm}
        onClose={() => setShowProceedingForm(false)}
        onSave={handleAddProceedingSubmit}
        caseId={caseId}
      />

      {/* ===== ADD COMMENT MODAL ===== */}
      <AddCommentModalInline
        isOpen={showCommentForm}
        onClose={() => setShowCommentForm(false)}
        onSave={handleAddCommentSubmit}
        caseId={caseId}
      />

      {/* ===== ADD PARTY MODAL ===== */}
      <AddPartyModalInline
        isOpen={showAddPartyForm}
        onClose={() => setShowAddPartyForm(false)}
        onSave={handleAddPartySubmit}
        caseId={caseId}
      />

      {/* ===== EDIT PROCEEDING MODAL ===== */}
      {showEditProceedingForm && editingProceeding && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F59E0B]/20">
            <div className="relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FaEdit className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit Proceeding</h3>
                    <p className="text-white/70 text-sm">Update hearing progress</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditProceedingForm(false);
                    setEditingProceeding(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  type="button"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditProceedingSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Created By *
                </label>
                <input
                  type="text"
                  value={editProceedingFormData.createdBy || ''}
                  onChange={(e) => handleEditProceedingFormChange('createdBy', e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  value={editProceedingFormData.date || ''}
                  onChange={(e) => handleEditProceedingFormChange('date', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Progress on Date of Hearing *
                </label>
                <textarea
                  value={editProceedingFormData.progress || ''}
                  onChange={(e) => handleEditProceedingFormChange('progress', e.target.value)}
                  placeholder="Enter progress details..."
                  required
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] resize-none placeholder-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Next Date of Hearing *
                </label>
                <input
                  type="date"
                  value={editProceedingFormData.nextHearingDate || ''}
                  onChange={(e) => handleEditProceedingFormChange('nextHearingDate', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Status of the Case *
                </label>
                <select
                  value={editProceedingFormData.status || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'Others') {
                      setShowEditCustomStatusInput(true);
                      setEditProceedingFormData(prev => ({ ...prev, status: '' }));
                    } else {
                      setShowEditCustomStatusInput(false);
                      setEditProceedingFormData(prev => ({ ...prev, status: value }));
                    }
                  }}
                  required={!showEditCustomStatusInput}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  <option value="">- Select Status -</option>
                  {editStatusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {showEditCustomStatusInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={editCustomStatus || ''}
                      onChange={(e) => setEditCustomStatus(e.target.value)}
                      placeholder="Enter custom status..."
                      className="flex-1 px-4 py-2 border-2 border-[#F59E0B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-[#F8FAFC] text-[#1B262C]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editCustomStatus.trim()) {
                          addEditCustomStatus(editCustomStatus.trim());
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl text-sm font-medium"
                    >
                      <FaPlus className="text-xs" /> Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditCustomStatusInput(false);
                        setEditCustomStatus('');
                        setEditProceedingFormData(prev => ({ ...prev, status: '' }));
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Attachment
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 px-4 py-3 border-2 border-dashed border-[#BBE1FA] rounded-xl cursor-pointer hover:border-[#F59E0B] transition-all duration-200 bg-[#F8FAFC] hover:bg-[#F0F4F8]">
                    <div className="flex items-center justify-center gap-2">
                      <FaFileAlt className="text-[#F59E0B]" />
                      <span className="text-sm text-[#6B7280]">Choose File</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleEditProceedingFormChange('attachment', e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  {editProceedingFormData.attachment ? (
                    <span className="text-sm text-[#F59E0B] font-medium">{editProceedingFormData.attachment}</span>
                  ) : (
                    <span className="text-sm text-[#9CA3AF]">No file chosen</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProceedingForm(false);
                    setEditingProceeding(null);
                    setShowEditCustomStatusInput(false);
                    setEditCustomStatus('');
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Update Proceeding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT COMMENT MODAL ===== */}
      {showEditCommentForm && editingComment && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F59E0B]/20">
            <div className="relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FaEdit className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit Comment</h3>
                    <p className="text-white/70 text-sm">Update comment details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditCommentForm(false);
                    setEditingComment(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  type="button"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditCommentSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Remarks
                </label>
                <textarea
                  value={editCommentFormData.remarks || ''}
                  onChange={(e) => handleEditCommentFormChange('remarks', e.target.value)}
                  placeholder="Enter remarks..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] resize-none placeholder-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Request to Client Department
                </label>
                <select
                  value={editCommentFormData.requestToClientDepartment || ''}
                  onChange={(e) => handleEditCommentFormChange('requestToClientDepartment', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  <option value="">- Select -</option>
                  {[
                    'Attendance of departmental representative required in court.',
                    'Attendance of departmental representative for cross-examination of witnesses.',
                    'Attendance of Departmental representatives for oral evidence.',
                    'In case of transfer/leave/retirement etc. Alternate Departmental Representative.',
                    'Provision of record and assistance from Departmental Representative for arguments.',
                    'Provision of record for documentary evidence. (time limitation)',
                    'Provision of record for preparation of written statement/ reply. (time limitation)'
                  ].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Client Departments
                </label>
                <input
                  type="text"
                  value={editCommentFormData.clientDepartments || ''}
                  onChange={(e) => handleEditCommentFormChange('clientDepartments', e.target.value)}
                  placeholder="Enter client department"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={editCommentFormData.status || 'Pending'}
                  onChange={(e) => handleEditCommentFormChange('status', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  {['Pending', 'In Progress', 'Completed', 'Closed'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={editCommentFormData.date || ''}
                  onChange={(e) => handleEditCommentFormChange('date', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCommentForm(false);
                    setEditingComment(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Update Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT PARTY MODAL ===== */}
      {showEditPartyForm && editingParty && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F59E0B]/20">
            <div className="relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FaEdit className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Edit Party</h3>
                    <p className="text-white/70 text-sm">Update party details</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditPartyForm(false);
                    setEditingParty(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  type="button"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditPartySubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Type *
                </label>
                <select
                  value={editPartyFormData.type || ''}
                  onChange={(e) => handleEditPartyFormChange('type', e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C]"
                >
                  <option value="">- Select Type -</option>
                  {partyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  value={editPartyFormData.name || ''}
                  onChange={(e) => handleEditPartyFormChange('name', e.target.value)}
                  placeholder="Enter party name"
                  required
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  CNIC
                </label>
                <div className="relative">
                  <FaIdCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={editPartyFormData.cnic || ''}
                    onChange={(e) => handleEditPartyFormChange('cnic', e.target.value)}
                    placeholder="XXXXX-XXXXXXX-X"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={editPartyFormData.phone || ''}
                    onChange={(e) => handleEditPartyFormChange('phone', e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={editPartyFormData.email || ''}
                    onChange={(e) => handleEditPartyFormChange('email', e.target.value)}
                    placeholder="party@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-[#9CA3AF]" />
                  <textarea
                    value={editPartyFormData.address || ''}
                    onChange={(e) => handleEditPartyFormChange('address', e.target.value)}
                    placeholder="Enter address"
                    rows="3"
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF] resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
                  Created By
                </label>
                <input
                  type="text"
                  value={editPartyFormData.createdBy || ''}
                  onChange={(e) => handleEditPartyFormChange('createdBy', e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-[#BBE1FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all duration-200 bg-white text-[#1B262C] placeholder-[#9CA3AF]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#BBE1FA]/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditPartyForm(false);
                    setEditingParty(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#1B262C] hover:bg-[#F0F4F8] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl hover:shadow-lg hover:shadow-[#F59E0B]/25 transition-all duration-200 flex items-center gap-2"
                >
                  <FaSave className="text-sm" />
                  Update Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION MODAL ===== */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
          setDeleteTargetType('');
        }}
        onConfirm={handleDeleteConfirmed}
        title={`Delete ${deleteTargetType}?`}
        message={`Are you sure you want to delete this ${deleteTargetType}? This action cannot be undone.`}
      />

      {/* ===== PROCEEDING DETAIL MODAL ===== */}
      {showProceedingDetail && selectedProceeding && (
        <div className="fixed inset-0 z-[100] bg-[#1B262C]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#3282B8]/20">
            <div className="relative bg-gradient-to-r from-[#0F4C75] to-[#3282B8] px-6 py-5 rounded-t-3xl">
              <div className="absolute inset-0 bg-white/5 rounded-t-3xl"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <GiJusticeStar className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Proceeding Details</h3>
                    <p className="text-white/70 text-sm">{selectedProceeding.date ? new Date(selectedProceeding.date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProceedingDetail(false);
                    setSelectedProceeding(null);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  type="button"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getProceedingStatusColor(selectedProceeding.status)}`}>
                  {selectedProceeding.status || 'N/A'}
                </span>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Progress</p>
                <p className="text-sm text-[#1B262C] mt-1">{selectedProceeding.progress || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Created By</p>
                  <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.createdBy || 'N/A'}</p>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Date</p>
                  <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.date ? new Date(selectedProceeding.date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="md:col-span-2 bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Next Hearing Date</p>
                  <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.nextHearingDate ? new Date(selectedProceeding.nextHearingDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                {selectedProceeding.attachment && (
                  <div className="md:col-span-2 bg-[#F8FAFC] rounded-xl p-4 border border-[#BBE1FA]/30">
                    <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Attachment</p>
                    <p className="text-sm font-semibold text-[#1B262C]">{selectedProceeding.attachment}</p>
                    <button
                      onClick={(e) => handleViewAttachment({
                        fileName: selectedProceeding.attachment,
                        fileUrl: selectedProceeding.attachmentUrl || `/uploads/${selectedProceeding.attachment}`,
                        description: 'Proceeding Attachment'
                      }, e)}
                      className="mt-2 px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-lg hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200 flex items-center gap-1"
                      type="button"
                    >
                      <FaEye className="text-xs" /> View Attachment
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setShowProceedingDetail(false);
                    setSelectedProceeding(null);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#0F4C75]/25 transition-all duration-200"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW ATTACHMENT MODAL ===== */}
      <ViewAttachmentModal
        isOpen={viewAttachmentModal}
        onClose={() => {
          setViewAttachmentModal(false);
          setSelectedAttachment(null);
        }}
        attachment={selectedAttachment}
      />

      {/* ===== CLOSE POPUP ===== */}
      {showClosePopup && (
        <div 
          className="fixed inset-0 bg-[#1B262C]/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelClose();
            }
          }}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#0F4C75]/10 flex items-center justify-center mx-auto mb-4">
                <FaQuestionCircle className="text-[#0F4C75] text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-[#1B262C] mb-2">Close Case View</h3>
              <p className="text-[#6B7280] text-sm mb-6">Are you sure you want to close this case view?</p>
              <div className="flex gap-3">
                <button 
                  onClick={cancelClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B7280] bg-[#F0F4F8] rounded-xl hover:bg-[#E5E7EB] transition-all"
                  type="button"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#0F4C75] rounded-xl hover:bg-[#1B262C] transition-all flex items-center justify-center gap-2"
                  type="button"
                >
                  <FaCheck className="text-sm" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseDetailModal;