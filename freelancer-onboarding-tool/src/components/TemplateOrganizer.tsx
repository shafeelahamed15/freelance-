'use client';

import { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderPlus, 
  Tag, 
  Heart, 
  Star, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Move, 
  Archive, 
  Download,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Check,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Mail
} from 'lucide-react';

interface TemplateFolder {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  templatesCount: number;
  isExpanded?: boolean;
}

interface TemplateTag {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  folderId?: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  lastUsed?: Date;
}

interface TemplateOrganizerProps {
  templates: EmailTemplate[];
  folders: TemplateFolder[];
  tags: TemplateTag[];
  onUpdateTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onCreateFolder: (folder: Omit<TemplateFolder, 'id' | 'templatesCount'>) => void;
  onUpdateFolder: (folder: TemplateFolder) => void;
  onDeleteFolder: (folderId: string) => void;
  onCreateTag: (tag: Omit<TemplateTag, 'id' | 'count'>) => void;
  onUpdateTag: (tag: TemplateTag) => void;
  onDeleteTag: (tagId: string) => void;
}

export function TemplateOrganizer({
  templates,
  folders,
  tags,
  onUpdateTemplate,
  onDeleteTemplate,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onCreateTag,
  onUpdateTag,
  onDeleteTag
}: TemplateOrganizerProps) {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated' | 'usage'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<{
    folder?: string;
    tags: string[];
    favorites: boolean;
    archived: boolean;
  }>({
    tags: [],
    favorites: false,
    archived: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['root']);

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!template.name.toLowerCase().includes(query) &&
            !template.subject.toLowerCase().includes(query) &&
            !template.content.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Folder filter
      if (filterBy.folder && template.folderId !== filterBy.folder) {
        return false;
      }

      // Tags filter
      if (filterBy.tags.length > 0) {
        if (!filterBy.tags.every(tag => template.tags.includes(tag))) {
          return false;
        }
      }

      // Favorites filter
      if (filterBy.favorites && !template.isFavorite) {
        return false;
      }

      // Archived filter
      if (filterBy.archived !== template.isArchived) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'usage':
          comparison = a.usageCount - b.usageCount;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const selectAllTemplates = () => {
    setSelectedTemplates(filteredTemplates.map(t => t.id));
  };

  const clearSelection = () => {
    setSelectedTemplates([]);
  };

  const toggleFavorite = (template: EmailTemplate) => {
    onUpdateTemplate({
      ...template,
      isFavorite: !template.isFavorite,
      updatedAt: new Date()
    });
  };

  const moveToFolder = (templateId: string, folderId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onUpdateTemplate({
        ...template,
        folderId,
        updatedAt: new Date()
      });
    }
  };

  const addTagToTemplate = (templateId: string, tagId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template && !template.tags.includes(tagId)) {
      onUpdateTemplate({
        ...template,
        tags: [...template.tags, tagId],
        updatedAt: new Date()
      });
    }
  };

  const removeTagFromTemplate = (templateId: string, tagId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onUpdateTemplate({
        ...template,
        tags: template.tags.filter(tag => tag !== tagId),
        updatedAt: new Date()
      });
    }
  };

  const archiveTemplate = (template: EmailTemplate) => {
    onUpdateTemplate({
      ...template,
      isArchived: !template.isArchived,
      updatedAt: new Date()
    });
  };

  const duplicateTemplate = (template: EmailTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      lastUsed: undefined
    };
    onUpdateTemplate(newTemplate);
  };

  const bulkAction = (action: string) => {
    selectedTemplates.forEach(templateId => {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        switch (action) {
          case 'delete':
            onDeleteTemplate(templateId);
            break;
          case 'archive':
            archiveTemplate(template);
            break;
          case 'favorite':
            toggleFavorite(template);
            break;
        }
      }
    });
    clearSelection();
    setShowBulkActions(false);
  };

  const renderFolderTree = (folderId?: string, level = 0) => {
    const folderTemplates = folders
      .filter(folder => folder.parentId === folderId)
      .map(folder => ({
        ...folder,
        templatesCount: templates.filter(t => t.folderId === folder.id).length
      }));

    return folderTemplates.map(folder => (
      <div key={folder.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
            filterBy.folder === folder.id ? 'bg-blue-50 text-blue-700' : ''
          }`}
          onClick={() => setFilterBy(prev => ({ 
            ...prev, 
            folder: prev.folder === folder.id ? undefined : folder.id 
          }))}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedFolders(prev => 
                prev.includes(folder.id) 
                  ? prev.filter(id => id !== folder.id)
                  : [...prev, folder.id]
              );
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            {expandedFolders.includes(folder.id) ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: folder.color }}
          />
          <span className="font-medium text-sm">{folder.name}</span>
          <span className="text-xs text-gray-500">({folder.templatesCount})</span>
        </div>
        {expandedFolders.includes(folder.id) && renderFolderTree(folder.id, level + 1)}
      </div>
    ));
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization</h3>
          
          {/* Quick Filters */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => setFilterBy({ tags: [], favorites: false, archived: false })}
              className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2 ${
                !filterBy.folder && filterBy.tags.length === 0 && !filterBy.favorites && !filterBy.archived
                  ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">All Templates</span>
              <span className="text-xs text-gray-500 ml-auto">({templates.length})</span>
            </button>
            
            <button
              onClick={() => setFilterBy(prev => ({ ...prev, favorites: !prev.favorites }))}
              className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2 ${
                filterBy.favorites ? 'bg-yellow-50 text-yellow-700' : ''
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="text-sm">Favorites</span>
              <span className="text-xs text-gray-500 ml-auto">
                ({templates.filter(t => t.isFavorite).length})
              </span>
            </button>
            
            <button
              onClick={() => setFilterBy(prev => ({ ...prev, archived: !prev.archived }))}
              className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2 ${
                filterBy.archived ? 'bg-gray-50 text-gray-700' : ''
              }`}
            >
              <Archive className="w-4 h-4" />
              <span className="text-sm">Archived</span>
              <span className="text-xs text-gray-500 ml-auto">
                ({templates.filter(t => t.isArchived).length})
              </span>
            </button>
          </div>
        </div>

        {/* Folders */}
        <div className="p-6 border-b border-gray-200 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Folders</h4>
            <button
              onClick={() => setShowCreateFolder(true)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {renderFolderTree()}
          </div>
        </div>

        {/* Tags */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Tags</h4>
            <button
              onClick={() => setShowCreateTag(true)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setFilterBy(prev => ({
                  ...prev,
                  tags: prev.tags.includes(tag.id)
                    ? prev.tags.filter(t => t !== tag.id)
                    : [...prev.tags, tag.id]
                }))}
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  filterBy.tags.includes(tag.id)
                    ? 'text-white'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
                style={{ 
                  backgroundColor: filterBy.tags.includes(tag.id) ? tag.color : undefined 
                }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
                <span className="ml-1">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Templates</h2>
              <p className="text-gray-600">
                {filteredTemplates.length} of {templates.length} templates
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="updated-desc">Recently Updated</option>
                <option value="created-desc">Recently Created</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="usage-desc">Most Used</option>
                <option value="usage-asc">Least Used</option>
              </select>
            </div>
          </div>

          {/* Search and Bulk Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {selectedTemplates.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedTemplates.length} selected
                </span>
                <button
                  onClick={() => setShowBulkActions(true)}
                  className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  Actions
                </button>
                <button
                  onClick={clearSelection}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className="flex-1 p-6 overflow-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">
                {searchQuery || filterBy.folder || filterBy.tags.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Create your first template to get started'
                }
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-3'
            }>
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  isSelected={selectedTemplates.includes(template.id)}
                  onSelect={() => toggleTemplateSelection(template.id)}
                  onToggleFavorite={() => toggleFavorite(template)}
                  onArchive={() => archiveTemplate(template)}
                  onDuplicate={() => duplicateTemplate(template)}
                  onDelete={() => onDeleteTemplate(template.id)}
                  folders={folders}
                  tags={tags}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals and other components would go here */}
    </div>
  );
}

// Template Card Component
interface TemplateCardProps {
  template: EmailTemplate;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  folders: TemplateFolder[];
  tags: TemplateTag[];
}

function TemplateCard({
  template,
  viewMode,
  isSelected,
  onSelect,
  onToggleFavorite,
  onArchive,
  onDuplicate,
  onDelete,
  folders,
  tags
}: TemplateCardProps) {
  const [showActions, setShowActions] = useState(false);

  const templateTags = tags.filter(tag => template.tags.includes(tag.id));
  const templateFolder = folders.find(folder => folder.id === template.folderId);

  if (viewMode === 'list') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
      }`}>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
              {template.isFavorite && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
              {template.isArchived && (
                <Archive className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">{template.subject}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>{template.type.replace('_', ' ')}</span>
              {templateFolder && (
                <span className="flex items-center space-x-1">
                  <Folder className="w-3 h-3" />
                  <span>{templateFolder.name}</span>
                </span>
              )}
              <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
              <span>Used {template.usageCount} times</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {templateTags.slice(0, 2).map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
            {templateTags.length > 2 && (
              <span className="text-xs text-gray-500">+{templateTags.length - 2}</span>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={onToggleFavorite}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{template.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                  <button
                    onClick={onDuplicate}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={onArchive}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Archive className="w-4 h-4" />
                    <span>{template.isArchived ? 'Unarchive' : 'Archive'}</span>
                  </button>
                  <button
                    onClick={onDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group ${
      isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <button
          onClick={onToggleFavorite}
          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{template.name}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.subject}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {templateTags.slice(0, 3).map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        ))}
        {templateTags.length > 3 && (
          <span className="text-xs text-gray-500">+{templateTags.length - 3}</span>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
        <div className="flex items-center space-x-2">
          {template.isArchived && <Archive className="w-3 h-3" />}
          <span>{template.usageCount} uses</span>
        </div>
      </div>
    </div>
  );
}