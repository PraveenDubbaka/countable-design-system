import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Type, 
  AlignLeft, 
  ChevronDown, 
  Square, 
  Circle, 
  MousePointer,
  Image,
  GripVertical
} from 'lucide-react';
import { FormElement, FormLayout } from '@/types/checklist';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormLayoutEditorProps {
  formLayout: FormLayout;
  onUpdate: (formLayout: FormLayout) => void;
  isPreviewMode: boolean;
}

const FORM_ELEMENT_OPTIONS = [
  { type: 'text-input', label: 'Text Input', icon: Type },
  { type: 'textarea', label: 'Text Area', icon: AlignLeft },
  { type: 'select', label: 'Dropdown', icon: ChevronDown },
  { type: 'checkbox', label: 'Checkbox', icon: Square },
  { type: 'radio', label: 'Radio', icon: Circle },
  { type: 'button', label: 'Button', icon: MousePointer },
] as const;

const BUTTON_STYLES = [
  { value: 'text-only', label: 'Text Only' },
  { value: 'icon-text', label: 'Icon + Text' },
  { value: 'icon-only', label: 'Icon Only' },
] as const;

const ICON_OPTIONS = [
  { value: 'check', label: 'Check', icon: '✓' },
  { value: 'plus', label: 'Plus', icon: '+' },
  { value: 'arrow', label: 'Arrow', icon: '→' },
  { value: 'star', label: 'Star', icon: '★' },
  { value: 'search', label: 'Search', icon: '🔍' },
] as const;

export function FormLayoutEditor({ formLayout, onUpdate, isPreviewMode }: FormLayoutEditorProps) {
  const handleAddColumn = () => {
    if (formLayout.columns >= 5) return;
    const newElement: FormElement = {
      id: `col-${Date.now()}`,
      type: 'empty'
    };
    onUpdate({
      columns: formLayout.columns + 1,
      elements: [...formLayout.elements, newElement]
    });
  };

  const handleRemoveColumn = (index: number) => {
    if (formLayout.columns <= 1) return;
    const newElements = formLayout.elements.filter((_, i) => i !== index);
    onUpdate({
      columns: formLayout.columns - 1,
      elements: newElements
    });
  };

  const handleUpdateElement = (index: number, updates: Partial<FormElement>) => {
    const newElements = [...formLayout.elements];
    newElements[index] = { ...newElements[index], ...updates };
    onUpdate({ ...formLayout, elements: newElements });
  };

  const handleSetElementType = (index: number, type: FormElement['type']) => {
    const element = formLayout.elements[index];
    const newElement: FormElement = {
      id: element.id,
      type,
      label: type === 'button' ? 'Submit' : '',
      placeholder: type === 'text-input' || type === 'textarea' ? 'Enter text...' : undefined,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      buttonStyle: type === 'button' ? 'text-only' : undefined,
    };
    handleUpdateElement(index, newElement);
  };

  const renderFormElement = (element: FormElement, index: number) => {
    if (isPreviewMode) {
      return renderPreviewElement(element);
    }

    if (element.type === 'empty') {
      return (
        <div className="h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 hover:border-primary/50 hover:bg-primary/5 transition-all">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary transition-colors p-4">
                <Plus className="h-6 w-6" />
                <span className="text-xs font-medium">Add Element</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="center">
              <div className="flex flex-col gap-1">
                {FORM_ELEMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => handleSetElementType(index, opt.type)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    return (
      <div className="h-full min-h-[100px] flex flex-col border border-gray-200 rounded-lg bg-white p-3 group relative">
        {/* Element controls */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <ChevronDown className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="flex flex-col gap-1">
                {FORM_ELEMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => handleSetElementType(index, opt.type)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                      element.type === opt.type ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <opt.icon className="h-4 w-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <button
            onClick={() => handleUpdateElement(index, { type: 'empty', label: undefined, placeholder: undefined, options: undefined, buttonStyle: undefined, icon: undefined })}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Element editor */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Label input */}
          <Input
            value={element.label || ''}
            onChange={(e) => handleUpdateElement(index, { label: e.target.value })}
            placeholder="Label"
            className="text-xs h-7"
          />

          {/* Type-specific preview/settings */}
          {renderElementEditor(element, index)}
        </div>
      </div>
    );
  };

  const renderElementEditor = (element: FormElement, index: number) => {
    switch (element.type) {
      case 'text-input':
        return (
          <Input
            value={element.placeholder || ''}
            onChange={(e) => handleUpdateElement(index, { placeholder: e.target.value })}
            placeholder="Placeholder text..."
            className="text-xs h-8"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={element.placeholder || ''}
            onChange={(e) => handleUpdateElement(index, { placeholder: e.target.value })}
            placeholder="Placeholder text..."
            className="text-xs min-h-[60px] resize-none"
          />
        );
      
      case 'select':
      case 'radio':
        return (
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Options:</p>
            {(element.options || []).map((opt, i) => (
              <div key={i} className="flex items-center gap-1">
                <Input
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...(element.options || [])];
                    newOptions[i] = e.target.value;
                    handleUpdateElement(index, { options: newOptions });
                  }}
                  className="text-xs h-6 flex-1"
                />
                <button
                  onClick={() => {
                    const newOptions = (element.options || []).filter((_, j) => j !== i);
                    handleUpdateElement(index, { options: newOptions.length ? newOptions : ['Option 1'] });
                  }}
                  className="p-0.5 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleUpdateElement(index, { options: [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`] })}
              className="text-xs text-primary hover:underline"
            >
              + Add option
            </button>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <Square className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Checkbox</span>
          </div>
        );
      
      case 'button':
        return (
          <div className="space-y-2">
            <Select
              value={element.buttonStyle || 'text-only'}
              onValueChange={(v) => handleUpdateElement(index, { buttonStyle: v as FormElement['buttonStyle'] })}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUTTON_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-xs">
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(element.buttonStyle === 'icon-text' || element.buttonStyle === 'icon-only') && (
              <Select
                value={element.icon || 'check'}
                onValueChange={(v) => handleUpdateElement(index, { icon: v })}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value} className="text-xs">
                      <span className="flex items-center gap-2">
                        <span>{icon.icon}</span>
                        {icon.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderPreviewElement = (element: FormElement) => {
    const label = element.label;
    
    switch (element.type) {
      case 'empty':
        return null;
      
      case 'text-input':
        return (
          <div className="space-y-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <Input placeholder={element.placeholder} className="h-9" />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <Textarea placeholder={element.placeholder} className="min-h-[80px]" />
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <Select>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {(element.options || []).map((opt, i) => (
                  <SelectItem key={i} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            {label && <label className="text-sm text-gray-700">{label}</label>}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <div className="space-y-1">
              {(element.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name={element.id} className="h-4 w-4" />
                  <span className="text-sm text-gray-700">{opt}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'button':
        const iconChar = ICON_OPTIONS.find(i => i.value === element.icon)?.icon || '✓';
        return (
          <Button className="w-full">
            {(element.buttonStyle === 'icon-text' || element.buttonStyle === 'icon-only') && (
              <span className="mr-1">{iconChar}</span>
            )}
            {element.buttonStyle !== 'icon-only' && (label || 'Button')}
          </Button>
        );
      
      default:
        return null;
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[formLayout.columns] || 'grid-cols-1';

  return (
    <div className="p-4">
      <div className={`grid ${gridCols} gap-3`}>
        {formLayout.elements.map((element, index) => (
          <div key={element.id} className="relative">
            {!isPreviewMode && formLayout.columns > 1 && (
              <button
                onClick={() => handleRemoveColumn(index)}
                className="absolute -top-2 -right-2 z-10 p-1 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                title="Remove column"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            {renderFormElement(element, index)}
          </div>
        ))}
        
        {/* Add column button */}
        {!isPreviewMode && formLayout.columns < 5 && (
          <button
            onClick={handleAddColumn}
            className="h-full min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex flex-col items-center gap-1">
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">Add Column</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
