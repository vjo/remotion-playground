import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Title: React.FC<{
  name: string;
}> = ({ name }) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();
  const text = `${name}'s favorite emojis`;
  const textArray = text.split(' ').map((t) => ` ${t} `);
  const opacity = interpolate(frame, [50, videoConfig.durationInFrames], [1, 0]);

  return (
    <h1
      style={{
        fontFamily: 'SF Pro Text, Helvetica, Arial',
        fontWeight: 'bold',
        fontSize: 120,
        textAlign: 'center',
        position: 'absolute',
        top: 160,
        width: '100%',
        opacity,
      }}
    >
      {textArray.map((t, i) => {
        return (
          <span
            key={t}
            style={{
              color: '#363636',
              marginLeft: 10,
              marginRight: 10,
              transform: `scale(${spring({
                fps: videoConfig.fps,
                frame: frame - i * 5,
                config: {
                  damping: 100,
                  stiffness: 200,
                  mass: 0.5,
                },
              })})`,
              display: 'inline-block',
            }}
          >
            {t}
          </span>
        );
      })}
    </h1>
  );
};
