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
  { id: null, label: "전체" },
  { id: "남성의류", label: "남성의류" },
  { id: "여성의류", label: "여성의류" },
  { id: "디지털/가전", label: "디지털/가전" },
  { id: "가구/인테리어", label: "가구/인테리어" },
  { id: "패션/잡화", label: "패션/잡화" },
  { id: "뷰티/미용", label: "뷰티/미용" },
  { id: "도서/음반", label: "도서/음반" },
  { id: "스포츠/레저", label: "스포츠/레저" },
  { id: "취미/게임", label: "취미/게임" },
  { id: "유아동/출산", label: "유아동/출산" },
  { id: "반려동물용품", label: "반려동물용품" },
  { id: "식품", label: "식품" },
  { id: "식물", label: "식물" },
  { id: "기타", label: "기타" },
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
      if (categoryId === null) {
        return prev.includes(null) ? [] : [null];
      } else {
        // "전체" 카테고리가 이미 선택되어 있으면 제거
        const withoutAll = prev.filter((id) => id !== null);

        // 선택한 카테고리가 이미 선택되어 있는지 확인
        if (withoutAll.includes(categoryId)) {
          return withoutAll.filter((id) => id !== categoryId);
        } else {
          return [categoryId];
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
