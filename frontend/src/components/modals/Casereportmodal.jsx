// src/components/modals/CaseReportModal.jsx
import React, { useRef, useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaDownload, 
  FaPlusCircle, 
  FaFilePdf, 
  FaFileWord, 
  FaChevronDown, 
  FaSpinner,
  FaPrint
} from 'react-icons/fa';
import { GiScales } from 'react-icons/gi';
import toast from 'react-hot-toast';

// ============================================
// Field helpers - ONLY 6 FIELDS
// ============================================
const getCourtName = (c) => c?.nameOfCourt || c?.courtDetails?.courtName || c?.courtName || 'N/A';
const getNatureOfCase = (c) => c?.natureOfCase || c?.caseType || c?.natureOfSuit || 'N/A';

const formatDateLong = (dateStr) => {
  if (!dateStr) return 'Not scheduled';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const getNextHearingDate = (c) => {
  const date = c?.nextDateOfHearing || c?.nextHearing || c?.nexthearing || c?.courtDetails?.nextDate;
  return formatDateLong(date);
};

const CaseReportModal = ({ isOpen, onClose, caseData, onAddHearing }) => {
  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const reportRef = useRef(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // ✅ useEffect - Called unconditionally
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDownloadOptions && !e.target.closest('.download-dropdown-container')) {
        setShowDownloadOptions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDownloadOptions]);

  // ✅ Conditional return AFTER all hooks
  if (!isOpen || !caseData) return null;

  const generatedOn = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // ============================================
  // GENERATE REPORT CONTENT
  // ============================================
  const generateReportContent = () => {
    if (!reportRef.current) return null;
    return reportRef.current.innerHTML;
  };

  // ============================================
  // GENERATE FULL HTML REPORT
  // ============================================
  const generateFullHTML = () => {
    const content = generateReportContent();
    if (!content) return null;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Case Report - ${caseData.caseNumber || 'N/A'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      background: #ffffff;
      color: #000000;
      padding: 40px;
      max-width: 210mm;
      margin: 0 auto;
      line-height: 1.5;
    }
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .report-brand { display: flex; align-items: center; gap: 10px; }
    .report-brand-icon { font-size: 28px; }
    .report-brand-name { font-size: 20px; font-weight: 700; }
    .report-brand-tag { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #555; }
    .report-header-right { text-align: right; }
    .report-doc-title { font-size: 15px; font-weight: 700; letter-spacing: 0.08em; }
    .report-doc-date { font-size: 10.5px; color: #444; margin-top: 2px; }
    
    .report-section { margin-bottom: 16px; }
    .report-section-title {
      font-size: 12.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid #000000;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }
    
    .report-kv-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    .report-kv-table td { padding: 4px 6px; vertical-align: top; border-bottom: 1px solid #eee; }
    .kv-label { width: 18%; color: #555; font-weight: 600; white-space: nowrap; }
    .kv-value { width: 32%; font-weight: 500; }
    .vs-sep { font-weight: 700; margin: 0 4px; }
    
    .report-footer {
      display: flex;
      justify-content: space-between;
      font-size: 9.5px;
      color: #666;
      border-top: 1px solid #000000;
      padding-top: 8px;
      margin-top: 16px;
    }
    .report-disclaimer {
      font-size: 8.5px;
      color: #888;
      margin-top: 6px;
      line-height: 1.4;
      font-style: italic;
      border-top: 1px solid #eee;
      padding-top: 8px;
    }
    
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
    `;
  };

  // ============================================
  // ✅ DOWNLOAD AS PDF (.pdf) - Using jsPDF
  // ============================================
  const downloadAsPDF = async () => {
    setIsDownloading(true);
    
    try {
      const content = generateFullHTML();
      if (!content) {
        toast.error('Report content not available');
        setIsDownloading(false);
        return;
      }

      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(content);
      iframeDoc.close();

      // Wait for content to load then print
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          // Clean up after print
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            setIsDownloading(false);
            setShowDownloadOptions(false);
            toast.success('✅ PDF saved successfully!');
          }, 2000);
        } catch (err) {
          console.error('Print error:', err);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          setIsDownloading(false);
          toast.error('Please allow popups and try again');
        }
      }, 500);

    } catch (error) {
      console.error('PDF download error:', error);
      toast.error('Failed to generate PDF');
      setIsDownloading(false);
    }
  };

  // ============================================
  // ✅ DOWNLOAD AS WORD (.docx) - Using Blob
  // ============================================
  const downloadAsWord = () => {
    setIsDownloading(true);
    
    try {
      const content = generateReportContent();
      if (!content) {
        toast.error('Report content not available');
        setIsDownloading(false);
        return;
      }

      // Create Word document with proper formatting
      const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="UTF-8">
  <title>Case Report - ${caseData.caseNumber || 'N/A'}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { 
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      margin: 40px;
      line-height: 1.5;
    }
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .report-brand { display: flex; align-items: center; gap: 10px; }
    .report-brand-name { font-size: 20pt; font-weight: 700; }
    .report-brand-tag { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.08em; color: #555; }
    .report-header-right { text-align: right; }
    .report-doc-title { font-size: 15pt; font-weight: 700; letter-spacing: 0.08em; }
    .report-doc-date { font-size: 10.5pt; color: #444; margin-top: 2px; }
    
    .report-section { margin-bottom: 16px; }
    .report-section-title {
      font-size: 12.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid #000000;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }
    
    .report-kv-table { width: 100%; border-collapse: collapse; font-size: 11.5pt; }
    .report-kv-table td { padding: 4px 6px; vertical-align: top; border-bottom: 1px solid #eee; }
    .kv-label { width: 18%; color: #555; font-weight: 600; white-space: nowrap; }
    .kv-value { width: 32%; font-weight: 500; }
    .vs-sep { font-weight: 700; margin: 0 4px; }
    
    .report-footer {
      display: flex;
      justify-content: space-between;
      font-size: 9.5pt;
      color: #666;
      border-top: 1px solid #000000;
      padding-top: 8px;
      margin-top: 16px;
    }
    .report-disclaimer {
      font-size: 8.5pt;
      color: #888;
      margin-top: 6px;
      line-height: 1.4;
      font-style: italic;
      border-top: 1px solid #eee;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
      `;

      // Create blob with proper MIME type for Word
      const blob = new Blob([wordContent], { 
        type: 'application/msword;charset=utf-8' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Case_Report_${caseData.caseNumber || 'case'}_${new Date().toISOString().split('T')[0]}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      toast.success('✅ Word document downloaded!');
      setShowDownloadOptions(false);
      setIsDownloading(false);
    } catch (error) {
      console.error('Word download error:', error);
      toast.error('Failed to generate Word document');
      setIsDownloading(false);
    }
  };

  // ============================================
  // TOGGLE DOWNLOAD OPTIONS
  // ============================================
  const toggleDownloadOptions = () => {
    setShowDownloadOptions(!showDownloadOptions);
  };

  // ============================================
  // DOWNLOAD OPTIONS - ONLY PDF & WORD
  // ============================================
  const downloadOptions = [
    { 
      id: 'pdf', 
      label: 'PDF Document', 
      icon: FaFilePdf, 
      color: 'text-red-500',
      bg: 'hover:bg-red-50',
      action: downloadAsPDF,
      description: 'Save as PDF (.pdf)'
    },
    { 
      id: 'word', 
      label: 'Word Document', 
      icon: FaFileWord, 
      color: 'text-blue-500',
      bg: 'hover:bg-blue-50',
      action: downloadAsWord,
      description: 'Microsoft Word (.doc)'
    }
  ];

  return (
    <React.Fragment>
      <div className="report-overlay no-print" onClick={onClose} />

      <div className="report-viewport no-print">
        <div className="report-toolbar">
          <div className="report-toolbar-left">
            <div className="report-toolbar-icon">
              <GiScales />
            </div>
            <div>
              <p className="report-toolbar-title">Case Detail Report</p>
              <p className="report-toolbar-sub">#{caseData.caseNumber || 'N/A'}</p>
            </div>
          </div>
          <div className="report-toolbar-actions">
            {onAddHearing && (
              <button className="report-btn report-btn-primary" onClick={() => onAddHearing(caseData)}>
                <FaPlusCircle /> Add Hearing
              </button>
            )}
            
            {/* Download Button with Dropdown - ONLY PDF & WORD */}
            <div className="download-dropdown-container relative">
              <button 
                className="report-btn report-btn-primary flex items-center gap-2" 
                onClick={toggleDownloadOptions}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaDownload />
                )}
                {isDownloading ? 'Generating...' : 'Download'} 
                <FaChevronDown className={`text-xs transition-transform duration-200 ${showDownloadOptions ? 'rotate-180' : ''}`} />
              </button>
              
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-[#3282B8]/30 overflow-hidden">
                  {downloadOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setShowDownloadOptions(false);
                        option.action();
                      }}
                      disabled={isDownloading}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1B262C] ${option.bg} transition-all duration-200 border-b border-[#BBE1FA]/30 last:border-0 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F0F4F8] flex items-center justify-center flex-shrink-0">
                        <option.icon className={`text-lg ${option.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-[#6B7280]">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="report-btn report-btn-close" onClick={onClose}>
              <FaTimes /> Close
            </button>
          </div>
        </div>

        <div className="report-page-wrap">
          <div id="case-report-a4" className="report-page" ref={reportRef}>

            {/* Header */}
            <div className="report-header">
              <div className="report-brand">
                <GiScales className="report-brand-icon" />
                <div>
                  <div className="report-brand-name">JurisFlow</div>
                  <div className="report-brand-tag">Legal Case Management System</div>
                </div>
              </div>
              <div className="report-header-right">
                <div className="report-doc-title">CASE DETAIL REPORT</div>
                <div className="report-doc-date">Generated: {generatedOn}</div>
              </div>
            </div>
            <div className="report-hr thick" />

            {/* Case Information - ONLY 6 FIELDS */}
            <div className="report-section">
              <div className="report-section-title">Case Information</div>
              <table className="report-kv-table">
                <tbody>
                  <tr>
                    <td className="kv-label">Case Number</td>
                    <td className="kv-value">#{caseData.caseNumber || 'N/A'}</td>
                    <td className="kv-label">Title of the Case</td>
                    <td className="kv-value">{caseData.caseTitle || caseData.title || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="kv-label">Plaintiff VS Defendant</td>
                    <td className="kv-value" colSpan={3}>
                      {caseData.plaintiff || 'N/A'} <span className="vs-sep">VS</span> {caseData.defendant || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="kv-label">Name of the Court</td>
                    <td className="kv-value">{getCourtName(caseData)}</td>
                    <td className="kv-label">Nature of the Case</td>
                    <td className="kv-value">{getNatureOfCase(caseData)}</td>
                  </tr>
                  <tr>
                    <td className="kv-label">Date of Hearing</td>
                    <td className="kv-value" colSpan={3}>{getNextHearingDate(caseData)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="report-hr" />
            <div className="report-footer">
              <span>Report generated by JurisFlow &middot; {generatedOn}</span>
              <span>Page 1</span>
            </div>
            <div className="report-disclaimer">
              This is a system-generated document intended for internal reference only.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .report-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 300;
        }
        .report-viewport {
          position: fixed;
          inset: 0;
          z-index: 301;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
        }
        .report-toolbar {
          position: sticky;
          top: 0;
          z-index: 5;
          width: 100%;
          max-width: 900px;
          margin: 0 auto 10px;
          background: #1B262C;
          border: 1px solid #3282B8;
          border-radius: 12px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          flex-wrap: wrap;
          gap: 8px;
        }
        .report-toolbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
        }
        .report-toolbar-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #3282B8;
        }
        .report-toolbar-title { font-size: 14px; font-weight: 700; margin: 0; color: #fff; }
        .report-toolbar-sub { font-size: 11px; margin: 0; color: rgba(255,255,255,0.6); }
        .report-toolbar-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .report-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .report-btn:hover { background: rgba(255,255,255,0.2); }
        .report-btn-primary { background: #3282B8; color: #fff; }
        .report-btn-primary:hover { background: #0F4C75; }
        .report-btn-close { background: rgba(255,0,0,0.2); }
        .report-btn-close:hover { background: rgba(255,0,0,0.3); }

        .download-dropdown-container {
          position: relative;
        }
        .download-dropdown-container .absolute {
          animation: slideDown 0.2s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .report-page-wrap {
          padding: 10px 0 40px;
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .report-page {
          width: 210mm;
          min-height: 297mm;
          background: #ffffff;
          color: #000000;
          font-family: 'Times New Roman', Times, serif;
          padding: 18mm 16mm;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          box-sizing: border-box;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }
        .report-brand { display: flex; align-items: center; gap: 10px; }
        .report-brand-icon { font-size: 28px; color: #000000; }
        .report-brand-name { font-size: 20px; font-weight: 700; letter-spacing: 0.5px; color: #000000; }
        .report-brand-tag { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; }
        .report-header-right { text-align: right; }
        .report-doc-title { font-size: 15px; font-weight: 700; letter-spacing: 0.08em; color: #000000; }
        .report-doc-date { font-size: 10.5px; color: #444; margin-top: 2px; }

        .report-hr { border-top: 1px solid #999; margin: 10px 0; }
        .report-hr.thick { border-top: 2px solid #000000; margin: 10px 0 16px; }

        .report-section { margin-bottom: 16px; }
        .report-section-title {
          font-size: 12.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #000000;
          border-bottom: 1px solid #000000;
          padding-bottom: 3px;
          margin-bottom: 8px;
        }

        .report-kv-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
        .report-kv-table td { padding: 4px 6px; vertical-align: top; border-bottom: 1px solid #eee; }
        .kv-label { width: 18%; color: #555; font-weight: 600; white-space: nowrap; }
        .kv-value { width: 32%; font-weight: 500; color: #000000; }
        .vs-sep { color: #000000; font-weight: 700; margin: 0 4px; }

        .report-footer {
          display: flex;
          justify-content: space-between;
          font-size: 9.5px;
          color: #555;
          border-top: 1px solid #000000;
          padding-top: 8px;
          margin-top: 16px;
        }
        .report-disclaimer {
          font-size: 8.5px;
          color: #888;
          margin-top: 6px;
          line-height: 1.4;
          font-style: italic;
          border-top: 1px solid #eee;
          padding-top: 8px;
        }

        @media print {
          .no-print, .report-overlay, .report-toolbar { display: none !important; }
          .report-viewport {
            position: static !important;
            overflow: visible !important;
            padding: 0 !important;
          }
          .report-page-wrap { padding: 0 !important; }
          .report-page {
            width: 210mm;
            min-height: 297mm;
            box-shadow: none !important;
            margin: 0;
            padding: 14mm 14mm;
          }
        }

        .report-viewport::-webkit-scrollbar {
          width: 6px;
        }
        .report-viewport::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .report-viewport::-webkit-scrollbar-thumb {
          background: #3282B8;
          border-radius: 3px;
        }
      `}</style>
    </React.Fragment>
  );
};

export default CaseReportModal;