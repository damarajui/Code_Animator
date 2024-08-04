import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import CodeInput from '../components/CodeInput';
import AnimationPreview from '../components/AnimationPreview';
import ExportOptions from '../components/ExportOptions';
import Settings from '../components/Settings';
import { theme } from '../styles/theme';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.large};
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.large};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.large};
`;

const Home: React.FC = () => {
  const [code, setCode] = useState('');
  const [speed, setSpeed] = useState(5);
  const [pauseDuration, setPauseDuration] = useState(500);
  const [pauseLines, setPauseLines] = useState<number[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <HomeContainer>
      <Title>Code Animator</Title>
      <Grid>
        <div>
          <CodeInput code={code} setCode={setCode} />
          <Settings
            speed={speed}
            setSpeed={setSpeed}
            pauseDuration={pauseDuration}
            setPauseDuration={setPauseDuration}
          />
        </div>
        <div>
          <AnimationPreview
            code={code}
            speed={speed}
            pauseDuration={pauseDuration}
            pauseLines={pauseLines}
            ref={previewRef}
          />
          <ExportOptions previewRef={previewRef} />
        </div>
      </Grid>
    </HomeContainer>
  );
};

export default Home;