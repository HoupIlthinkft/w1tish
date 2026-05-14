import ReactMarkdown from 'react-markdown';
import { useProfileStore } from '../configurationFiles/config.ts';

export function MessageComponent({ message }) {
  const profile = useProfileStore((state) => state.profile);
  //   const activityChat = useChatStore((state) => state.activityChat);

  //    const oponentId = profile.chats[activityChat].find((member) => member != profile.id);

  return (
    <div
      className="bg-plate-bg w-fit rounded-[15px] px-[clamp(5px,0.5vw,10px)] py-[clamp(5px,1vh,10px)]"
      style={
        message.sender == profile.id
          ? { borderBottomRightRadius: 0, alignSelf: 'end' }
          : { borderBottomRightRadius: 0, alignSelf: 'start' }
      }
    >
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </div>
  );
}
