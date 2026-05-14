import ReactMarkdown from 'react-markdown';
import { useContactStore, useChatStore, useProfileStore } from '../configurationFiles/config.ts';
import { request_get_messages } from '../configurationFiles/requests.ts';

export function ContactComponent({ contact }) {
  const profile = useProfileStore((state) => state.profile);
  const membersData = useContactStore((state) => state.contacts);
  const activeChat = useChatStore((state) => state.activityChat);

  const clickOnContact = async () => {
    const chatStory = await request_get_messages(contact[0]);

    useChatStore.getState().setChatStory(chatStory.messages);
    useChatStore.getState().setActivityChat(contact[0]);
  };

  return (
    <div
      onClick={clickOnContact}
      className="bg-plate-accent hover:bg-plate-hover ease flex cursor-pointer flex-col gap-[clamp(5px,1vh,10px)] rounded-[15px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] transition-all duration-300"
      style={activeChat == contact[0] ? { backgroundColor: '#E5E5E5' } : {}}
    >
      {contact[1].map((member, index) =>
        member == profile.id ? (
          <></>
        ) : (
          <div key={index} className="flex flex-row items-center gap-[clamp(5px,1vw,20px)]">
            <img
              className="h-[clamp(32px,6vw,64px)] w-[clamp(32px,6vw,64px)] rounded-[360px]"
              src={membersData.find((element) => element.id == member).avatar}
              alt="avatar"
            />
            <p className="self-center text-[clamp(1rem,2.5vw,2rem)]">
              {membersData.find((element) => element.id == member).nickname}
            </p>
          </div>
        ),
      )}
      <div>
        <ReactMarkdown></ReactMarkdown>
      </div>
    </div>
  );
}
