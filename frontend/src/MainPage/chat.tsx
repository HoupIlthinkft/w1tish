import { useEffect, useRef, useState } from 'react';
import { BackgroundComponent } from '../AuthRegPage/authRegBackground.tsx';
import TextareaAutosize from 'react-textarea-autosize';
import { useChatStore, useProfileStore, useContactStore } from '../configurationFiles/config.ts';
import { request_get_messages } from '../configurationFiles/requests.ts';
import { send_new_message } from '../configurationFiles/webSocketsConnection.ts';

import { MessageComponent } from './message.tsx';
import { LoadingComponent } from './loading.tsx';

export function ChatComponent() {
  const [activityMemberProfile, setActivityMemberProfile] = useState(false);
  const [activityGetMessages, setActivityGetMessages] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputMessage = useRef(null);
  const chatScroll = useRef(null);

  const profile = useProfileStore((state) => state.profile);
  const chatStory = useChatStore((state) => state.chatStory);
  const activityChat = useChatStore((state) => state.activityChat);
  const membersData = useContactStore((state) => state.contacts);
  const offset = useChatStore((state) => state.offset);
  const setOffset = useChatStore((state) => state.setOffset);

  const sendMessage = () => {
    if (inputMessage.current.value.trim() != '') {
      send_new_message(useChatStore.getState().activityChat, inputMessage.current?.value);
      inputMessage.current.value = '';
      setOffset(offset + 1);
    }
  };

  const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;

    if (
      target.scrollHeight - target.clientHeight + target.scrollTop <= 1 &&
      activityGetMessages &&
      chatStory.length == offset &&
      !loading
    ) {
      setLoading(true);
      const newChatStory = await request_get_messages(useChatStore.getState().activityChat, offset);
      setLoading(false);
      useChatStore.getState().loadChatStory(newChatStory.messages.reverse());

      if (newChatStory.messages.length < 50) setActivityGetMessages(false);

      target.scrollTop -=
        target.scrollHeight - target.scrollHeight * 0.5 * (offset / (offset + 50));
      setOffset(offset + 50);
    }
  };

  useEffect(() => {
    if (activityChat != null) {
      chatScroll.current.scrollTop = 0;
      setOffset(50);
      setActivityGetMessages(true);
    }
  }, [activityChat]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {activityChat == null ? (
        <div className="flex h-full flex-col items-center justify-center gap-[clamp(5px,2vh,20px)]">
          <p className="text-plate-hover font-[Jost] text-[clamp(4rem,8vw,8rem)] font-semibold">
            W1tish
          </p>
          <h1 className="text-nothing-yet text-[clamp(1rem,4vw,4rem)] font-bold">
            Здесь пока ничего нету
          </h1>
          <h1 className="text-nothing-yet text-[clamp(2rem,6vw,6rem)] font-bold">{'(._. )'}</h1>
          <h4 className="text-nothing-yet text-[clamp(0.5rem,2vw,2rem)] font-medium">
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
                      <div className="border-border flex flex-row-reverse justify-between border-b px-[clamp(5px,0.5vw,10px)] py-[clamp(5px,1vh,10px)] md:flex-row">
                        <div
                          className="flex cursor-pointer flex-row-reverse items-center gap-[clamp(1px,0.5vw,10px)] md:flex-row"
                          key={memberId}
                          onClick={() => setActivityMemberProfile(!activityMemberProfile)}
                        >
                          <img
                            className="h-[clamp(32px,3vw,64px)] w-[clamp(32px,3vw,64px)] rounded-[360px]"
                            src={member.avatar_url}
                            alt="avatar"
                          />
                          <p className="text-[clamp(1rem,1.5vw,1.5rem)]">{member.nickname}</p>
                        </div>
                        <div
                          className="hidden flex-row items-center gap-[clamp(1px,0.5vw,10px)] md:flex"
                          key={profile.id}
                        >
                          <p className="text-[clamp(1rem,1.5vw,1.5rem)]">You</p>
                          <img
                            className="h-[clamp(32px,3vw,64px)] w-[clamp(32px,3vw,64px)] rounded-[360px]"
                            src={profile.avatar_url}
                            alt="avatar"
                          />
                        </div>
                        <span
                          className="material-symbols-outlined cursor-pointer self-center md:hidden!"
                          onClick={() => {
                            useChatStore.getState().setActivityChat(null);
                          }}
                        >
                          arrow_back
                        </span>
                      </div>
                      {activityMemberProfile ? (
                        <div className="absolute top-0 left-0 z-2 flex h-screen w-screen items-center justify-center bg-black/66">
                          <div className="bg-plate-accent grid h-full w-full grid-cols-[0] rounded-[10px] px-[clamp(10px,2vw,40px)] py-[clamp(10px,2vh,20px)] sm:h-fit sm:w-[70vw] md:grid-cols-[0_2fr_auto] md:justify-between md:gap-x-[clamp(5px,2vw,40px)] md:rounded-[20px] md:py-[clamp(10px,4vh,40px)]">
                            <span
                              className="material-symbols-outlined text-title hover:text-danger-zone ease w-fit cursor-pointer self-start transition-all duration-200 hover:scale-[3] md:scale-[2] xl:scale-[2.67]"
                              onClick={() => setActivityMemberProfile(!activityMemberProfile)}
                            >
                              close
                            </span>
                            <p className="text-plate-hover self-center text-center text-[clamp(3rem,8vw,8rem)] font-medium">
                              W1tish
                            </p>
                            <div className="col-2 flex flex-col gap-[clamp(5px,1vw,20px)] self-center md:col-3 md:row-span-2">
                              <div className="group flex flex-col items-center justify-center">
                                <img
                                  className="h-[clamp(64px,88vw,440px)] w-[clamp(64px,88vw,440px)] rounded-[10px] sm:h-[clamp(64px,44vw,440px)] sm:w-[clamp(64px,44vw,440px)] md:h-[clamp(64px,22vw,440px)] md:w-[clamp(64px,22vw,440px)]"
                                  src={member.avatar_url}
                                  alt="setting_avatar_user"
                                />
                              </div>
                              <p className="text-plate-hover self-center text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium">
                                {member.id}
                              </p>
                            </div>
                            <div className="col-2 flex w-full flex-col justify-between gap-[clamp(5px,3vh,50px)] md:row-2 md:gap-[clamp(5px,5vh,50px)]">
                              <div className="flex flex-col items-center">
                                <div className="flex w-full flex-col gap-[clamp(5px,1vh,10px)]">
                                  <div className="flex w-full flex-col items-start justify-between gap-[clamp(1px,0.5vw,10px)]">
                                    <p className="text-[clamp(0.75rem,2vw,2rem)] font-medium">
                                      NickName:
                                    </p>
                                    <div className="bg-plate-muted border-border flex w-full flex-row justify-between rounded-[10px] border px-[clamp(5px,1vw,20px)] py-[clamp(5px,1.5vh,20px)] text-[clamp(0.5rem,1.25vw,1.25rem)] outline-0 md:rounded-[15px]">
                                      <p className="text-nothing-yet w-full">
                                        <i>{member.nickname}</i>
                                      </p>
                                      <span className="material-symbols-outlined text-nothing-yet h-1 scale-[0.5] self-start md:scale-[0.83] xl:scale-[1.33]">
                                        block
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex w-full flex-col items-start justify-between gap-[clamp(1px,0.5vw,10px)]">
                                    <p className="text-[clamp(0.75rem,2vw,2rem)] font-medium">
                                      UserName:
                                    </p>
                                    <div className="bg-plate-muted border-border flex w-full flex-row justify-between rounded-[10px] border px-[clamp(5px,1vw,20px)] py-[clamp(5px,1.5vh,20px)] text-[clamp(0.5rem,1.25vw,1.25rem)] outline-0 md:rounded-[15px]">
                                      <p className="text-nothing-yet w-full">
                                        <i>{member.username}</i>
                                      </p>
                                      <span className="material-symbols-outlined text-nothing-yet h-1 scale-[0.5] self-start md:scale-[0.83] xl:scale-[1.33]">
                                        block
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col-reverse gap-[clamp(5px,1vh,10px)]">
                                <p className="text-plate-hover text-center text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium">
                                  Build identificator: 0.0.1-pre-alpha
                                </p>
                              </div>
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
            className="mt-0.5 flex h-full flex-col-reverse gap-[clamp(1px,1vh,10px)] overflow-y-auto px-[clamp(1px,0.5vw,10px)]"
            onScroll={handleScroll}
            ref={chatScroll}
          >
            {chatStory.map((message, index) => (
              <MessageComponent key={index} message={message} />
            ))}
            {loading ? <LoadingComponent type="chat"></LoadingComponent> : <></>}
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
          <BackgroundComponent typeBG="Chat" />
        </>
      )}
    </div>
  );
}
