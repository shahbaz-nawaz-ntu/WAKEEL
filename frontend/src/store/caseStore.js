// src/store/caseStore.js

createCase: async (caseData) => {
  set({ isLoading: true, error: null });
  try {
    console.log('📤 Creating case with data:', caseData);
    
    // ✅ REMOVED client validation - client is optional
    // if (!caseData.client) {
    //   throw new Error('Client is required to create a case. Please select a client.');
    // }
    
    if (!caseData.caseNumber || !caseData.caseNumber.trim()) {
      throw new Error('Case number is required');
    }
    if (!caseData.caseTitle || !caseData.caseTitle.trim()) {
      throw new Error('Case title is required');
    }
    
    const cleanData = Object.fromEntries(
      Object.entries(caseData).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    console.log('📤 Submitting clean data:', JSON.stringify(cleanData, null, 2));
    const data = await caseAPI.create(cleanData);
    console.log('📦 Created case response:', data);
    
    let newCase = data;
    if (data && data.data) {
      newCase = data.data;
    } else if (data && data.case) {
      newCase = data.case;
    }
    
    // ✅ FORCE SET all fields from caseData
    newCase = {
      ...(newCase || {}),
      id: newCase?._id || newCase?.id || Date.now().toString(),
      
      // ✅ FORCE SET from caseData
      nameOfCourt: caseData.nameOfCourt || '',
      natureOfCase: caseData.natureOfCase || '',
      nextDateOfHearing: caseData.nextDateOfHearing || '',
      copyOfSummon: caseData.copyOfSummon || '',
      copyOfPlaint: caseData.copyOfPlaint || '',
      relevantDepartmentalRecord: caseData.relevantDepartmentalRecord || '',
      lawOfficer: caseData.lawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      alternateLawOfficer: caseData.alternateLawOfficer || { type: 'Department Representative', name: '', designation: '', officeAddress: '', officialNumber: '', cellNumber: '' },
      writtenStatements: caseData.writtenStatements || [],
      caseTitle: caseData.caseTitle || caseData.title || '',
      title: caseData.title || caseData.caseTitle || '',
      plaintiff: caseData.plaintiff || '',
      defendant: caseData.defendant || '',
      division: caseData.division || '',
      district: caseData.district || '',
      caseNumber: caseData.caseNumber || '',
      status: caseData.status || 'active',
      courtDetails: caseData.courtDetails || {},
      caseNature: caseData.caseNature || {},
      attachments: caseData.attachments || {},
      
      // ✅ Also preserve these fields
      amount: caseData.amount || 'N/A',
      judge: caseData.judge || 'N/A',
      assignedTo: caseData.assignedTo || 'N/A',
      hearings: caseData.hearings || 0,
      date: caseData.date || new Date().toISOString().split('T')[0],
      description: caseData.description || '',
      remarks: caseData.remarks || '',
      courtNo: caseData.courtNo || '',
      cmsNo: caseData.cmsNo || '',
      officeNo: caseData.officeNo || '',
      instituteDate: caseData.instituteDate || '',
      instituteNo: caseData.instituteNo || '',
      documentsCount: caseData.documentsCount || 0,
      documents: caseData.documents || {},
      party: caseData.party || 'N/A',
      caseType: caseData.caseType || 'Civil',
      priority: caseData.priority || 'Medium',
    };
    
    console.log('📦 Final newCase:', newCase);
    console.log('📦 Fields check:', {
      nameOfCourt: newCase.nameOfCourt,
      natureOfCase: newCase.natureOfCase,
      nextDateOfHearing: newCase.nextDateOfHearing,
      copyOfSummon: newCase.copyOfSummon,
      copyOfPlaint: newCase.copyOfPlaint,
      relevantDepartmentalRecord: newCase.relevantDepartmentalRecord,
      lawOfficer: newCase.lawOfficer,
      alternateLawOfficer: newCase.alternateLawOfficer,
      writtenStatements: newCase.writtenStatements,
    });
    
    set((state) => ({
      cases: [newCase, ...state.cases],
      isLoading: false,
      error: null,
    }));
    
    toast.success('Case created successfully');
    await get().fetchCases();
    
    return { success: true, data: newCase };
  } catch (error) {
    console.error('❌ Create case error:', error);
    
    let errorMsg = 'Failed to create case';
    if (error.message) {
      errorMsg = error.message;
    } else if (error.data?.message) {
      errorMsg = error.data.message;
    } else if (error.data?.error) {
      errorMsg = error.data.error;
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMsg = error.response.data.error;
    }
    
    set({
      isLoading: false,
      error: errorMsg,
    });
    toast.error(errorMsg);
    return { success: false, error: errorMsg };
  }
},