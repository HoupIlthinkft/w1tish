import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { produce } from "immer";

interface DataStoreIntf {
    accessToken: null | string;
    setAccessToken: (token : string) => void;
}

interface NotificationStoreIntf {
    notificationActivity: boolean;
    setNotificationActivity: (activity : boolean) => void;
    notificationContent: {
        typeNotification: "error" | "success" | "";
        content: string;
    };
    setNotificationContent: (content : ["error" | "success", string]) => void;
}

interface ProfileIntf {
    username: string;
    nickname: string;
    avatar: string;
    chats: string;
    id: string;
}

interface ProfileStoreIntf {
    profile: ProfileIntf | null; 
    setProfile: (data : ProfileIntf) => void;
}

interface ContactStoreIntf {
    contacts: string[] | null;
    setContacts: (data : string[]) => void;
}

export const useDataStore = create<DataStoreIntf>()(
    immer((set) => ({
        accessToken: null,
        setAccessToken: (token) => set((state) => {state.accessToken = token}),
    }))
);

export const useNotificationStore = create<NotificationStoreIntf>()(
    immer((set) => ({
        notificationActivity: false,
        setNotificationActivity: (activity) => set((state) => {state.notificationActivity = activity}),
        notificationContent: {
            typeNotification: "",
            content: "",
        },
        setNotificationContent: (content) => set((state) => {state.notificationContent = {typeNotification: content[0], content: content[1]}}),
    }))
)

export const useProfileStore = create<ProfileStoreIntf>()(
    immer((set) => ({
        profile: null,
        setProfile: (data) => set((state) => {state.profile = data}),
        addContact: (data) => set(produce((state) => {state.profile.chats[data.id] = {
            permissions: data.permissions,
            last_message: "_Чат создан_",
            last_message_author: 0,
            last_message_time: new Date().toJSON(),
        }})),
        addMessage: (data) => set(produce((state) => {
            const chat = state.profile.chats[data["chat_id"]];
                                  
            chat.last_message_author = data["sender"];
            chat.last_message = data["content"];
            chat.last_message_time = data["created_at"];
        }
        ))
    }))
)

export const useContactStore = create<ContactStoreIntf>()(
    immer((set) => ({
        contacts: null,
        setContacts: (data) => set((state) => {state.contacts = data}),
        addContact: (id, data) => set(produce((state) => {state.contacts[id] = data}))
    }))
)

export const useChatStore = create(
    immer((set) => ({
        activityChat: null,
        chatStory: null,
        setActivityChat: (data) => set((state) => {state.activityChat = data}),
        setChatStory: (data) => set((state) => {state.chatStory = data}),
        loadChatStory: (data) => set(produce((state) => {state.chatStory = [...data, ...state.chatStory]})),
        addChatStory: (data) => set(produce((state) => {state.chatStory = [...state.chatStory, data]})),
    }))
)

