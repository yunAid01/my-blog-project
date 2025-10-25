import { Message, Conversation, PublicUser } from "@my-blog/types";
import apiClient from "./client";



export const getDmConversations = async (): Promise<Conversation[]> => {
    const conversations: Conversation[] = await apiClient.get('dm/conversations/')
    return conversations
}

export const getFollowings = async (): Promise<PublicUser[]> => {
    const followings: PublicUser[] = await apiClient.get('dm/followings/')
    return followings
}

export const createDmConversation = async (recipientsId: number[]): Promise<Conversation> => {
    const newConversation: Conversation = await apiClient.post('dm/conversations', recipientsId);
    return newConversation
}

export const getDmMessages = async (conversationId: number): Promise<Message[]> => {
    const messages: [] = await apiClient.get(`dm/conversations/${conversationId}/messages`)
    return messages
}