import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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
        addContact: (data) => set((state) => {state.profile.chats = [data, ...state.profile.chats]}),
        addMessage: (data) => set((state) => {state.profile.chats.forEach((chat, index) => {
            if (chat == data["chat_id"]) {
                state.profile.chats[index].last_message_author = data["sender"];
                state.profile.chats[index].last_message_text = data["content"];
                state.profile.chats[index].last_message_time = data["created_at"];
        }})})
    }))
)

export const useContactStore = create<ContactStoreIntf>()(
    immer((set) => ({
        contacts: null,
        setContacts: (data) => set((state) => {state.contacts = data}),
        addContact: (id, data) => set((state) => {state.contacts[id] = data})
    }))
)

export const useChatStore = create(
    immer((set) => ({
        activityChat: null,
        chatStory: null,
        setChatStory: (data) => set((state) => {state.chatStory = data}),
        loadChatStory: (data) => set((state) => {[...data, ...state.chatStory]}),
        addChatStory: (data) => set((state) => {[...state.chatStory, data]}),
    }))
)

