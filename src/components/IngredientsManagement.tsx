import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Calendar as CalendarIcon, 
  Package, 
  AlertCircle,
  Camera,
  Receipt,
  X
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { getIngredients, addIngredient, updateIngredient, deleteIngredient } from "../utils/api";
import { toast } from "sonner@2.0.3";

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: string;
  unit: string;
  expiryDate?: string;
  location: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const CATEGORIES = [
  "채소",
  "과일",
  "육류",
  "해산물",
  "유제품",
  "곡류",
  "조미료",
  "냉동식품",
  "기타"
];

const LOCATIONS = [
  "냉장실",
  "냉동실",
  "실온",
  "선반"
];

const UNITS = [
  "개",
  "g",
  "kg",
  "ml",
  "L",
  "팩",
  "봉지",
  "통"
];

interface IngredientsManagementProps {
  onBack?: () => void;
}

export function IngredientsManagement({ onBack }: IngredientsManagementProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOcrDialogOpen, setIsOcrDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    expiryDate: undefined as Date | undefined,
    location: "",
    notes: ""
  });

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
    filterIngredients();
  }, [ingredients, searchQuery, selectedCategory]);

  const loadIngredients = async () => {
    setLoading(true);
    try {
      const response = await getIngredients();
      setIngredients(response.ingredients || []);
    } catch (error: any) {
      console.error('Failed to load ingredients:', error);
      toast.error("식재료 목록을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const filterIngredients = () => {
    let filtered = ingredients;

    // Category filter
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(ing => ing.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ing => 
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by expiry date (closest first)
    filtered.sort((a, b) => {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });

    setFilteredIngredients(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      expiryDate: undefined,
      location: "",
      notes: ""
    });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.category || !formData.quantity || !formData.unit || !formData.location) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      const ingredientData = {
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : undefined,
        notes: formData.notes
      };

      const response = await addIngredient(ingredientData);
      setIngredients([...ingredients, response.ingredient]);
      toast.success("식재료가 추가되었습니다");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Failed to add ingredient:', error);
      toast.error("식재료 추가에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingIngredient || !formData.name || !formData.category || !formData.quantity || !formData.unit || !formData.location) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      const ingredientData = {
        name: formData.name,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        expiryDate: formData.expiryDate ? formData.expiryDate.toISOString() : undefined,
        notes: formData.notes
      };

      const response = await updateIngredient(editingIngredient.id, ingredientData);
      setIngredients(ingredients.map(ing => 
        ing.id === editingIngredient.id ? response.ingredient : ing
      ));
      toast.success("식재료가 수정되었습니다");
      setIsEditDialogOpen(false);
      setEditingIngredient(null);
      resetForm();
    } catch (error: any) {
      console.error('Failed to update ingredient:', error);
      toast.error("식재료 수정에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteIngredient(id);
      setIngredients(ingredients.filter(ing => ing.id !== id));
      toast.success("식재료가 삭제되었습니다");
    } catch (error: any) {
      console.error('Failed to delete ingredient:', error);
      toast.error("식재료 삭제에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      expiryDate: ingredient.expiryDate ? parseISO(ingredient.expiryDate) : undefined,
      location: ingredient.location,
      notes: ingredient.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const days = differenceInDays(parseISO(expiryDate), new Date());
    
    if (days < 0) {
      return { label: "유통기한 지남", color: "bg-red-500" };
    } else if (days === 0) {
      return { label: "오늘 만료", color: "bg-red-500" };
    } else if (days <= 3) {
      return { label: `${days}일 남음`, color: "bg-orange-500" };
    } else if (days <= 7) {
      return { label: `${days}일 남음`, color: "bg-yellow-500" };
    }
    return { label: `${days}일 남음`, color: "bg-green-500" };
  };

  const expiringCount = ingredients.filter(ing => {
    if (!ing.expiryDate) return false;
    const days = differenceInDays(parseISO(ing.expiryDate), new Date());
    return days >= 0 && days <= 3;
  }).length;

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">식재료 관리</h1>
          <p className="text-muted-foreground">
            냉장고 속 식재료를 효율적으로 관리하세요
          </p>
        </div>

        {/* Alert for expiring items */}
        {expiringCount > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-orange-900">
                  <span className="font-semibold">{expiringCount}개</span>의 식재료가 곧 유통기한이 만료됩니다
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">전체 식재료</p>
                  <p className="text-2xl font-bold">{ingredients.length}개</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">임박 식재료</p>
                  <p className="text-2xl font-bold text-orange-600">{expiringCount}개</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">카테고리</p>
                  <p className="text-2xl font-bold">{new Set(ingredients.map(i => i.category)).size}개</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="식재료 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => setIsOcrDialogOpen(true)} variant="outline">
            <Receipt className="w-4 h-4 mr-2" />
            영수증 스캔
          </Button>

          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            식재료 추가
          </Button>
        </div>

        {/* Ingredients Grid */}
        {loading && ingredients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        ) : filteredIngredients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                {searchQuery || selectedCategory !== "전체" 
                  ? "검색 결과가 없습니다"
                  : "등록된 식재료가 없습니다"
                }
              </p>
              {!searchQuery && selectedCategory === "전체" && (
                <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="mt-4">
                  첫 식재료 추가하기
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIngredients.map(ingredient => {
              const expiryStatus = getExpiryStatus(ingredient.expiryDate);
              return (
                <Card key={ingredient.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                        <CardDescription>{ingredient.category}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(ingredient)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(ingredient.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">수량:</span>
                        <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">보관 위치:</span>
                        <span className="font-medium">{ingredient.location}</span>
                      </div>
                      {ingredient.expiryDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">유통기한:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {format(parseISO(ingredient.expiryDate), 'yyyy.MM.dd', { locale: ko })}
                            </span>
                            {expiryStatus && (
                              <Badge className={`${expiryStatus.color} text-white text-xs`}>
                                {expiryStatus.label}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      {ingredient.notes && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">{ingredient.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingIngredient(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditDialogOpen ? "식재료 수정" : "식재료 추가"}
              </DialogTitle>
              <DialogDescription>
                식재료 정보를 입력해주세요
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">식재료명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 양파"
                />
              </div>

              <div>
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="quantity">수량 *</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="예: 2"
                  />
                </div>

                <div>
                  <Label htmlFor="unit">단위 *</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="단위" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">보관 위치 *</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>유통기한</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? (
                        format(formData.expiryDate, "PPP", { locale: ko })
                      ) : (
                        <span>날짜 선택</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="notes">메모</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="추가 메모 (선택사항)"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                  setEditingIngredient(null);
                  resetForm();
                }}
              >
                취소
              </Button>
              <Button
                onClick={isEditDialogOpen ? handleEdit : handleAdd}
                disabled={loading}
              >
                {loading ? "처리 중..." : (isEditDialogOpen ? "수정" : "추가")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* OCR Dialog */}
        <Dialog open={isOcrDialogOpen} onOpenChange={setIsOcrDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>영수증 스캔</DialogTitle>
              <DialogDescription>
                영수증 이미지를 업로드하여 식재료를 자동으로 등록하세요
              </DialogDescription>
            </DialogHeader>

            <div className="py-8 text-center border-2 border-dashed rounded-lg">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                이 기능은 곧 출시됩니다
              </p>
              <Button variant="outline" disabled>
                이미지 업로드
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOcrDialogOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
