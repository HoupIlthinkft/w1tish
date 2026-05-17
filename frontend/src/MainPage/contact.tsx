import ReactMarkdown from 'react-markdown';
import { useContactStore, useChatStore, useProfileStore } from '../configurationFiles/config.ts';
import { request_get_messages } from '../configurationFiles/requests.ts';

export function ContactComponent({ contact }) {
  const profile = useProfileStore((state) => state.profile);
  const membersData = useContactStore((state) => state.contacts);
  const activeChat = useChatStore((state) => state.activityChat);
  const setOffset = useChatStore((state) => state.setOffset);

  console.log(contact);
  const clickOnContact = async () => {
    const chatStory = await request_get_messages(contact.chat_id);
    setOffset(0);
    useChatStore.getState().setChatStory(chatStory.messages.reverse());
    useChatStore.getState().setActivityChat(contact.chat_id);
  };
  const member = contact.permissions.find((member) => member != profile.id);
  return (
    <div
      onClick={clickOnContact}
      className="bg-plate-accent hover:bg-plate-hover ease flex cursor-pointer flex-col items-start gap-[clamp(5px,1vh,10px)] rounded-[15px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] transition-all duration-300"
      style={activeChat == contact.chat_id ? { backgroundColor: '#E5E5E5' } : {}}
    >
      <div key={member} className="flex flex-row items-center gap-[clamp(5px,1vw,20px)]">
        <img
          className="h-4 w-4 rounded-[360px] md:h-8 md:w-8 xl:h-16 xl:w-16"
          src={membersData.find((element) => element.id == member).avatar_url}
          alt="avatar"
        />
        <p className="w-[calc(100%-16px)] self-center overflow-hidden text-[clamp(1rem,1.5vw,1.5rem)] text-ellipsis whitespace-nowrap md:w-[calc(100%-32px)] xl:w-[calc(100%-64px)]">
          {membersData.find((element) => element.id == member).nickname}
        </p>
      </div>
      <div className="flex max-w-full flex-col overflow-hidden text-ellipsis whitespace-nowrap">
        <ReactMarkdown>{contact.last_message}</ReactMarkdown>
        <p className="text-[clamp(0.25rem,0.75vw,0.75rem)] font-light">
          {new Intl.DateTimeFormat('ru', {
            dateStyle: 'full',
            timeStyle: 'short',
          }).format(new Date(contact.last_message_time))}
        </p>
      </div>
    </div>
  );
}
