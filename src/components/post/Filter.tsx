import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { H3, Text } from "@/components/ui/typography";

interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  onlyAvailable?: boolean;
  categories?: string[];
  query?: string;
}

const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "electronics", label: "전자기기" },
  { id: "furniture", label: "가구/인테리어" },
  { id: "clothes", label: "의류" },
  { id: "beauty", label: "뷰티/미용" },
  { id: "books", label: "도서" },
  { id: "sports", label: "스포츠/레저" },
  { id: "hobby", label: "취미/게임" },
  { id: "others", label: "기타" },
];

export default function Filter({ onFilterChange, className }: FilterProps) {
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // useCallback으로 메모이제이션하여 무한 렌더링 방지
  const applyFilters = useCallback(() => {
    const filters: FilterOptions = {
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      onlyAvailable,
      categories:
        selectedCategories.length > 0 ? selectedCategories : undefined,
      query: searchQuery || undefined,
    };

    onFilterChange(filters);
  }, [
    minPrice,
    maxPrice,
    onlyAvailable,
    selectedCategories,
    searchQuery,
    onFilterChange,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (categoryId === "all") {
        return prev.includes("all") ? [] : ["all"];
      } else {
        // "전체" 카테고리가 이미 선택되어 있으면 제거
        const withoutAll = prev.filter((id) => id !== "all");

        // 선택한 카테고리가 이미 선택되어 있는지 확인
        if (withoutAll.includes(categoryId)) {
          return withoutAll.filter((id) => id !== categoryId);
        } else {
          return [...withoutAll, categoryId];
        }
      }
    });
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setOnlyAvailable(false);
    setSelectedCategories([]);
    setSearchQuery("");
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <div>
          <H3 className="text-lg mb-2">카테고리</H3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-colors",
                  selectedCategories.includes(category.id)
                    ? "bg-primary text-white border-primary"
                    : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => handleCategoryChange(category.id)}
              >
                <Text className="text-sm">{category.label}</Text>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <H3 className="text-lg mb-2">가격</H3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="최소"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="daangn-input"
            />
            <span>~</span>
            <Input
              type="number"
              placeholder="최대"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="daangn-input"
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="available"
            checked={onlyAvailable}
            onCheckedChange={(checked) => setOnlyAvailable(checked as boolean)}
          />
          <Label htmlFor="available" className="cursor-pointer">
            <Text className="text-sm">판매중인 상품만 보기</Text>
          </Label>
        </div>

        <Button onClick={handleReset} variant="outline" className="w-full mt-2">
          필터 초기화
        </Button>
      </div>
    </Card>
  );
}
