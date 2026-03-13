const LOCAL_STORAGE_KEYS_TO_CLEAR = [
  "ai_stock_chat_messages",
  "ai_stock_conversations",
  "ai_stock_active_conversation",
  "userProfile",
];

const SESSION_STORAGE_KEYS_TO_CLEAR = ["played_chat_audio_message_ids"];

export const clearAuthRelatedStorage = () => {
  LOCAL_STORAGE_KEYS_TO_CLEAR.forEach((key) => {
    localStorage.removeItem(key);
  });

  SESSION_STORAGE_KEYS_TO_CLEAR.forEach((key) => {
    sessionStorage.removeItem(key);
  });
};
