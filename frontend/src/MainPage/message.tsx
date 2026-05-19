import ReactMarkdown from 'react-markdown';
import { useProfileStore } from '../configurationFiles/config.ts';

export function MessageComponent({ message }) {
  const profile = useProfileStore((state) => state.profile);

  return (
    <div
      className="flex w-fit max-w-[75%] shrink-0 flex-col justify-end overflow-hidden rounded-[30px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,1vh,10px)] wrap-break-word whitespace-normal *:first:max-w-full"
      style={
        message.sender == profile.id
          ? {
              borderBottomRightRadius: 0,
              alignSelf: 'end',
              backgroundColor: 'var(--color-plate-hover)',
              alignItems: 'end',
            }
          : {
              borderBottomLeftRadius: 0,
              alignSelf: 'start',
              backgroundColor: 'var(--color-plate-bg)',
              alignItems: 'start',
            }
      }
    >
      <ReactMarkdown>{message.content}</ReactMarkdown>
      <p className="text-[clamp(0.25rem,0.5vw,0.5rem)] font-light">
        {new Intl.DateTimeFormat('ru', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date(message.created_at))}
      </p>
    </div>
  );
}
