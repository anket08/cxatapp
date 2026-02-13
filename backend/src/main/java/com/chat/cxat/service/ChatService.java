package com.chat.cxat.service;

import com.chat.cxat.model.ChatRoom;
import com.chat.cxat.model.Message;
import com.chat.cxat.repository.ChatRoomRepository;
import com.chat.cxat.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;

    public ChatService(ChatRoomRepository chatRoomRepository,
                       MessageRepository messageRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
    }

    public ChatRoom createPrivateRoom() {
        ChatRoom room = new ChatRoom();
        room.setType("PRIVATE");
        return chatRoomRepository.save(room);
    }

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }
    public boolean roomExists(Long roomId) {
    return chatRoomRepository.existsById(roomId);
}

    public List<Message> getMessages(Long roomId) {
        return messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
    }
}