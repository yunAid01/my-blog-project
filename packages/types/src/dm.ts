// DM 관련 타입
export interface Message {
    id: number;
    text: string;
    createdAt: string;
    conversationId: number;
    senderId: number;
    sender: {
        id: number;
        nickname: string;
    };
}

export interface Conversation {
    id: number;
    createdAt: string;
    updatedAt: string;
    participants: {
        id: number;
        nickname: string;
    }[];
}