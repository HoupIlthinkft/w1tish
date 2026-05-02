import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useDataStore = create(
    immer((set) => ({
        accessToken: "",
        setAccessToken: (token) => set((state) => {state.accessToken = token}),
    }))
);


export const useNotificationStore = create(
    immer((set) => ({
        notification: {},
        setNotification: (content) => set((state) => {state.notification = {type: content[1], content: content[0]}}),
    }))
);

export const useProfileStore = create(
    immer((set) => ({
        profile: {},
        setProfile: (data) => set((state) => {state.profile = data}),
    }))
)

export const useContactStore = create(
    immer((set) => ({
        contacts: [],
        setContacts: (data) => set((state) => {state.contacts = data}),
    }))
)

export const useChatStore = create(
    immer((set) => ({
        chatStory: [],
        setChatStory: (data) => set((state) => {state.chatStory = data}),
    }))
)

