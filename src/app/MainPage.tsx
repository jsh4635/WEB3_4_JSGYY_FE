import { useState } from 'react';
import { useGlobalLoginMember } from '@/stores/auth/loginMember';
import Preview from '@/components/product/Preview';
import { PRODUCT_LIST } from '@/mocks/product_list';

const GRID_COLS = 3;  // 한 행당 아이템 수
const GRID_ROWS = 3;  // 한 페이지당 행 수
const ITEMS_PER_PAGE = GRID_COLS * GRID_ROWS;  // 한 페이지당 총 아이템 수

export default function MainPage() {
  const { isLogin, loginMember } = useGlobalLoginMember();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(PRODUCT_LIST.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = PRODUCT_LIST.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!isLogin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{loginMember.nickname}님 환영합니다.</h1>
      </div>
      
      <div 
        className="grid gap-6" 
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`
        }}
      >
        {currentItems.map((product) => (
          <Preview key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            이전
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-md px-4 py-2 text-sm ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
