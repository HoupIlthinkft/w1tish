import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage  } from "zustand/middleware";
import { produce } from "immer";

import { get, set, del } from 'idb-keyval';

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
            typeNotification: "",
            content: "",
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

export const useChatStore = create(
    immer((set) => ({
        activityChat: null,
        chatStory: null,
        setActivityChat: (data) => set(produce((state) => {state.activityChat = data})),
        setChatStory: (data) => set(produce((state) => {state.chatStory = data})),
        loadChatStory: (data) => set(produce((state) => {state.chatStory = [...data, ...state.chatStory]})),
        addChatStory: (data) => set(produce((state) => {state.chatStory = [...state.chatStory, data]})),
    }))
)

const storage = {
  getItem: async (name) => (await get(name)) || null,
  setItem: async (name, value) => await set(name, value),
  removeItem: async (name) => await del(name),
};

export const useKeysStore = create()(
    persist(immer((set) => ({
        keys: {
            sessions: {},
            preKeys: {},
            identityKey: null,
            signedPreKey: {},
            registrationId: null,
        },


        actions: {
            setSession: (address, record) => 
            set((state) => { state.keys.sessions[address] = record }),
            
            setPreKey: (keyId, keyPair) => 
            set((state) => { state.keys.preKeys[keyId] = keyPair }),
            
            removePreKey: (keyId) => 
            set((state) => { delete state.keys.preKeys[keyId] }),

            setAllData: (data) => 
            set((state) => { state.keys = { ...state.keys, ...data } }),
        },

        setIdentityKey: (key) => set(produce((state) => {state.keys.identityKey = key})),
        setSignedPreKey: (key) => set(produce((state) => {state.keys.signedPreKey = key})),
        setRegistrationId: (id) => set(produce((state) => {state.keys.registrationId = id})),
        setNullKeys: () => set(produce((state) => state.keys = {
            sessions: {},
            preKeys: {},
            identityKey: null,
            signedPreKey: {},
            registrationId: null,
        }))
    })), { 
        name: "KeysStore",
        storage: createJSONStorage (() => storage),
     }
))
