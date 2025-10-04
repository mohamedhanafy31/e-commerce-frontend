"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Tag,
  Save,
  X,
  FolderOpen
} from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { Category, CategoryFormData } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function AdminCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categories = await categoryService.getAll();
      setCategories(categories);
    } catch (err: any) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: CategoryFormData = {
        name: newCategoryName,
        description: newCategoryDescription || undefined,
      };
      await categoryService.create(payload);
      setNewCategoryName("");
      setNewCategoryDescription("");
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryDescription(category.description || "");
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: Partial<CategoryFormData> = {
        name: editCategoryName,
        description: editCategoryDescription || undefined,
      };
      await categoryService.update(editingCategory.id, payload);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                <p className="text-gray-600 mt-1">{categories.length} categories</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="text-red-700 font-medium">{error}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create New Category */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Plus className="h-5 w-5 mr-2" />
              Create New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <Input
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  placeholder="Enter description (optional)"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCreateCategory} 
                  disabled={isSubmitting || !newCategoryName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Create Category
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2 text-gray-600" />
              Existing Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                <p className="text-gray-500 mb-4">Create your first category to organize your products</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{category.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCategory?.id === category.id ? (
                            <Input
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              disabled={isSubmitting}
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCategory?.id === category.id ? (
                            <Input
                              value={editCategoryDescription}
                              onChange={(e) => setEditCategoryDescription(e.target.value)}
                              disabled={isSubmitting}
                              className="w-full"
                            />
                          ) : (
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {category.description || "No description"}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {category.productCount} products
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingCategory?.id === category.id ? (
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                onClick={handleUpdateCategory} 
                                disabled={isSubmitting || !editCategoryName.trim()} 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {isSubmitting ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                ) : (
                                  <Save className="h-3 w-3" />
                                )}
                              </Button>
                              <Button 
                                onClick={() => setEditingCategory(null)} 
                                variant="outline" 
                                size="sm" 
                                disabled={isSubmitting}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                onClick={() => handleEditClick(category)} 
                                variant="outline" 
                                size="sm"
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteCategory(category.id)}
                                variant="outline"
                                size="sm"
                                disabled={category.productCount > 0 || isSubmitting}
                                className="text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <ProtectedRoute>
      <AdminCategoriesContent />
    </ProtectedRoute>
  );
}