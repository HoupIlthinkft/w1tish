import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useChatStore, useProfileStore, useContactStore } from '../configurationFiles/config.ts';
import { request_get_messages } from '../configurationFiles/requests.ts';
import { send_new_message } from '../configurationFiles/webSocketsConnection.ts';

import { MessageComponent } from './message.tsx';

export function ChatComponent() {
  const [activityMemberProfile, setActivityMemberProfile] = useState(false);
  const [offset, setOffset] = useState(50);
  const inputMessage = useRef(null);

  const profile = useProfileStore((state) => state.profile);
  const chatStory = useChatStore((state) => state.chatStory);
  const activityChat = useChatStore((state) => state.activityChat);
  const membersData = useContactStore((state) => state.contacts);

  const sendMessage = () => {
    if (inputMessage.current.value.trim() != '') {
      send_new_message(useChatStore.getState().activityChat, inputMessage.current?.value);
      inputMessage.current.value = '';
    }
  };

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;

    if (target.scrollTop === 0) {
      const chatStory = await request_get_messages(useChatStore.getState().activityChat, offset);
      setOffset(offset + 50);
      useChatStore.getState().loadChatStory(chatStory.messages.reverse());
    }
  };

  return (
    <div className="bg-plate-muted h-full w-full flex-col justify-between flex">
      {activityChat == null ? (
        <div className="flex h-full flex-col items-center justify-center gap-[clamp(5px,2vh,20px)]">
          <p className="text-plate-hover font-[Jost] text-[clamp(4rem,8vw,8rem)] font-semibold">
            W1tish
          </p>
          <h1 className="text-[clamp(1rem,4vw,4rem)] font-bold">Здесь пока ничего нету</h1>
          <h1 className="text-[clamp(2rem,6vw,6rem)] font-bold">{'(._. )'}</h1>
          <h4 className="text-[clamp(0.5rem,2vw,2rem)] font-medium">
            Выберите чат из списка слева
          </h4>
        </div>
      ) : (
        <>
          <div className="bg-plate-muted rounded-[10px]">
            {profile.chats
              .find((chat) => chat.chat_id == activityChat)
              .permissions.map((memberId) => {
                if (memberId == profile.id) return null;
                else {
                  const member = membersData.find((memberData) => memberData.id == memberId);

                  return (
                    <>
                      <div className="border-border flex flex-row justify-between border-b px-[clamp(5px,0.5vw,10px)] py-[clamp(5px,1vh,10px)]">
                        <div
                          className="flex-row items-center gap-[clamp(1px,0.5vw,10px)] hidden md:flex"
                          key={profile.id}
                        >
                          <img
                            className="h-[clamp(32px,3vw,64px)] w-[clamp(32px,3vw,64px)] rounded-[360px]"
                            src={profile.avatar_url}
                            alt="avatar"
                          />
                          <p className="text-[clamp(1rem,1.5vw,1.5rem)]">You</p>
                        </div>
                        <span className="material-symbols-outlined md:!hidden cursor-pointer" onClick={() => {useChatStore.getState().setActivityChat(null)}}>arrow_back</span>
                        <div
                          className="flex cursor-pointer flex-row items-center gap-[clamp(1px,0.5vw,10px)]"
                          key={memberId}
                          onClick={() => setActivityMemberProfile(!activityMemberProfile)}
                        >
                          <p className="text-[clamp(1rem,1.5vw,1.5rem)]">{member.nickname}</p>
                          <img
                            className="h-[clamp(32px,3vw,64px)] w-[clamp(32px,3vw,64px)] rounded-[360px]"
                            src={member.avatar_url}
                            alt="avatar"
                          />
                        </div>
                      </div>
                      {activityMemberProfile ? (
                        <div className="absolute top-0 left-0 z-2 flex h-screen w-screen items-center justify-center bg-black/66">
                          <div className="bg-plate-accent flex h-fit w-[70vw] flex-row justify-between gap-[clamp(5px,2vw,40px)] rounded-[20px] px-[clamp(10px,2vw,40px)] py-[clamp(10px,4vh,40px)]">
                            <span
                              className="material-symbols-outlined hover:text-danger-zone ease w-fit scale-[2.67] cursor-pointer self-start transition-all duration-200 hover:scale-[3]"
                              onClick={() => setActivityMemberProfile(!activityMemberProfile)}
                            >
                              close
                            </span>
                            <div className="flex w-[60%] flex-col items-center">
                              <p className="text-plate-hover text-[clamp(1rem,8vw,8rem)] font-medium">
                                W1tish
                              </p>
                              <div className="flex w-full flex-col">
                                <div className="flex w-full flex-row items-center gap-[clamp(1px,0.5vw,10px)]">
                                  <p className="text-[clamp(1rem,2vw,2rem)] font-medium">
                                    NickName:{' '}
                                  </p>
                                  <p className="w-full text-[clamp(0.5rem,1.5vw,1.5rem)]">
                                    {member.nickname}
                                  </p>
                                </div>
                                <div className="flex w-full flex-row items-center gap-[clamp(1px,0.5vw,10px)]">
                                  <p className="text-[clamp(1rem,2vw,2rem)] font-medium">
                                    UserName:
                                  </p>
                                  <p className="w-full text-[clamp(0.5rem,1.5vw,1.5rem)]">
                                    {member.username}
                                  </p>
                                </div>
                                <p className="text-plate-hover text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium">
                                  Build identificator: 0.0.1-pre-alpha
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-[clamp(5px,1vw,20px)] self-center">
                              <img
                                className="h-[clamp(64px,22vw,440px)] w-[clamp(64px,22vw,440px)] rounded-[10px]"
                                src={member.avatar_url}
                                alt="setting_avatar_user"
                              />
                              <p className="text-plate-hover self-center text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium">
                                {member.id}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  );
                }
              })}
          </div>
          <div
            className="flex h-full flex-col-reverse gap-[clamp(1px,1vh,10px)] overflow-y-auto px-[clamp(1px,0.5vw,10px)]"
            onScroll={handleScroll}
          >
            {chatStory.map((message, index) => (
              <MessageComponent key={index} message={message} />
            ))}
          </div>
          <div className="mx-[clamp(5px,0.5vw,10px)] my-[clamp(5px,1vh,10px)] mr-[clamp(5px,3vw,60px)] flex flex-row items-center justify-between gap-[clamp(5px,1vw,20px)] rounded-[20px]">
            <TextareaAutosize
              cacheMeasurements // Оптимизирует повторные вычисления размеров
              minRows={1} // Минимальная высота в строках
              maxRows={10} // Максимальная высота до появления скроллбара
              ref={inputMessage}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder="Введите сообщение..."
              className="border-border bg-plate-accent w-[93%] resize-none rounded-[40px] border px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] text-[clamp(0.75rem,1.5vw,1.5rem)] outline-0"
            />

            <span
              className="bg-plate-accent material-symbols-outlined scale-[1.33] cursor-pointer rounded-[360px] px-[clamp(1px,0.25vw,5px)] py-[clamp(1px,0.5vh,5px)] md:scale-[2] xl:scale-[2.67]"
              onClick={() => sendMessage()}
              role="button"
              tabIndex={0}
            >
              send
            </span>
          </div>
        </>
      )}
    </div>
  );
}
