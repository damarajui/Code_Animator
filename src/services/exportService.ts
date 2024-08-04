import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import GIF from 'gif.js';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import hljs from 'highlight.js';
import { SVG } from '@svgdotjs/svg.js';

export enum ExportFormat {
  PNG = 'png',
  GIF = 'gif',
  MP4 = 'mp4',
  WebM = 'webm',
  SVG = 'svg'
}

class ExportError extends Error {
  constructor(format: ExportFormat, message: string) {
    super(`Error exporting ${format}: ${message}`);
    this.name = 'ExportError';
  }
}

export const exportAnimation = async (
  element: HTMLElement,
  format: ExportFormat,
  fileName: string,
  fps: number = 30,
  duration: number = 5,
  onProgress: (progress: number) => void,
  onError: (error: Error) => void
): Promise<void> => {
  try {
    switch (format) {
      case ExportFormat.PNG:
        await exportPNG(element, fileName);
        break;
      case ExportFormat.GIF:
        await exportGIF(element, fileName, fps, duration, onProgress);
        break;
      case ExportFormat.MP4:
      case ExportFormat.WebM:
        if (!await isFFmpegSupported()) {
          throw new ExportError(format, 'FFmpeg is not supported in this environment');
        }
        await exportVideo(element, fileName, format, fps, duration, onProgress);
        break;
      case ExportFormat.SVG:
        await exportSVG(element, fileName);
        break;
      default:
        throw new ExportError(format, 'Unsupported export format');
    }
    onProgress(100);
  } catch (error) {
    onError(error instanceof Error ? error : new ExportError(format, 'Unknown error occurred'));
  }
};

const exportPNG = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
    const dataUrl = await toPng(element);
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    throw new ExportError(ExportFormat.PNG, error instanceof Error ? error.message : 'Unknown error');
  }
};

const exportGIF = async (element: HTMLElement, fileName: string, fps: number, duration: number, onProgress: (progress: number) => void): Promise<void> => {
  try {
    const codeElement = element.querySelector('code') as HTMLElement;
    const frames = JSON.parse(codeElement.dataset.frames || '[]');
    const totalFrames = frames.length;
    const delay = 1000 / fps;

    const workerScript = await fetch('/gif.worker.js').then(response => response.text());
    const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);

    const tempElement = element.cloneNode(true) as HTMLElement;
    document.body.appendChild(tempElement);
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    tempElement.style.top = '-9999px';
    tempElement.style.width = 'auto';
    tempElement.style.height = 'auto';

    const tempCodeElement = tempElement.querySelector('code') as HTMLElement;

    // Calculate maximum dimensions
    let maxWidth = 0;
    let maxHeight = 0;
    for (const frame of frames) {
      tempCodeElement.textContent = frame;
      hljs.highlightElement(tempCodeElement);
      maxWidth = Math.max(maxWidth, tempElement.offsetWidth);
      maxHeight = Math.max(maxHeight, tempElement.offsetHeight);
    }

    const gif = new GIF({
      workers: navigator.hardwareConcurrency || 2,
      quality: 10,
      width: maxWidth,
      height: maxHeight,
      workerScript: workerUrl
    });

    for (let i = 0; i < totalFrames; i++) {
      tempCodeElement.textContent = frames[i];
      hljs.highlightElement(tempCodeElement);
      
      const svg = SVG().size(maxWidth, maxHeight);
      svg.foreignObject(maxWidth, maxHeight).add(SVG(tempElement.outerHTML));
      const svgString = svg.svg();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgString;
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement);

      gif.addFrame(canvas, { copy: true, delay });
      onProgress((i / totalFrames) * 90);
    }

    document.body.removeChild(tempElement);

    return new Promise((resolve, reject) => {
      gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${fileName}.gif`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(workerUrl);
        onProgress(100);
        resolve();
      });

      gif.on('progress', (p) => onProgress(90 + p * 10));

      gif.render();
    });
  } catch (error) {
    throw new ExportError(ExportFormat.GIF, error instanceof Error ? error.message : 'Unknown error');
  }
};

const isFFmpegSupported = async (): Promise<boolean> => {
  try {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();
    return true;
  } catch (error) {
    return false;
  }
};

const exportVideo = async (element: HTMLElement, fileName: string, format: ExportFormat, fps: number, duration: number, onProgress: (progress: number) => void): Promise<void> => {
  try {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    const frames = Math.floor(fps * duration);
    const inputFiles: string[] = [];

    for (let i = 0; i < frames; i++) {
      const canvas = await html2canvas(element);
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve as BlobCallback));
      const arrayBuffer = await blob.arrayBuffer();
      const fileName = `frame_${i.toString().padStart(4, '0')}.png`;
      await ffmpeg.writeFile(fileName, new Uint8Array(arrayBuffer));
      inputFiles.push(fileName);
      onProgress((i / frames) * 50);
    }

    const outputExtension = format === ExportFormat.MP4 ? 'mp4' : 'webm';
    const outputFileName = `${fileName}.${outputExtension}`;

    await ffmpeg.exec([
      '-framerate', fps.toString(),
      '-i', 'frame_%04d.png',
      '-c:v', format === ExportFormat.MP4 ? 'libx264' : 'libvpx-vp9',
      '-pix_fmt', 'yuv420p',
      outputFileName
    ]);

    const data = await ffmpeg.readFile(outputFileName);
    const uint8Array = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
    const blob = new Blob([uint8Array], { type: `video/${outputExtension}` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = outputFileName;
    link.click();

    // Clean up
    for (const file of inputFiles) {
      await ffmpeg.deleteFile(file);
    }
    await ffmpeg.deleteFile(outputFileName);

    onProgress(100);
  } catch (error) {
    throw new ExportError(format, error instanceof Error ? error.message : 'Unknown error');
  }
};

const exportSVG = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
    const canvas = await html2canvas(element);
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${element.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.svg`;
    link.click();
  } catch (error) {
    throw new ExportError(ExportFormat.SVG, error instanceof Error ? error.message : 'Unknown error');
  }
};