import ReactMarkdown from 'react-markdown';
import { useProfileStore } from '../configurationFiles/config.ts';

export function MessageComponent({ message }) {
  const profile = useProfileStore((state) => state.profile);
  //   const activityChat = useChatStore((state) => state.activityChat);

  //    const oponentId = profile.chats[activityChat].find((member) => member != profile.id);
  console.log(message);
  return (
    <div
      className="bg-plate-bg mt-auto flex w-fit max-w-[75%] flex-col justify-end rounded-[30px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,1vh,10px)] wrap-break-word"
      style={
        message.sender == profile.id
          ? { borderBottomRightRadius: 0, alignSelf: 'end' }
          : { borderBottomLeftRadius: 0, alignSelf: 'start' }
      }
    >
      <ReactMarkdown>{message.content}</ReactMarkdown>
      <p className="self-end text-[clamp(0.25rem,0.5vw,0.5rem)] font-light">
        {new Intl.DateTimeFormat('ru', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date(message.created_at))}
      </p>
    </div>
  );
}
