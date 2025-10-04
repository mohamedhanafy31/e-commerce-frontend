"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  TagIcon as TagIconIcon,
  Save,
  X,
  Hash
} from "lucide-react";
import { tagService } from "@/services/tagService";
import { Tag, TagFormData } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function AdminTagsContent() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const tags = await tagService.getAll();
      setTags(tags);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError("Tag name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: TagFormData = {
        name: newTagName.toLowerCase().trim(),
      };
      await tagService.create(payload);
      setNewTagName("");
      fetchTags();
    } catch (err: any) {
      setError(err.message || "Failed to create tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (tag: Tag) => {
    setEditingTag(tag);
    setEditTagName(tag.name);
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editTagName.trim()) {
      setError("Tag name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: Partial<TagFormData> = {
        name: editTagName.toLowerCase().trim(),
      };
      await tagService.update(editingTag.id, payload);
      setEditingTag(null);
      fetchTags();
    } catch (err: any) {
      setError(err.message || "Failed to update tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await tagService.delete(id);
      fetchTags();
    } catch (err: any) {
      setError(err.message || "Failed to delete tag");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading tags...</div>
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
                <h1 className="text-3xl font-bold text-gray-900">Tag Management</h1>
                <p className="text-gray-600 mt-1">{tags.length} tags</p>
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

        {/* Create New Tag */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <Plus className="h-5 w-5 mr-2" />
              Create New Tag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Name *
                </label>
                <Input
                  placeholder="Enter tag name (e.g., featured, sale, new)"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Tag names are automatically converted to lowercase
                </p>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleCreateTag} 
                  disabled={isSubmitting || !newTagName.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Create Tag
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags List */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center">
              <Hash className="h-5 w-5 mr-2 text-gray-600" />
              Existing Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {tags.length === 0 ? (
              <div className="text-center py-12">
                <TagIconIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tags yet</h3>
                <p className="text-gray-500 mb-4">Create your first tag to categorize your products</p>
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
                        Tag Name
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
                    {tags.map((tag) => (
                      <tr key={tag.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{tag.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingTag?.id === tag.id ? (
                            <Input
                              value={editTagName}
                              onChange={(e) => setEditTagName(e.target.value)}
                              disabled={isSubmitting}
                              className="w-full"
                            />
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                              #{tag.name}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag.productCount} products
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tag.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingTag?.id === tag.id ? (
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                onClick={handleUpdateTag} 
                                disabled={isSubmitting || !editTagName.trim()} 
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
                                onClick={() => setEditingTag(null)} 
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
                                onClick={() => handleEditClick(tag)} 
                                variant="outline" 
                                size="sm"
                                className="text-purple-600 border-purple-300 hover:bg-purple-50"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteTag(tag.id)}
                                variant="outline"
                                size="sm"
                                disabled={tag.productCount > 0 || isSubmitting}
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

export default function AdminTagsPage() {
  return (
    <ProtectedRoute>
      <AdminTagsContent />
    </ProtectedRoute>
  );
}