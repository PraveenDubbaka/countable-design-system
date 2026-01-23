import { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Superscript,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  ChevronDown,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RichTextToolbarProps {
  position: { x: number; y: number };
  onFormatAction?: (action: string, value?: string) => void;
  onAIAssist?: () => void;
  toolbarRef?: React.RefObject<HTMLDivElement>;
}

export function RichTextToolbar({ position, onFormatAction, onAIAssist, toolbarRef }: RichTextToolbarProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = toolbarRef || localRef;
  const [textColor, setTextColor] = useState('#000000');

  const handleFormat = (action: string, value?: string) => {
    onFormatAction?.(action, value);
  };

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
  ];

  const textStyles = [
    { label: 'Normal text', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
  ];

  return (
    <div
      ref={ref}
      className="fixed z-[100] flex items-center gap-0.5 bg-card border rounded-lg shadow-lg px-2 py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)',
      }}
      data-rich-text-toolbar
    >
      {/* Text Style Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs font-normal">
            Normal text
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[140px]">
          {textStyles.map((style) => (
            <DropdownMenuItem
              key={style.value}
              onClick={() => handleFormat('textStyle', style.value)}
              className="text-sm"
            >
              {style.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Text Color Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <div className="flex flex-col items-center">
              <Type className="h-3.5 w-3.5" />
              <div 
                className="w-3 h-0.5 rounded-sm mt-0.5" 
                style={{ backgroundColor: textColor }}
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[120px]">
          {colors.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={() => {
                setTextColor(color.value);
                handleFormat('textColor', color.value);
              }}
              className="flex items-center gap-2"
            >
              <div 
                className="w-4 h-4 rounded border" 
                style={{ backgroundColor: color.value }}
              />
              <span className="text-sm">{color.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Formatting Buttons */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('bold')}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('italic')}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('underline')}
        title="Underline"
      >
        <Underline className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Superscript */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('superscript')}
        title="Superscript"
      >
        <Superscript className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* List Options */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('bulletList')}
        title="Bullet list"
      >
        <List className="h-3.5 w-3.5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('numberedList')}
        title="Numbered list"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </Button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Alignment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleFormat('alignLeft')}>
            <AlignLeft className="h-4 w-4 mr-2" />
            Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormat('alignCenter')}>
            <AlignCenter className="h-4 w-4 mr-2" />
            Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFormat('alignRight')}>
            <AlignRight className="h-4 w-4 mr-2" />
            Right
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Undo/Redo */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('undo')}
        title="Undo"
      >
        <Undo className="h-3.5 w-3.5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0"
        onClick={() => handleFormat('redo')}
        title="Redo"
      >
        <Redo className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
