import React, { useState, useEffect, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { animateCode } from '../services/animationEngine';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { SVG } from '@svgdotjs/svg.js';

const PreviewContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  font-family: monospace;
  white-space: pre-wrap;
  overflow: auto;
  max-height: 80vh;
  resize: vertical;
`;

interface AnimationPreviewProps {
  code: string;
  speed: number;
  pauseLines: number[];
  pauseDuration: number;
}

const AnimationPreview = forwardRef<HTMLDivElement, AnimationPreviewProps>((props, ref) => {
  const [animatedCode, setAnimatedCode] = useState('');
  const [frames, setFrames] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const generateFrames = async () => {
      const newFrames = await animateCode(props.code, {
        speed: props.speed,
        pauseLines: props.pauseLines,
        pauseDuration: props.pauseDuration
      });
      setFrames(newFrames);
    };

    generateFrames();
  }, [props.code, props.speed, props.pauseLines, props.pauseDuration]);

  useEffect(() => {
    let frameIndex = 0;
    const interval = setInterval(() => {
      if (frameIndex < frames.length) {
        setAnimatedCode(frames[frameIndex]);
        frameIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1000 / props.speed);

    return () => clearInterval(interval);
  }, [frames, props.speed]);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
    
    // Adjust container size
    if (previewRef.current && codeRef.current) {
      const codeHeight = codeRef.current.scrollHeight;
      previewRef.current.style.height = `${Math.min(codeHeight + 40, window.innerHeight * 0.8)}px`;
    }
  }, [animatedCode]);

  return (
    <PreviewContainer ref={ref}>
      <pre>
        <code ref={codeRef} className="language-javascript" data-frames={JSON.stringify(frames)}>
          {animatedCode}
        </code>
      </pre>
    </PreviewContainer>
  );
});

export default AnimationPreview;