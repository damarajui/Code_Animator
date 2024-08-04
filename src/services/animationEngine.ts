import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface AnimationOptions {
  speed: number;
  pauseLines: number[];
  pauseDuration: number;
}

const highlightCode = (code: string, language: string): string => {
  return hljs.highlight(code, { language }).value;
};

export const animateCode = (
  code: string,
  options: AnimationOptions = { speed: 50, pauseLines: [], pauseDuration: 1000 }
): Promise<string[]> => {
  return new Promise((resolve) => {
    const frames: string[] = [];
    let currentFrame = '';
    const lines = code.split('\n');

    lines.forEach((line, lineIndex) => {
      if (options.pauseLines.includes(lineIndex)) {
        const pauseFrames = Math.floor(options.pauseDuration / options.speed);
        for (let i = 0; i < pauseFrames; i++) {
          frames.push(currentFrame);
        }
      }

      for (let char of line) {
        currentFrame += char;
        frames.push(currentFrame);
      }
      currentFrame += '\n';
    });

    resolve(frames);
  });
};