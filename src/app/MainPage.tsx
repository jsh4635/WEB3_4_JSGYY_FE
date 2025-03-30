"use client";

import { useGetPostListQuery } from "@/api/posts/queries/useGetPostListQuery";
import Preview from "@/components/post/Preview";
import { useState } from "react";

const ITEMS_PER_PAGE = 20;

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: postList } = useGetPostListQuery();

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  console.log(postList);
  if (!postList) return null;
  const totalPages = Math.ceil(postList?.length / ITEMS_PER_PAGE);

  const currentItems = postList?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentItems.map((post) => (
          <Preview key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}
