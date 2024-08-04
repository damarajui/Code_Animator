import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const SettingsContainer = styled.div`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.medium};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SettingGroup = styled.div`
  margin-bottom: ${theme.spacing.medium};
`;

const SettingLabel = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.small};
  font-weight: bold;
`;

const SettingInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.small};
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
`;

interface SettingsProps {
  speed: number;
  setSpeed: (speed: number) => void;
  pauseDuration: number;
  setPauseDuration: (duration: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  speed,
  setSpeed,
  pauseDuration,
  setPauseDuration,
}) => {
  return (
    <SettingsContainer>
      <SettingGroup>
        <SettingLabel htmlFor="speed">Animation Speed</SettingLabel>
        <SettingInput
          type="range"
          id="speed"
          min="1"
          max="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </SettingGroup>
      <SettingGroup>
        <SettingLabel htmlFor="pauseDuration">Pause Duration (ms)</SettingLabel>
        <SettingInput
          type="number"
          id="pauseDuration"
          value={pauseDuration}
          onChange={(e) => setPauseDuration(Number(e.target.value))}
        />
      </SettingGroup>
    </SettingsContainer>
  );
};

export default Settings;
