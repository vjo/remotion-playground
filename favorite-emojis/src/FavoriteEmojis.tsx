import { interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Emojis } from './Emojis';
import { Title } from './Title';

export const FavoriteEmojis: React.FC<{
  name: string;
  emojis: string[];
}> = ({ name, emojis }) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const opacity = interpolate(frame, [videoConfig.durationInFrames - 25, videoConfig.durationInFrames - 15], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const transitionStart = 20;

  return (
    <div style={{ flex: 1, backgroundColor: 'white' }}>
      <div style={{ opacity }}>
        <Sequence from={0} durationInFrames={videoConfig.durationInFrames}>
          <Title name={name} />
        </Sequence>
        <Sequence from={transitionStart} durationInFrames={Infinity}>
          <Emojis emojis={emojis} />
        </Sequence>
      </div>
    </div>
  );
};
