import React, { useState } from 'react';
import styled from 'styled-components';
import { exportAnimation, ExportFormat } from '../services/exportService';
import { theme } from '../styles/theme';

const ExportContainer = styled.div`
  margin-top: ${theme.spacing.large};
`;

const Select = styled.select`
  margin-right: ${theme.spacing.medium};
  padding: ${theme.spacing.small};
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  background-color: white;
`;

const Button = styled.button`
  padding: ${theme.spacing.small} ${theme.spacing.medium};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.secondary};
  }
`;

interface ExportOptionsProps {
  previewRef: React.RefObject<HTMLDivElement>;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ previewRef }) => {
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.PNG);

  const handleExport = () => {
    if (previewRef.current) {
      exportAnimation(
        previewRef.current,
        format,
        'code-animation',
        30, // frames per second
        5, // duration in seconds
        (progress: number) => {
          console.log(`Export progress: ${progress * 100}%`);
        },
        (error: Error) => {
          console.error('Export error:', error);
        }
      );
    }
  };

  return (
    <ExportContainer>
      <Select value={format} onChange={(e) => setFormat(e.target.value as ExportFormat)}>
        <option value={ExportFormat.PNG}>PNG</option>
        <option value={ExportFormat.GIF}>GIF</option>
        <option value={ExportFormat.MP4}>MP4</option>
        <option value={ExportFormat.WebM}>WebM</option>
        <option value={ExportFormat.SVG}>SVG</option>
      </Select>
      <Button onClick={handleExport}>Export</Button>
    </ExportContainer>
  );
};

export default ExportOptions;