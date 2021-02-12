import { Composition } from 'remotion';
import { Emojis } from './Emojis';
import { FavoriteEmojis } from './FavoriteEmojis';
import { Title } from './Title';

const duration = 2.5;
const fps = 30;
const durationInFrames = duration * fps;

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="FavoriteEmojis"
        component={FavoriteEmojis}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          name: 'John Doe',
          emojis: ['🙌', '😂', '✨', '😅'],
        }}
      />
      <Composition
        id="Title"
        component={Title}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          name: 'John Doe',
        }}
      />
      <Composition
        id="Emojis"
        component={Emojis}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          emojis: ['🙌', '😂', '✨', '😅'],
        }}
      />
    </>
  );
};
