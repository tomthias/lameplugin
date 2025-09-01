export const PREDEFINED_TEMPLATES = [
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
