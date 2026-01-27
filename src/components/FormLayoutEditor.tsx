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
  Calendar,
  Check,
  ArrowRight,
  Star,
  Search
} from 'lucide-react';
import { FormElement, FormLayout } from '@/types/checklist';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  { value: 'check', label: 'Check', Icon: Check },
  { value: 'plus', label: 'Plus', Icon: Plus },
  { value: 'arrow', label: 'Arrow', Icon: ArrowRight },
  { value: 'star', label: 'Star', Icon: Star },
  { value: 'search', label: 'Search', Icon: Search },
] as const;

// Floating label input - M3 style matching CreateEngagement
const FloatingInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
}: { 
  label?: string; 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value;

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={!label ? placeholder : (isActive ? placeholder : '')}
        disabled={disabled}
        className={`
          w-full h-11 text-sm text-foreground rounded-lg outline-none transition-all duration-200
          ${label ? 'px-4 pt-4 pb-1' : 'px-4 py-2'}
          ${disabled 
            ? 'bg-[#F9FAFB] border-transparent text-muted-foreground opacity-60 cursor-not-allowed' 
            : focused 
              ? 'bg-white border-2 border-primary px-[15px]' 
              : 'bg-white border border-[#E2E5EB] hover:border-[#98A2B3]'
          }
        `}
      />
      {label && (
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isActive 
              ? `top-1 text-xs ${focused ? 'text-primary' : 'text-muted-foreground'}` 
              : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
            }
            ${disabled ? 'text-muted-foreground opacity-60' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
    </div>
  );
};

// Floating label textarea - M3 style
const FloatingTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required = false,
  disabled = false,
}: { 
  label?: string; 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={!label ? placeholder : (isActive ? placeholder : '')}
        disabled={disabled}
        rows={3}
        className={`
          w-full text-sm text-foreground rounded-lg outline-none transition-all duration-200 resize-none
          ${label ? 'px-4 pt-5 pb-2' : 'px-4 py-3'}
          ${disabled 
            ? 'bg-[#F9FAFB] border-transparent text-muted-foreground opacity-60 cursor-not-allowed' 
            : focused 
              ? 'bg-white border-2 border-primary px-[15px]' 
              : 'bg-white border border-[#E2E5EB] hover:border-[#98A2B3]'
          }
        `}
      />
      {label && (
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isActive 
              ? `top-1.5 text-xs ${focused ? 'text-primary' : 'text-muted-foreground'}` 
              : 'top-4 text-sm text-muted-foreground'
            }
            ${disabled ? 'text-muted-foreground opacity-60' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
    </div>
  );
};

// Floating label select - M3 style matching CreateEngagement
const FloatingSelect = ({ 
  label, 
  value, 
  onChange, 
  options,
  required = false,
  disabled = false,
}: { 
  label?: string; 
  value: string; 
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  disabled?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value;

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        className={`
          w-full h-11 text-sm text-foreground rounded-lg outline-none transition-all duration-200 appearance-none
          ${label ? 'px-4 pt-4 pb-1' : 'px-4 py-2'}
          ${disabled 
            ? 'bg-[#F9FAFB] border-transparent text-muted-foreground opacity-60 cursor-not-allowed' 
            : focused 
              ? 'bg-white border-2 border-primary px-[15px] cursor-pointer' 
              : 'bg-white border border-[#E2E5EB] hover:border-[#98A2B3] cursor-pointer'
          }
        `}
      >
        <option value="">Select...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      {label && (
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isActive 
              ? `top-1 text-xs ${focused ? 'text-primary' : 'text-muted-foreground'}` 
              : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
            }
            ${disabled ? 'text-muted-foreground opacity-60' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${disabled ? 'text-muted-foreground opacity-60' : 'text-muted-foreground'}`} />
    </div>
  );
};

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
        <div className="h-full min-h-[80px] flex items-center justify-center border-2 border-dashed border-[#E8EDF2] rounded-lg bg-[#F5F8FA]/50 hover:border-primary/50 hover:bg-primary/5 transition-all">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-4">
                <Plus className="h-5 w-5" />
                <span className="text-xs font-medium">Add Element</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="center">
              <div className="flex flex-col gap-1">
                {FORM_ELEMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => handleSetElementType(index, opt.type)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-[#F5F8FA] rounded-md transition-colors"
                  >
                    <opt.icon className="h-4 w-4 text-muted-foreground" />
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
      <div className="h-full min-h-[80px] flex flex-col bg-white rounded-lg p-4 group relative border border-[#E8EDF2]">
        {/* Element controls */}
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-[#F5F8FA] rounded transition-colors">
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
                      element.type === opt.type ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-[#F5F8FA]'
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
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Element editor */}
        <div className="flex-1 flex flex-col gap-3 pt-6">
          {/* Label input */}
          <FloatingInput
            label="Label"
            value={element.label || ''}
            onChange={(val) => handleUpdateElement(index, { label: val })}
          />

          {/* Type-specific settings */}
          {renderElementEditor(element, index)}
        </div>
      </div>
    );
  };

  const renderElementEditor = (element: FormElement, index: number) => {
    switch (element.type) {
      case 'text-input':
        return (
          <FloatingInput
            label="Placeholder"
            value={element.placeholder || ''}
            onChange={(val) => handleUpdateElement(index, { placeholder: val })}
          />
        );
      
      case 'textarea':
        return (
          <FloatingInput
            label="Placeholder"
            value={element.placeholder || ''}
            onChange={(val) => handleUpdateElement(index, { placeholder: val })}
          />
        );
      
      case 'select':
      case 'radio':
        return (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Options</p>
            {(element.options || []).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <FloatingInput
                    value={opt}
                    onChange={(val) => {
                      const newOptions = [...(element.options || [])];
                      newOptions[i] = val;
                      handleUpdateElement(index, { options: newOptions });
                    }}
                    placeholder={`Option ${i + 1}`}
                  />
                </div>
                <button
                  onClick={() => {
                    const newOptions = (element.options || []).filter((_, j) => j !== i);
                    handleUpdateElement(index, { options: newOptions.length ? newOptions : ['Option 1'] });
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleUpdateElement(index, { options: [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`] })}
              className="text-xs text-primary hover:underline font-medium"
            >
              + Add option
            </button>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-3 p-3 bg-[#F5F8FA] rounded-lg">
            <Checkbox disabled />
            <span className="text-sm text-muted-foreground">Checkbox preview</span>
          </div>
        );
      
      case 'button':
        const currentStyle = BUTTON_STYLES.find(s => s.value === element.buttonStyle)?.label || 'Text Only';
        const showIconPicker = element.buttonStyle === 'icon-text' || element.buttonStyle === 'icon-only';
        const EditorIconComponent = ICON_OPTIONS.find(i => i.value === element.icon)?.Icon || Check;
        
        return (
          <div className="space-y-3">
            <FloatingSelect
              label="Button Style"
              value={currentStyle}
              onChange={(val) => {
                const styleValue = BUTTON_STYLES.find(s => s.label === val)?.value || 'text-only';
                // Set default icon when switching to icon style
                const updates: Partial<FormElement> = { buttonStyle: styleValue as FormElement['buttonStyle'] };
                if ((styleValue === 'icon-text' || styleValue === 'icon-only') && !element.icon) {
                  updates.icon = 'check';
                }
                handleUpdateElement(index, updates);
              }}
              options={BUTTON_STYLES.map(s => s.label)}
            />
            
            {showIconPicker && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Button Icon</p>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((iconOpt) => {
                    const isSelected = element.icon === iconOpt.value;
                    return (
                      <button
                        key={iconOpt.value}
                        onClick={() => handleUpdateElement(index, { icon: iconOpt.value })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-[#E8EDF2] bg-[#F5F8FA] text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        }`}
                        title={iconOpt.label}
                      >
                        <iconOpt.Icon className="h-4 w-4" />
                        <span className="text-xs">{iconOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Button preview in editor */}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground font-medium mb-2">Preview</p>
              <Button className="h-11" size={element.buttonStyle === 'icon-only' ? 'icon' : 'default'}>
                {showIconPicker && (
                  <EditorIconComponent className={`h-4 w-4 ${element.buttonStyle !== 'icon-only' ? 'mr-2' : ''}`} />
                )}
                {element.buttonStyle !== 'icon-only' && (element.label || 'Button')}
              </Button>
            </div>
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
          <FloatingInput
            label={label}
            value=""
            onChange={() => {}}
            placeholder={element.placeholder}
          />
        );
      
      case 'textarea':
        return (
          <FloatingTextarea
            label={label}
            value=""
            onChange={() => {}}
            placeholder={element.placeholder}
          />
        );
      
      case 'select':
        return (
          <FloatingSelect
            label={label}
            value=""
            onChange={() => {}}
            options={element.options || []}
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-3 h-11">
            <Checkbox />
            {label && <span className="text-sm text-foreground">{label}</span>}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {label && <label className="text-xs text-muted-foreground font-medium">{label}</label>}
            <RadioGroup>
              {(element.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <RadioGroupItem value={opt} id={`${element.id}-${i}`} />
                  <label htmlFor={`${element.id}-${i}`} className="text-sm text-foreground">{opt}</label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      
      case 'button':
        const PreviewIconComponent = ICON_OPTIONS.find(i => i.value === element.icon)?.Icon || Check;
        const hasIcon = element.buttonStyle === 'icon-text' || element.buttonStyle === 'icon-only';
        return (
          <Button className="w-full h-11" size={element.buttonStyle === 'icon-only' ? 'icon' : 'default'}>
            {hasIcon && (
              <PreviewIconComponent className={`h-4 w-4 ${element.buttonStyle !== 'icon-only' ? 'mr-2' : ''}`} />
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
    <div className="p-5">
      <div className={`grid ${gridCols} gap-4`}>
        {formLayout.elements.map((element, index) => (
          <div key={element.id} className="relative">
            {!isPreviewMode && formLayout.columns > 1 && (
              <button
                onClick={() => handleRemoveColumn(index)}
                className="absolute -top-2 -right-2 z-10 p-1 bg-white border border-[#E8EDF2] rounded-full shadow-sm text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
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
            className="h-full min-h-[80px] flex items-center justify-center border-2 border-dashed border-[#E8EDF2] rounded-lg text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
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
