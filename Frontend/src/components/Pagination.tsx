import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 15
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {showInfo && (
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showInfo && (
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{startItem}</span> à{' '}
              <span className="font-medium">{endItem}</span> sur{' '}
              <span className="font-medium">{totalItems}</span> résultats
            </p>
          </div>
        )}

        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            {/* Bouton Précédent */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Précédent</span>
              ←
            </button>

            {/* Pages */}
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === page
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Bouton Suivant */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Suivant</span>
              →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;