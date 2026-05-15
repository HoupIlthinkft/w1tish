import { useContactStore, useProfileStore } from '../configurationFiles/config.ts';
import { get_data_by_username, request_create_new_chat } from '../configurationFiles/requests.ts';
import { callNotification } from '../Notification/notifications.tsx';
import { useState, useRef } from 'react';

export function CreateChatComponent() {
  const [activityCreateChat, setActivityCreateChat] = useState(false);
  const inputMember = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <div
        className="flex flex-col justify-between gap-[clamp(5px,1.5vh,15px)] rounded-[15px] bg-white px-[clamp(5px,2vw,40px)] py-[clamp(5px,1vh,10px)]"
        style={activityCreateChat ? {} : { display: 'none' }}
      >
        <p className="self-center text-[clamp(0.5rem,1.5vw,1.5rem)] font-medium">Пользователь:</p>
        <input
          ref={inputMember}
          className="bg-plate-muted border-border rounded-[15px] border px-[clamp(5px,1vw,20px)] py-[clamp(5px,0.5vh,5px)] text-[clamp(0.5rem,1.5vw,1.5rem)] outline-0"
          type="text"
          placeholder="Введите username человека..."
          maxLength={42}
        />
        <button
          className="bg-plate-accent ease rounded-[15px] px-[clamp(5px,1vw,20px)] py-[clamp(5px,0.5vh,5px)] text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium duration-300 hover:scale-[1.05]"
          onClick={() => {
            if (inputMember.current != null) {
              if (inputMember.current.value.trim() == '') {
                callNotification('К сожалению нельзя общаться с пустотой, админ запретил', 'error');
              } else if (inputMember.current.value == useProfileStore.getState().profile.username) {
                callNotification('К сожалению нельзя общаться со своей шизой :(', 'error');
              } else if (
                Object.values(useProfileStore.getState().profile.chats).every(
                  (chat) => JSON.stringify(chat) != inputMember.current.value,
                )
              ) {
                get_data_by_username(inputMember.current.value).then((value) => {
                  request_create_new_chat(value[0].id);
                  useContactStore.getState().addContact(value[0]);
                  //  useProfileStore.getState().addContact({})
                  setActivityCreateChat(!activityCreateChat);
                });
              } else
                callNotification(
                  'К сожалению нельзя сделать два одиннаковых чата, многопоточность запрещена на территории w1tish',
                  'error',
                );
            }
          }}
        >
          Созидать
        </button>
      </div>
      <div
        onClick={() => setActivityCreateChat(!activityCreateChat)}
        className="border-border hover:bg-plate-hover hover:text-plate-accent ease flex h-fit w-full cursor-pointer flex-row rounded-[15px] border-b bg-white px-[clamp(5px,1vw,20px)] py-[clamp(5px,2vh,20px)] transition-all duration-200"
      >
        <p className="w-full self-center text-center text-[clamp(0.5rem,1.5vw,1.5rem)]">
          Новый чат
        </p>
        <span className="material-symbols-outlined w-fit scale-[1.33] cursor-pointer self-center md:scale-[2] xl:scale-[2.67]">
          add
        </span>
      </div>
    </div>
  );
}
