package com.littlepotters.littlepotters.services.inter;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageStorageServiceInterface {
    String saveWorkshopImage(MultipartFile file) throws IOException;
    byte[] getWorkshopImage(String fileName) throws IOException;
    void deleteWorkshopImage(String fileName) throws IOException;

    // User profile image methods
    String saveProfileImage(MultipartFile file) throws IOException;
    byte[] getProfileImage(String fileName) throws IOException;
    void deleteProfileImage(String fileName) throws IOException;
}
