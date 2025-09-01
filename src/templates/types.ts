export interface TemplateItem {
  type: 'sticky' | 'section' | 'connector';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color?: string;
  fontSize?: number;
}

export interface TemplateSection {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  items: TemplateItem[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: TemplateSection[];
  preview?: string;
}