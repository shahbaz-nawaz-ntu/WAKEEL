import React, { useState, useEffect } from 'react';
import { useCaseStore } from '../store/caseStore';
import CaseList from '../components/cases/CaseList';
import CaseFilters from '../components/cases/CaseFilters';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useDebounce } from '../hooks/useDebounce';

const Cases = () => {
  const { cases, isLoading, fetchCases, filters, setFilters, pagination, setPage } = useCaseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCases();
  }, [pagination.page]);

  if (isLoading && cases.length === 0) {
    return <SkeletonLoader type="card" count={6} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Cases</h1>
          <p className="text-gray-400 mt-1">Manage and track all your legal cases</p>
        </div>
        <button
          onClick={() => document.getElementById('add-case-modal')?.showModal()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + New Case
        </button>
      </div>

      <CaseFilters
        filters={filters}
        onFilterChange={setFilters}
        onSearchChange={(value) => setSearchTerm(value)}
        onReset={setFilters}
      />

      <CaseList
        cases={cases}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Cases;