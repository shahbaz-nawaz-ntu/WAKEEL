// src/pages/Dashboard.jsx or wherever you show cases
import CaseFilters from '../components/CaseFilters';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);

  const handleFilterChange = (filters) => {
    console.log('Filters applied:', filters);
    // Apply filters to your cases
    let result = [...cases];
    
    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    
    // Filter by department
    if (filters.department !== 'all') {
      result = result.filter(c => c.caseType === filters.department);
    }
    
    // Filter by statement type
    if (filters.statementType !== 'all') {
      // Filter based on statement type
      result = result.filter(c => {
        if (filters.statementType === 'petitioner') {
          return c.documents?.petitioner?.length > 0;
        } else if (filters.statementType === 'defendant') {
          return c.documents?.defendant?.length > 0;
        }
        return true;
      });
    }
    
    setFilteredCases(result);
  };

  const handleSearch = (term) => {
    console.log('Search term:', term);
    if (!term.trim()) {
      setFilteredCases(cases);
      return;
    }
    const result = cases.filter(c => 
      c.caseTitle?.toLowerCase().includes(term.toLowerCase()) ||
      c.caseNumber?.toLowerCase().includes(term.toLowerCase()) ||
      c.party?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCases(result);
  };

  return (
    <div className="p-6">
      <CaseFilters
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        totalCases={cases.length}
        activeCases={cases.filter(c => c.status === 'active').length}
        pendingCases={cases.filter(c => c.status === 'pending').length}
        closedCases={cases.filter(c => c.status === 'closed').length}
      />
      
      {/* Your cases grid/list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filteredCases.length > 0 ? filteredCases : cases).map(caseItem => (
          <CaseCard key={caseItem.id} case={caseItem} />
        ))}
      </div>
    </div>
  );
};