import { useState, useRef } from 'react';
import { useProfileStore, useDataStore } from '../configurationFiles/config.ts';
import {
  requset_editing_nickname,
  requset_editing_avatar,
  request_reset_token,
} from '../configurationFiles/requests.ts';
import { closeConnection } from '../configurationFiles/webSocketsConnection.ts';

export function UserProfileComponent() {
  const profile = useProfileStore((state) => state.profile);

  const [activityProfile, setActivityProfile] = useState<boolean>(false);
  const [userNickname, setUsernickname] = useState<string | undefined>(profile?.nickname);
  const editNicknameRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div className="border-border flex flex-row gap-[clamp(5px,0.5vw,10px)] rounded-[15px] border-t bg-white px-[clamp(5px,1.5vw,30px)] py-[clamp(5px,2vh,20px)]">
        <img
          src={profile?.avatar_url}
          alt="avatar"
          className="h-8 w-8 self-center rounded-[360px] xl:h-16 xl:w-16"
        />
        <div className="flex w-full max-w-[calc(100%-32px-0.5vw)] flex-row justify-between xl:max-w-[calc(100%-64px-0.5vw)]">
          <div className="group ease flex w-[calc(100%-2.5vw)] flex-col justify-center transition-all duration-300">
            <p className="overflow-hidden text-[clamp(0.75rem,1.5vw,1.5rem)] text-ellipsis whitespace-nowrap">
              {profile?.nickname}
            </p>
            <p className="hidden text-[clamp(0.5rem,1vw,1rem)] opacity-[0] group-hover:last:inline group-hover:last:opacity-[1]">
              {profile?.username}
            </p>
          </div>
          <span
            className="material-symbols-outlined hover:text-plate-hover sclae-[1.33] ease w-fit cursor-pointer self-center transition-all duration-300 md:scale-[1.66] xl:scale-[2]"
            onClick={() => {
              setActivityProfile(!activityProfile);
              setUsernickname(profile?.nickname);
            }}
          >
            settings
          </span>
        </div>
      </div>
      {activityProfile ? (
        <div className="absolute top-0 left-0 z-2 flex h-screen w-screen items-center justify-center bg-black/66">
          <div className="bg-plate-accent grid h-full w-full grid-cols-[0] rounded-[10px] px-[clamp(10px,2vw,40px)] py-[clamp(10px,2vh,20px)] sm:h-fit sm:w-[70vw] md:grid-cols-[0_2fr_auto] md:justify-between md:gap-x-[clamp(5px,2vw,40px)] md:rounded-[20px] md:py-[clamp(10px,4vh,40px)]">
            <span
              className="material-symbols-outlined text-title hover:text-danger-zone ease w-fit cursor-pointer self-start transition-all duration-200 hover:scale-[3] md:scale-[2] xl:scale-[2.67]"
              onClick={() => setActivityProfile(!activityProfile)}
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
                  src={profile?.avatar_url}
                  alt="setting_avatar_user"
                />
                <input
                  className="ease absolute z-2 h-[clamp(64px,44vw,440px)] w-[clamp(64px,44vw,440px)] cursor-pointer bg-white/33 text-transparent opacity-[0] transition-all duration-500 group-hover:opacity-[1] md:h-[clamp(64px,22vw,440px)] md:w-[clamp(64px,22vw,440px)]"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('file', file, file.name);

                    requset_editing_avatar(formData);
                  }}
                  type="file"
                  accept=".png, .jpeg, .jpg, .webp"
                />
                <span className="material-symbols-outlined text-gray/66 ease absolute w-fit scale-[2.67] self-center opacity-[0] transition-all duration-300 group-hover:opacity-[1]">
                  compare
                </span>
              </div>
              <p className="text-plate-hover self-center text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium">
                {profile?.id}
              </p>
            </div>
            <div className="col-2 flex w-full flex-col justify-between gap-[clamp(5px,3vh,50px)] md:row-2 md:gap-[clamp(5px,5vh,50px)]">
              <div className="flex flex-col items-center">
                <div className="flex w-full flex-col gap-[clamp(5px,1vh,10px)]">
                  <div className="flex w-full flex-col items-start justify-between gap-[clamp(1px,0.5vw,10px)]">
                    <p className="text-[clamp(0.75rem,2vw,2rem)] font-medium">NickName: </p>
                    <input
                      className="bg-plate-muted border-border w-full rounded-[10px] border px-[clamp(5px,1vw,20px)] py-[clamp(5px,1.5vh,20px)] text-[clamp(0.5rem,1.25vw,1.25rem)] outline-0 md:rounded-[15px]"
                      ref={editNicknameRef}
                      maxLength={42}
                      value={userNickname}
                      onChange={(event) => {
                        setUsernickname(event.target.value);
                      }}
                    />
                  </div>
                  <div className="flex w-full flex-col items-start justify-between gap-[clamp(1px,0.5vw,10px)]">
                    <p className="text-[clamp(0.75rem,2vw,2rem)] font-medium">UserName:</p>
                    <div className="bg-plate-muted border-border flex w-full flex-row justify-between rounded-[10px] border px-[clamp(5px,1vw,20px)] py-[clamp(5px,1.5vh,20px)] text-[clamp(0.5rem,1.25vw,1.25rem)] outline-0 md:rounded-[15px]">
                      <p className="text-nothing-yet w-full">
                        <i>{profile?.username}</i>
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
                <div className="flex w-full flex-row gap-[clamp(5px,2vw,40px)] self-end">
                  <button
                    className="bg-plate-accent hover:bg-plate-hover border-border ease w-fit self-end rounded-[15px] border px-[clamp(5px,4vw,80px)] py-[clamp(5px,2vh,30px)] text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium duration-300 hover:scale-[1.1] md:rounded-[20px] md:py-[clamp(5px,2vh,20px)]"
                    type="button"
                    onClick={() => {
                      if (editNicknameRef.current?.value != profile?.nickname) {
                        requset_editing_nickname(editNicknameRef.current?.value);
                        useProfileStore.getState().setNickname(editNicknameRef.current!.value);
                      }
                      setActivityProfile(!activityProfile);
                    }}
                  >
                    Сохранить
                  </button>
                  <button
                    className="bg-danger-zone border-border ease w-full self-end rounded-[15px] border px-[clamp(5px,2vw,40px)] py-[clamp(5px,2vh,30px)] text-[clamp(0.75rem,1.5vw,1.5rem)] font-medium duration-300 hover:scale-[1.05] md:rounded-[20px] md:py-[clamp(5px,2vh,20px)]"
                    type="button"
                    onClick={() => {
                      useDataStore.getState().setAccessToken(null);
                      useProfileStore.getState().setProfile(null);
                      closeConnection();
                      request_reset_token();
                    }}
                  >
                    Выйти из аккаунта
                  </button>
                </div>
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
