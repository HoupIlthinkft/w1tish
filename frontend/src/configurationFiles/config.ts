import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
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
    chats: [{[chatId: string]: Array<string>}];
    id: string;
}

interface ProfileStoreIntf {
    profile: ProfileIntf | null; 
    setProfile: (data : ProfileIntf) => void;
    addContact: (data : {chat_id: string, permissions: string[]}) => void;
    addMessage: (data : MessageIntf) => void;
    setNickname: (newNickname : string) => void;
}

interface ContactIntf {
    nickname: string,
    username: string,
    avatar: string,
    id: string,
}


interface MessageIntf {
    type: string,
    content: string,
    sender: string,
    reciver: string, 
    chat_id: string
}

interface ContactStoreIntf {
    contacts: ContactIntf[] | null;
    setContacts: (data : ContactIntf[]) => void;
    addContact: (data : ContactIntf) => void;
}

interface ChatStoreIntf {
    activityChat: null | string;
    chatStory: null | MessageIntf[];
    setActivityChat: (data : string) => void ;
    setChatStory: (data : MessageIntf[]) => void;
    loadChatStory: (data : MessageIntf[]) => void;
    addChatStory: (data : MessageIntf) => void;
}

export const useDataStore = create<DataStoreIntf>()(
    persist(immer((set) => ({
        accessToken: null,
        setAccessToken: (token) => set((state) => {state.accessToken = token}),
    })), { name: "DataStore" }
));

export const useNotificationStore = create<NotificationStoreIntf>()(
    immer((set) => ({
        notificationActivity: false,
        setNotificationActivity: (activity) => set((state) => {state.notificationActivity = activity}),

        notificationContent: {
            typeNotification: "success",
            content: "Страница успешно загружена",
        },
        setNotificationContent: (content) => set((state) => {state.notificationContent = {typeNotification: content[0], content: content[1]}}),
    }))
)

export const useProfileStore = create<ProfileStoreIntf>()(
    immer((set) => ({
        profile: null,
        setProfile: (data) => set(produce((state) => {state.profile = data})),
        addContact: (data) => set(produce((state) => {state.profile.chats[data.chat_id] = data.permissions})),
        addMessage: (data) => set(produce((state) => {
            const chat = state.profile.chats[data["chat_id"]];
                                  
            chat.last_message_author = data["sender"];
            chat.last_message = data["content"];
            chat.last_message_time = data["created_at"];
        })),
        setNickname: (newNickname) => set(produce((state) => {
            state.profile.nickname = newNickname;
        }))            
    }))
)

export const useContactStore = create<ContactStoreIntf>()(
    immer((set) => ({
        contacts: [],
        setContacts: (data) => set((state) => {state.contacts = data}),
        addContact: (data) => set(produce((state) => {state.contacts.push(data)}))
    }))
)

export const useChatStore = create<ChatStoreIntf>()(
    immer((set) => ({
        activityChat: null,
        chatStory: null,
        setActivityChat: (data) => set(produce((state) => {state.activityChat = data})),
        setChatStory: (data) => set(produce((state) => {state.chatStory = data})),
        loadChatStory: (data) => set(produce((state) => {state.chatStory = [...data, ...state.chatStory]})),
        addChatStory: (data) => set(produce((state) => {state.chatStory = [...state.chatStory, data]})),
    }))
)