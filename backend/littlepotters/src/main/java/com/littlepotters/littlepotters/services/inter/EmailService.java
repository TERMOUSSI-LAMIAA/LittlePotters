package com.littlepotters.littlepotters.services.inter;

public interface EmailService {
    void sendSimpleMessage(String to, String subject, String text);
}
