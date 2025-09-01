export class TemplateGenerator {
    generateTemplate(template) {
        console.log(`Generating template: ${template.name}`);
        // Create main frame for the template
        const mainFrame = figma.createFrame();
        mainFrame.name = template.name;
        mainFrame.resize(1200, 800);
        mainFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
        figma.currentPage.appendChild(mainFrame);
        // Generate each section
        template.sections.forEach(section => {
            this.generateSection(section, mainFrame);
        });
        // Center the template in viewport
        figma.viewport.scrollAndZoomIntoView([mainFrame]);
        figma.currentPage.selection = [mainFrame];
    }
    generateSection(section, parent) {
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
        titleText.characters = section.title;
        titleText.fontSize = 18;
        titleText.fontName = { family: "Inter", style: "Bold" };
        titleText.x = 16;
        titleText.y = 16;
        titleText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
        sectionFrame.appendChild(titleText);
        // Generate items in the section
        section.items.forEach(item => {
            this.generateItem(item, sectionFrame);
        });
    }
    generateItem(item, parent) {
        switch (item.type) {
            case 'sticky':
                this.generateStickyNote(item, parent);
                break;
            case 'section':
                // Handle section items if needed
                break;
            case 'connector':
                // Handle connectors if needed
                break;
        }
    }
    generateStickyNote(item, parent) {
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
            text.characters = item.text;
            text.fontSize = item.fontSize || 14;
            text.fontName = { family: "Inter", style: "Regular" };
            text.textAutoResize = "HEIGHT";
            text.x = 12;
            text.y = 12;
            text.resize(sticky.width - 24, text.height);
            text.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
            sticky.appendChild(text);
        }
    }
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 1, g: 1, b: 0 }; // Default to yellow
    }
}
