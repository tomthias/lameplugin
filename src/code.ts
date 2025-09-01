// Template Wizard Plugin - Creates predefined templates for brainstorming and collaboration

// Template type definitions
interface TemplateItem {
  type: 'sticky' | 'section' | 'connector';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color?: string;
  fontSize?: number;
}

interface TemplateSection {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  items: TemplateItem[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: TemplateSection[];
  preview?: string;
}

// Predefined templates
const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'retrospective',
    name: 'Sprint Retrospective',
    description: 'What went well, what could be improved, action items',
    category: 'Agile',
    sections: [
      {
        title: '🟢 What went well',
        x: 50,
        y: 100,
        width: 300,
        height: 400,
        items: [
          {
            type: 'sticky',
            x: 70,
            y: 150,
            text: 'Add your positive feedback here...',
            color: '#4CAF50'
          }
        ]
      },
      {
        title: '🔴 What could be improved',
        x: 400,
        y: 100,
        width: 300,
        height: 400,
        items: [
          {
            type: 'sticky',
            x: 420,
            y: 150,
            text: 'What challenges did we face?',
            color: '#F44336'
          }
        ]
      },
      {
        title: '🚀 Action Items',
        x: 750,
        y: 100,
        width: 300,
        height: 400,
        items: [
          {
            type: 'sticky',
            x: 770,
            y: 150,
            text: 'What will we do differently?',
            color: '#2196F3'
          }
        ]
      }
    ]
  },
  {
    id: 'brainstorming',
    name: 'Creative Brainstorming',
    description: 'Generate, expand, and prioritize ideas',
    category: 'Ideation',
    sections: [
      {
        title: '💡 Initial Ideas',
        x: 50,
        y: 100,
        width: 400,
        height: 300,
        items: [
          {
            type: 'sticky',
            x: 70,
            y: 150,
            text: 'Idea 1',
            color: '#FFEB3B'
          },
          {
            type: 'sticky',
            x: 70,
            y: 220,
            text: 'Idea 2',
            color: '#FFEB3B'
          }
        ]
      },
      {
        title: '🔍 Expanded Concepts',
        x: 500,
        y: 100,
        width: 400,
        height: 300,
        items: [
          {
            type: 'sticky',
            x: 520,
            y: 150,
            text: 'Build on the best ideas...',
            color: '#FF9800'
          }
        ]
      },
      {
        title: '⭐ Top Priorities',
        x: 300,
        y: 450,
        width: 300,
        height: 200,
        items: [
          {
            type: 'sticky',
            x: 320,
            y: 500,
            text: 'Most important idea',
            color: '#9C27B0'
          }
        ]
      }
    ]
  },
  {
    id: 'user-journey',
    name: 'User Journey Map',
    description: 'Map user experience from start to finish',
    category: 'UX Research',
    sections: [
      {
        title: '🎯 Awareness',
        x: 50,
        y: 100,
        width: 200,
        height: 300,
        items: [
          {
            type: 'sticky',
            x: 70,
            y: 150,
            text: 'User discovers product',
            color: '#E1BEE7'
          },
          {
            type: 'sticky',
            x: 70,
            y: 220,
            text: '😐 Neutral',
            color: '#FFF9C4'
          }
        ]
      },
      {
        title: '🤔 Consideration',
        x: 300,
        y: 100,
        width: 200,
        height: 300,
        items: [
          {
            type: 'sticky',
            x: 320,
            y: 150,
            text: 'Evaluates options',
            color: '#E1BEE7'
          },
          {
            type: 'sticky',
            x: 320,
            y: 220,
            text: '🤔 Curious',
            color: '#FFF9C4'
          }
        ]
      },
      {
        title: '💳 Purchase',
        x: 550,
        y: 100,
        width: 200,
        height: 300,
        items: [
          {
            type: 'sticky',
            x: 570,
            y: 150,
            text: 'Makes decision',
            color: '#E1BEE7'
          },
          {
            type: 'sticky',
            x: 570,
            y: 220,
            text: '😊 Excited',
            color: '#FFF9C4'
          }
        ]
      },
      {
        title: '🔄 Retention',
        x: 800,
        y: 100,
        width: 200,
        height: 300,
        items: [
          {
            type: 'sticky',
            x: 820,
            y: 150,
            text: 'Uses product',
            color: '#E1BEE7'
          },
          {
            type: 'sticky',
            x: 820,
            y: 220,
            text: '❤️ Satisfied',
            color: '#FFF9C4'
          }
        ]
      }
    ]
  }
];

// Template Generator Class
class TemplateGenerator {
  
  async generateTemplate(template: Template): Promise<void> {
    console.log(`Generating template: ${template.name}`);
    
    // Load fonts first
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    } catch (error) {
      console.warn('Could not load Inter font, using default');
    }
    
    // Create main frame for the template
    const mainFrame = figma.createFrame();
    mainFrame.name = template.name;
    mainFrame.resize(1200, 800);
    mainFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
    
    figma.currentPage.appendChild(mainFrame);
    
    // Generate each section
    for (const section of template.sections) {
      await this.generateSection(section, mainFrame);
    }
    
    // Center the template in viewport
    figma.viewport.scrollAndZoomIntoView([mainFrame]);
    figma.currentPage.selection = [mainFrame];
  }
  
  private async generateSection(section: TemplateSection, parent: FrameNode): Promise<void> {
    // Create section frame
    const sectionFrame = figma.createFrame();
    sectionFrame.name = section.title;
    sectionFrame.resize(section.width, section.height);
    sectionFrame.x = section.x;
    sectionFrame.y = section.y;
    sectionFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    sectionFrame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    sectionFrame.strokeWeight = 2;
    sectionFrame.cornerRadius = 8;
    
    parent.appendChild(sectionFrame);
    
    // Add section title
    const titleText = figma.createText();
    try {
      titleText.fontName = { family: "Inter", style: "Bold" };
    } catch (error) {
      console.warn('Using default font for title');
    }
    titleText.characters = section.title;
    titleText.fontSize = 18;
    titleText.x = 16;
    titleText.y = 16;
    titleText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
    
    sectionFrame.appendChild(titleText);
    
    // Generate items in the section
    for (const item of section.items) {
      await this.generateItem(item, sectionFrame);
    }
  }
  
  private async generateItem(item: TemplateItem, parent: FrameNode): Promise<void> {
    switch (item.type) {
      case 'sticky':
        await this.generateStickyNote(item, parent);
        break;
      case 'section':
        // Handle section items if needed
        break;
      case 'connector':
        // Handle connectors if needed
        break;
    }
  }
  
  private async generateStickyNote(item: TemplateItem, parent: FrameNode): Promise<void> {
    // Create sticky note as a frame
    const sticky = figma.createFrame();
    sticky.name = "Sticky Note";
    sticky.resize(item.width || 200, item.height || 100);
    sticky.x = item.x - parent.x;
    sticky.y = item.y - parent.y;
    sticky.cornerRadius = 4;
    
    // Set sticky note color
    const color = this.hexToRgb(item.color || '#FFEB3B');
    sticky.fills = [{ type: 'SOLID', color }];
    
    parent.appendChild(sticky);
    
    // Add text to sticky note
    if (item.text) {
      const text = figma.createText();
      try {
        text.fontName = { family: "Inter", style: "Regular" };
      } catch (error) {
        console.warn('Using default font for sticky note text');
      }
      text.characters = item.text;
      text.fontSize = item.fontSize || 14;
      text.textAutoResize = "HEIGHT";
      text.x = 12;
      text.y = 12;
      text.resize(sticky.width - 24, text.height);
      text.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
      
      sticky.appendChild(text);
    }
  }
  
  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 1, b: 0 }; // Default to yellow
  }
}

// Plugin main logic
figma.showUI(__html__, { width: 400, height: 500 });

// Send available templates to UI
figma.ui.postMessage({
  type: 'templates-loaded',
  templates: PREDEFINED_TEMPLATES
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-template') {
    const template = PREDEFINED_TEMPLATES.find(t => t.id === msg.templateId);
    
    if (!template) {
      figma.notify('Template not found!', { error: true });
      return;
    }

    try {
      const generator = new TemplateGenerator();
      await generator.generateTemplate(template);
      
      figma.notify(`✅ ${template.name} template created successfully!`);
      figma.closePlugin();
      
    } catch (error) {
      console.error('Error generating template:', error);
      figma.notify('Error creating template. Please try again.', { error: true });
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};