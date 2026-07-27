// src/components/modals/AddCaseModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  FaTimes, FaPaperclip, FaFileAlt, FaUpload, FaTrash, FaPlus,
  FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFile,
  FaEdit, FaEye, FaDownload, FaPrint, FaUser, FaBuilding, FaPhone, FaMapMarkerAlt,
  FaChevronDown
} from 'react-icons/fa';

// ===== COMBOBOX COMPONENT =====
const Combobox = ({ options, value, onChange, placeholder, label, required, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredOptions(
        options.filter(opt => 
          opt.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    onChange(option);
    setSearchTerm(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 pr-10"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FaChevronDown className={`text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectOption(option)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[#3282B8]/10 transition-colors ${
                value === option ? 'bg-[#3282B8]/10 text-[#0F4C75] font-medium' : 'text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-500">
          No options found. Press Enter to add "{searchTerm}"
        </div>
      )}
    </div>
  );
};

// ===== FILE ICON HELPER =====
const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const iconClass = "mt-0.5 flex-shrink-0";
  
  switch(extension) {
    case 'pdf':
      return <FaFilePdf className={`${iconClass} text-red-500`} />;
    case 'doc':
    case 'docx':
      return <FaFileWord className={`${iconClass} text-blue-500`} />;
    case 'xls':
    case 'xlsx':
      return <FaFileExcel className={`${iconClass} text-green-500`} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <FaFileImage className={`${iconClass} text-purple-500`} />;
    default:
      return <FaFile className={`${iconClass} text-gray-500`} />;
  }
};

// ===== MAIN MODAL =====
const AddCaseModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    division: '',
    district: '',
    caseNumber: '',
    titleOfCase: '',
    plaintiff: '',
    defendant: '',
    nameOfCourt: '',
    natureOfCase: '',
    nextDateOfHearing: '',
    copyOfSummon: null,
    copyOfSummonName: '',
    copyOfPlaint: null,
    copyOfPlaintName: '',
    relevantDepartmentalRecord: null,
    relevantDepartmentalRecordName: '',
    writtenStatements: [],
    lawOfficer: {
      type: 'Department Representative',
      name: '',
      designation: '',
      officeAddress: '',
      officialNumber: '',
      cellNumber: '',
    },
    alternateLawOfficer: {
      type: 'Department Representative',
      name: '',
      designation: '',
      officeAddress: '',
      officialNumber: '',
      cellNumber: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showStatementEditor, setShowStatementEditor] = useState(false);
  const [editingStatementId, setEditingStatementId] = useState(null);
  const [statementTitle, setStatementTitle] = useState('');
  const [statementContent, setStatementContent] = useState('');
  const [statementFile, setStatementFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const statementFileInputRef = useRef(null);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  // ===== GENERATE UNIQUE CASE NUMBER =====
  const generateUniqueCaseNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}-CV-${random}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLawOfficerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      lawOfficer: {
        ...prev.lawOfficer,
        [name]: value
      }
    }));
  };

  const handleAlternateLawOfficerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      alternateLawOfficer: {
        ...prev.alternateLawOfficer,
        [name]: value
      }
    }));
  };

  // ===== ATTACHMENT HANDLERS =====
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const fileNames = {
        summon: 'Copy of summon/Notices/Request to defend',
        plaint: 'Copy of plaint / petition',
        departmental: 'Relevant Departmental Record',
        other: file.name
      };
      
      const nameKey = {
        summon: 'copyOfSummonName',
        plaint: 'copyOfPlaintName',
        departmental: 'relevantDepartmentalRecordName'
      };
      
      const fileKey = {
        summon: 'copyOfSummon',
        plaint: 'copyOfPlaint',
        departmental: 'relevantDepartmentalRecord'
      };
      
      setFormData(prev => ({
        ...prev,
        [fileKey[type]]: file,
        [nameKey[type]]: file.name
      }));
      
      toast.success(`${fileNames[type] || file.name} uploaded!`);
    }
    e.target.value = '';
  };

  // ===== WRITTEN STATEMENT HANDLERS =====
  const handleOpenStatementEditor = (statement = null) => {
    if (statement) {
      setEditingStatementId(statement.id);
      setStatementTitle(statement.title || '');
      setStatementContent(statement.content || '');
      setStatementFile(null);
    } else {
      setEditingStatementId(null);
      setStatementTitle('');
      setStatementContent('');
      setStatementFile(null);
    }
    setShowStatementEditor(true);
  };

  const handleStatementFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach((file, index) => {
        const statementData = {
          id: generateId() + index,
          title: file.name.replace(/\.[^/.]+$/, ""),
          content: '',
          file: file,
          fileName: file.name,
          fileSize: file.size,
          createdAt: new Date().toISOString(),
        };
        
        setFormData(prev => ({
          ...prev,
          writtenStatements: [...prev.writtenStatements, statementData]
        }));
      });
      
      toast.success(`${files.length} statement file(s) uploaded!`);
    }
    e.target.value = '';
  };

  const handleSaveStatement = () => {
    if (!statementTitle.trim()) {
      toast.error('Please enter a title for the statement');
      return;
    }

    if (!statementContent.trim() && !statementFile) {
      toast.error('Please enter content or select a file');
      return;
    }

    const statementData = {
      id: editingStatementId || generateId(),
      title: statementTitle.trim(),
      content: statementContent.trim(),
      file: statementFile || null,
      fileName: statementFile?.name || '',
      fileSize: statementFile?.size || 0,
      createdAt: new Date().toISOString(),
    };

    if (editingStatementId) {
      setFormData(prev => ({
        ...prev,
        writtenStatements: prev.writtenStatements.map(s => 
          s.id === editingStatementId ? statementData : s
        )
      }));
      toast.success('Statement updated successfully!');
    } else {
      setFormData(prev => ({
        ...prev,
        writtenStatements: [...prev.writtenStatements, statementData]
      }));
      toast.success('Statement added successfully!');
    }

    setShowStatementEditor(false);
    setEditingStatementId(null);
    setStatementTitle('');
    setStatementContent('');
    setStatementFile(null);
    if (statementFileInputRef.current) {
      statementFileInputRef.current.value = '';
    }
  };

  const handleRemoveStatement = (id) => {
    setFormData(prev => ({
      ...prev,
      writtenStatements: prev.writtenStatements.filter(s => s.id !== id)
    }));
    toast.success('Statement removed');
  };

  // ===== STATEMENT VIEW/DOWNLOAD/PRINT =====
  const handleViewStatement = (statement) => {
    if (statement.file) {
      const url = URL.createObjectURL(statement.file);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else if (statement.content) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${statement.title || 'Written Statement'}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 40px; 
                  line-height: 1.8; 
                  max-width: 800px; 
                  margin: 0 auto; 
                }
                h1 { color: #0F4C75; border-bottom: 2px solid #0F4C75; padding-bottom: 10px; }
                .content { white-space: pre-wrap; word-wrap: break-word; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8; }
                .meta { color: #6B7280; font-size: 12px; margin-top: 10px; border-top: 1px solid #E5E7EB; padding-top: 10px; }
              </style>
            </head>
            <body>
              <h1>${statement.title || 'Written Statement'}</h1>
              <hr/>
              <div class="content">${statement.content}</div>
              <div class="meta">
                <p>Created: ${new Date(statement.createdAt).toLocaleDateString()}</p>
                <p>Words: ${statement.content.trim().split(/\s+/).filter(w => w).length}</p>
                <p>Characters: ${statement.content.length}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownloadStatement = (statement) => {
    if (statement.file) {
      const url = URL.createObjectURL(statement.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = statement.fileName || 'statement';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast.success(`Downloading: ${statement.fileName}`);
    } else if (statement.content) {
      const content = `
        Title: ${statement.title || 'Written Statement'}
        Date: ${new Date(statement.createdAt).toLocaleDateString()}
        ${'='.repeat(50)}
        
        ${statement.content}
        
        ${'='.repeat(50)}
        Words: ${statement.content.trim().split(/\s+/).filter(w => w).length}
        Characters: ${statement.content.length}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${statement.title || 'written-statement'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      toast.success('Downloading written statement');
    }
  };

  const handlePrintStatement = (statement) => {
    if (statement.file) {
      const url = URL.createObjectURL(statement.file);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else if (statement.content) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${statement.title || 'Written Statement'} - Print</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  padding: 40px; 
                  line-height: 1.8; 
                  max-width: 800px; 
                  margin: 0 auto; 
                }
                h1 { color: #0F4C75; border-bottom: 2px solid #0F4C75; padding-bottom: 10px; }
                .content { white-space: pre-wrap; word-wrap: break-word; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.8; }
                .meta { color: #6B7280; font-size: 12px; margin-top: 10px; border-top: 1px solid #E5E7EB; padding-top: 10px; }
              </style>
            </head>
            <body>
              <h1>${statement.title || 'Written Statement'}</h1>
              <hr/>
              <div class="content">${statement.content}</div>
              <div class="meta">
                <p>Created: ${new Date(statement.createdAt).toLocaleDateString()}</p>
                <p>Words: ${statement.content.trim().split(/\s+/).filter(w => w).length}</p>
                <p>Characters: ${statement.content.length}</p>
              </div>
              <script>
                window.onload = function() { window.print(); }
              <\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.division) {
      toast.error('Please enter Division');
      return;
    }
    if (!formData.district) {
      toast.error('Please enter District');
      return;
    }
    if (!formData.caseNumber) {
      toast.error('Please enter Case Number');
      return;
    }
    if (!formData.titleOfCase) {
      toast.error('Please enter Title of the Case');
      return;
    }
    if (!formData.plaintiff) {
      toast.error('Please enter Plaintiff');
      return;
    }
    if (!formData.defendant) {
      toast.error('Please enter Defendant');
      return;
    }
    if (!formData.nameOfCourt) {
      toast.error('Please enter Name of the Court');
      return;
    }
    if (!formData.natureOfCase) {
      toast.error('Please enter Nature of the Case');
      return;
    }
    if (!formData.nextDateOfHearing) {
      toast.error('Please select Next Date of Hearing');
      return;
    }

    setLoading(true);
    
    try {
      const attachmentsObj = formData.attachments || {};
      const attachmentsCount = Object.values(attachmentsObj).filter(v => v).length;
      
      const statementsData = formData.writtenStatements.map(s => ({
        title: s.title,
        content: s.content || '',
        fileName: s.fileName || '',
        fileSize: s.fileSize || 0,
        createdAt: s.createdAt,
      }));

      // ✅ Get current timestamp
      const now = new Date().toISOString();

      const submitData = {
        division: formData.division,
        district: formData.district,
        caseNumber: formData.caseNumber,
        status: 'active',
        caseTitle: formData.titleOfCase,
        title: formData.titleOfCase,
        plaintiff: formData.plaintiff,
        defendant: formData.defendant,
        courtName: formData.nameOfCourt,
        courtDetails: {
          courtName: formData.nameOfCourt,
          district: formData.district,
          nextDate: formData.nextDateOfHearing,
        },
        caseNature: {
          trial: formData.natureOfCase,
        },
        nextDate: formData.nextDateOfHearing,
        nexthearing: formData.nextDateOfHearing,
        attachments: {
          copyOfSummon: formData.copyOfSummonName || '',
          copyOfPlaint: formData.copyOfPlaintName || '',
          relevantDepartmentalRecord: formData.relevantDepartmentalRecordName || '',
        },
        documents: formData.attachments || {},
        documentsCount: attachmentsCount,
        writtenStatements: statementsData,
        lawOfficer: formData.lawOfficer,
        alternateLawOfficer: formData.alternateLawOfficer,
        party: 'N/A',
        caseType: 'Civil',
        priority: 'Medium',
        amount: 'N/A',
        judge: 'N/A',
        assignedTo: 'N/A',
        hearings: 0,
        date: new Date().toISOString().split('T')[0],
        // ✅ NEW BADGE TRACKING FIELDS - Professional
        createdAt: now,
        isNew: true,
        viewedAt: null,
      };

      console.log('📤 Submitting new case:', submitData);
      
      const result = await onAdd(submitData);
      console.log('📦 Add result:', result);
      
      if (result.success) {
        toast.success('Case added successfully!');
        resetForm();
        onClose();
      } else {
        toast.error(result.error || 'Failed to add case');
      }
    } catch (error) {
      console.error('❌ Add case error:', error);
      
      if (error.message && error.message.includes('E11000 duplicate key error')) {
        const newCaseNumber = generateUniqueCaseNumber();
        toast.error(`Case number "${formData.caseNumber}" already exists. Please use a different case number.`);
        setFormData(prev => ({ ...prev, caseNumber: newCaseNumber }));
      } else {
        toast.error(error.message || 'Failed to add case');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      division: '',
      district: '',
      caseNumber: '',
      titleOfCase: '',
      plaintiff: '',
      defendant: '',
      nameOfCourt: '',
      natureOfCase: '',
      nextDateOfHearing: '',
      copyOfSummon: null,
      copyOfSummonName: '',
      copyOfPlaint: null,
      copyOfPlaintName: '',
      relevantDepartmentalRecord: null,
      relevantDepartmentalRecordName: '',
      writtenStatements: [],
      lawOfficer: {
        type: 'Department Representative',
        name: '',
        designation: '',
        officeAddress: '',
        officialNumber: '',
        cellNumber: '',
      },
      alternateLawOfficer: {
        type: 'Department Representative',
        name: '',
        designation: '',
        officeAddress: '',
        officialNumber: '',
        cellNumber: '',
      },
    });
    setSelectedFiles([]);
    setShowStatementEditor(false);
    setEditingStatementId(null);
    setStatementTitle('');
    setStatementContent('');
    setStatementFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (statementFileInputRef.current) {
      statementFileInputRef.current.value = '';
    }
  };

  // ✅ CRITICAL: This must be here - prevents rendering when closed
  if (!isOpen) return null;

  // ===== DROPDOWN OPTIONS =====
  const lawOfficerTypes = [
    'Department Representative',
    'Law Officer',
    'Government Pleader',
    'Assistant Attorney General',
    'Deputy Attorney General'
  ];

  const divisionOptions = [
    'Lahore',
    'Gujranwala',
    'Rawalpindi',
    'Multan',
    'Faisalabad',
    'Sahiwal',
    'Sargodha',
    'Bahawalpur',
    'Dera Ghazi Khan'
  ];

  const districtOptions = [
    'Lahore',
    'Sheikhupura',
    'Kasur',
    'Nankana Sahib',
    'Gujranwala',
    'Sialkot',
    'Gujrat',
    'Mandi Bahauddin',
    'Hafizabad',
    'Rawalpindi',
    'Attock',
    'Jhelum',
    'Chakwal',
    'Multan',
    'Khanewal',
    'Vehari',
    'Lodhran',
    'Faisalabad',
    'Toba Tek Singh',
    'Jhang',
    'Chiniot',
    'Sahiwal',
    'Okara',
    'Pakpattan',
    'Sargodha',
    'Khushab',
    'Bhakkar',
    'Mianwali'
  ];

  const courtOptions = [
    'Civil Judge 1st Class',
    'Civil Judge 2nd Class',
    'Civil Judge 3rd Class',
    'Additional District Judge',
    'District Judge',
    'Session Judge',
    'High Court',
    'Supreme Court',
    'Family Court',
    'Labour Court'
  ];

  const natureOfCaseOptions = [
    'Suit for declaration',
    'Suit for recovery',
    'Suit for possession',
    'Suit for injunction',
    'Suit for damages',
    'Criminal case',
    'Civil appeal',
    'Constitutional petition',
    'Writ petition',
    'Family case',
    'Labour dispute'
  ];

  const titleOfCaseOptions = [
    'Plaintiff(s)',
    'Defendant(s)',
    'Appellant(s)',
    'Respondent(s)',
    'Petitioner(s)'
  ];

  const plaintiffOptions = [
    'Zubaida Bibi',
    'Smith',
    'Williams',
    'Ali',
    'Ahmed',
    'Fatima',
    'Muhammad',
    'Khan'
  ];

  const defendantOptions = [
    'Province of Punjab',
    'Government',
    'State',
    'Corporation',
    'Company',
    'Federation'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 overflow-hidden">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Case</h2>
                <p className="text-sm text-gray-500">Fill in the case details below</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6 max-h-[calc(100vh-180px)] overflow-y-auto">
            <form id="addCaseForm" onSubmit={handleSubmit} className="space-y-4">
              
              {/* ===== DIVISION & DISTRICT ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Combobox
                    label="Division *"
                    value={formData.division}
                    onChange={(val) => setFormData(prev => ({ ...prev, division: val }))}
                    placeholder="e.g. Lahore"
                    options={divisionOptions}
                  />
                </div>
                <div>
                  <Combobox
                    label="District *"
                    value={formData.district}
                    onChange={(val) => setFormData(prev => ({ ...prev, district: val }))}
                    placeholder="e.g. Sheikhupura"
                    options={districtOptions}
                  />
                </div>
              </div>

              {/* ===== CASE NUMBER ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Number *
                </label>
                <input
                  type="text"
                  name="caseNumber"
                  value={formData.caseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                  placeholder="e.g. 173073822"
                />
              </div>

              {/* ===== TITLE OF THE CASE ===== */}
              <div>
                <Combobox
                  label="Title of the Case *"
                  value={formData.titleOfCase}
                  onChange={(val) => setFormData(prev => ({ ...prev, titleOfCase: val }))}
                  placeholder="e.g. Plaintiff(s)"
                  options={titleOfCaseOptions}
                />
              </div>

              {/* ===== PLAINTIFF VS DEFENDANT ===== */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plaintiff *</label>
                    <input
                      type="text"
                      name="plaintiff"
                      value={formData.plaintiff}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                      placeholder="e.g. Ali"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700 tracking-wider">VS</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Defendant *</label>
                    <input
                      type="text"
                      name="defendant"
                      value={formData.defendant}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                      placeholder="e.g. Zain"
                    />
                  </div>
                </div>
              </div>

              {/* ===== NAME OF THE COURT ===== */}
              <div>
                <Combobox
                  label="Name of the Court *"
                  value={formData.nameOfCourt}
                  onChange={(val) => setFormData(prev => ({ ...prev, nameOfCourt: val }))}
                  placeholder="e.g. Civil Judge 2nd Class"
                  options={courtOptions}
                />
              </div>

              {/* ===== NATURE OF THE CASE ===== */}
              <div>
                <Combobox
                  label="Nature of the Case *"
                  value={formData.natureOfCase}
                  onChange={(val) => setFormData(prev => ({ ...prev, natureOfCase: val }))}
                  placeholder="e.g. Suit for recovery"
                  options={natureOfCaseOptions}
                />
              </div>

              {/* ===== NEXT DATE OF HEARING ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Date of Hearing *
                </label>
                <input
                  type="date"
                  name="nextDateOfHearing"
                  value={formData.nextDateOfHearing}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                />
              </div>

              {/* ===== COPY OF SUMMON/NOTICES/REQUEST TO DEFEND ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copy of summon/Notices/Request to defend
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('summonUpload').click()}
                    className="px-4 py-2.5 bg-[#0F4C75] text-white rounded-lg hover:bg-[#1B262C] transition-all duration-200 flex items-center gap-2 text-sm shadow-sm shadow-[#0F4C75]/20"
                  >
                    <FaUpload className="text-xs" /> Choose File
                  </button>
                  <input
                    id="summonUpload"
                    type="file"
                    onChange={(e) => handleFileSelect(e, 'summon')}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.copyOfSummonName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* ===== COPY OF PLAINT / PETITION ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copy of plaint / petition
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('plaintUpload').click()}
                    className="px-4 py-2.5 bg-[#0F4C75] text-white rounded-lg hover:bg-[#1B262C] transition-all duration-200 flex items-center gap-2 text-sm shadow-sm shadow-[#0F4C75]/20"
                  >
                    <FaUpload className="text-xs" /> Choose File
                  </button>
                  <input
                    id="plaintUpload"
                    type="file"
                    onChange={(e) => handleFileSelect(e, 'plaint')}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.copyOfPlaintName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* ===== RELEVANT DEPARTMENTAL RECORD ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Departmental Record
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById('departmentalUpload').click()}
                    className="px-4 py-2.5 bg-[#0F4C75] text-white rounded-lg hover:bg-[#1B262C] transition-all duration-200 flex items-center gap-2 text-sm shadow-sm shadow-[#0F4C75]/20"
                  >
                    <FaUpload className="text-xs" /> Choose File
                  </button>
                  <input
                    id="departmentalUpload"
                    type="file"
                    onChange={(e) => handleFileSelect(e, 'departmental')}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.relevantDepartmentalRecordName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* ===== WRITTEN STATEMENTS ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Written Statement
                </label>
                
                {!showStatementEditor && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenStatementEditor()}
                      className="px-4 py-2 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                      <FaEdit className="text-xs" /> Type Statement
                    </button>
                    <button
                      type="button"
                      onClick={() => statementFileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#0F4C75] text-white rounded-lg hover:bg-[#1B262C] transition-all duration-200 flex items-center gap-2 text-sm shadow-sm shadow-[#0F4C75]/20"
                    >
                      <FaUpload className="text-xs" /> Upload Statement
                    </button>
                    <input
                      ref={statementFileInputRef}
                      type="file"
                      multiple
                      onChange={handleStatementFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                    />
                  </div>
                )}

                {/* Statement Editor */}
                {showStatementEditor && (
                  <div className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaEdit className="text-[#0F4C75] text-sm" />
                        <span className="text-sm font-medium text-gray-700">
                          {editingStatementId ? 'Edit Statement' : 'New Statement'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveStatement}
                          className="px-3 py-1 bg-[#0F4C75] text-white text-xs rounded hover:bg-[#1B262C] transition-all duration-200"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowStatementEditor(false);
                            setEditingStatementId(null);
                            setStatementTitle('');
                            setStatementContent('');
                            setStatementFile(null);
                          }}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white px-4 pt-3 pb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statement Title
                      </label>
                      <input
                        type="text"
                        value={statementTitle}
                        onChange={(e) => setStatementTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900"
                        placeholder="e.g. Written Statement of Plaintiff"
                      />
                    </div>
                    
                    <div className="bg-white px-4 pb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statement Content
                      </label>
                      <textarea
                        value={statementContent}
                        onChange={(e) => setStatementContent(e.target.value)}
                        className="w-full h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 resize-none text-gray-800 text-sm leading-relaxed"
                        placeholder="Enter the statement content here..."
                      />
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Or upload a file:</p>
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt';
                            input.multiple = true;
                            input.onchange = (e) => {
                              const files = Array.from(e.target.files);
                              if (files.length > 0) {
                                const file = files[0];
                                setStatementFile(file);
                                setStatementContent('');
                                toast.success(`File "${file.name}" selected`);
                              }
                            };
                            input.click();
                          }}
                          className="px-4 py-1.5 bg-[#3282B8]/10 text-[#0F4C75] border border-[#3282B8]/30 rounded-lg hover:bg-[#3282B8]/20 transition-all duration-200 text-sm flex items-center gap-2"
                        >
                          <FaUpload className="text-xs" /> Choose File
                        </button>
                        {statementFile && (
                          <span className="text-xs text-green-600 ml-2">
                            ✅ {statementFile.name} ({(statementFile.size / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
                      {statementContent ? (
                        <>
                          <span>Word count: {statementContent.trim().split(/\s+/).filter(w => w).length}</span>
                          <span>Characters: {statementContent.length}</span>
                        </>
                      ) : statementFile ? (
                        <span>File selected: {statementFile.name}</span>
                      ) : (
                        <span>No content added yet</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Display Statements List */}
                {formData.writtenStatements.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.writtenStatements.map((statement) => (
                      <div key={statement.id} className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:border-[#3282B8]/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {statement.file ? (
                              <>
                                {getFileIcon(statement.fileName || '')}
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-gray-800">{statement.title}</p>
                                  <p className="text-xs text-gray-400">
                                    File: {statement.fileName} ({(statement.fileSize / 1024).toFixed(1)} KB)
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <FaFileAlt className="text-green-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-800">{statement.title}</p>
                                  <p className="text-xs text-gray-400">
                                    {statement.content.trim().split(/\s+/).filter(w => w).length} words • {statement.content.length} characters
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleViewStatement(statement)}
                              className="text-[#0F4C75] hover:text-[#3282B8] transition-colors p-1 hover:bg-blue-50 rounded-lg"
                              title="View"
                            >
                              <FaEye className="text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadStatement(statement)}
                              className="text-[#0F4C75] hover:text-[#3282B8] transition-colors p-1 hover:bg-blue-50 rounded-lg"
                              title="Download"
                            >
                              <FaDownload className="text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintStatement(statement)}
                              className="text-[#0F4C75] hover:text-[#3282B8] transition-colors p-1 hover:bg-blue-50 rounded-lg"
                              title="Print"
                            >
                              <FaPrint className="text-sm" />
                            </button>
                            {!statement.file && (
                              <button
                                type="button"
                                onClick={() => handleOpenStatementEditor(statement)}
                                className="text-[#0F4C75] hover:text-[#3282B8] transition-colors p-1 hover:bg-blue-50 rounded-lg"
                                title="Edit"
                              >
                                <FaEdit className="text-sm" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveStatement(statement.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded-lg"
                              title="Remove"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ===== LAW OFFICER / DEPARTMENTAL REPRESENTATIVE ===== */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-[#0F4C75] mb-3 flex items-center gap-2">
                  <FaUser className="text-sm" />
                  Law officer / Departmental Representative
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      name="type"
                      value={formData.lawOfficer.type}
                      onChange={handleLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                    >
                      {lawOfficerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.lawOfficer.name}
                      onChange={handleLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. Mr. Usman Chatha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.lawOfficer.designation}
                      onChange={handleLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. Head Clerk"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Office Address *</label>
                    <input
                      type="text"
                      name="officeAddress"
                      value={formData.lawOfficer.officeAddress}
                      onChange={handleLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. AC, Office Ferozewala"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Official Number *</label>
                    <input
                      type="text"
                      name="officialNumber"
                      value={formData.lawOfficer.officialNumber}
                      onChange={handleLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. 03004370188"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cell Number *</label>
                    <input
                      type="text"
                      name="cellNumber"
                      value={formData.lawOfficer.cellNumber}
                      onChange={handleLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. 03004370188"
                    />
                  </div>
                </div>
              </div>

              {/* ===== ALTERNATE LAW OFFICER ===== */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-[#0F4C75] mb-3 flex items-center gap-2">
                  <FaUser className="text-sm" />
                  Alternate Law officer / Departmental Representative
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      name="type"
                      value={formData.alternateLawOfficer.type}
                      onChange={handleAlternateLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                    >
                      {lawOfficerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.alternateLawOfficer.name}
                      onChange={handleAlternateLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. Mr. Rai Javed Iqbal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.alternateLawOfficer.designation}
                      onChange={handleAlternateLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. Girdawar"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Office Address</label>
                    <input
                      type="text"
                      name="officeAddress"
                      value={formData.alternateLawOfficer.officeAddress}
                      onChange={handleAlternateLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. AC, Office Ferozewala"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Official Number</label>
                    <input
                      type="text"
                      name="officialNumber"
                      value={formData.alternateLawOfficer.officialNumber}
                      onChange={handleAlternateLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. 03004241206"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cell Number</label>
                    <input
                      type="text"
                      name="cellNumber"
                      value={formData.alternateLawOfficer.cellNumber}
                      onChange={handleAlternateLawOfficerChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] focus:border-transparent transition-all duration-200 bg-white text-gray-900 text-sm"
                      placeholder="e.g. 03004241206"
                    />
                  </div>
                </div>
              </div>

              {/* ===== FORM ACTIONS ===== */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  disabled={loading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-[#0F4C75] text-white text-sm font-medium rounded-lg hover:bg-[#1B262C] transition-all duration-300 shadow-sm shadow-[#0F4C75]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCaseModal;