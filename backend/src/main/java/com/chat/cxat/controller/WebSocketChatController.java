package com.chat.cxat.controller;

import com.chat.cxat.model.Message;
import com.chat.cxat.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {

    private final ChatService chatService;

    public WebSocketChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message send(Message message) {
        // save message in DB
        return chatService.sendMessage(message);
    }
}