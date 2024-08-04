# Code Animator

Code Animator is a powerful web application that allows users to create animated code snippets and export them in various formats. It's perfect for developers who want to create engaging presentations, tutorials, or social media content featuring code animations.

## Features

- Interactive code editor with syntax highlighting
- Real-time animation preview
- Customizable animation speed and pause durations
- Export animations in multiple formats (PNG, GIF, MP4, WebM, SVG)
- Dynamic sizing of animation frames to accommodate growing code
- Syntax highlighting in exported animations

## Tech Stack

- React
- TypeScript
- Styled Components
- Monaco Editor
- Highlight.js
- GIF.js
- FFmpeg.wasm
- HTML2Canvas
- SVG.js

## Cool Implementations

1. Dynamic frame generation:
```typescript:code-animator/src/services/animationEngine.ts
startLine: 14
endLine: 40
```

2. Real-time animation preview:
```typescript:code-animator/src/components/AnimationPreview.tsx
startLine: 26
endLine: 80
```

3. Multi-format export functionality:
```typescript:code-animator/src/services/exportService.ts
startLine: 23
endLine: 57
```

4. GIF export with dynamic sizing:
```typescript:code-animator/src/services/exportService.ts
startLine: 71
endLine: 147
```

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production

## Future Implementations

1. User accounts and cloud storage for animations
2. More customization options (themes, fonts, background colors)
3. Collaborative editing features
4. Integration with version control systems
5. API for programmatic animation generation
6. Mobile app for on-the-go code animation creation

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.