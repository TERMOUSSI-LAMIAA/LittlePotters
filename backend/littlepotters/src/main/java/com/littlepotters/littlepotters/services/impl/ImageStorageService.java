package com.littlepotters.littlepotters.services.impl;

import com.littlepotters.littlepotters.services.inter.ImageStorageServiceInterface;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class ImageStorageService implements ImageStorageServiceInterface {
    private static final String workshopUploadDir = "workshop-images/";
    private static final String profileUploadDir="profile-images/";

    @Override
    public String saveWorkshopImage(MultipartFile file) throws IOException {
        return saveImage(file, workshopUploadDir);
    }

    @Override
    public String saveProfileImage(MultipartFile file) throws IOException {
        return saveImage(file, profileUploadDir);
    }

    private String saveImage(MultipartFile file, String uploadDir) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Cannot save empty file.");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return fileName;
    }

    @Override
    public byte[] getWorkshopImage(String fileName) throws IOException {
        return getImage(fileName, workshopUploadDir);
    }

    @Override
    public byte[] getProfileImage(String fileName) throws IOException {
        return getImage(fileName, profileUploadDir);
    }

    private byte[] getImage(String fileName, String uploadDir) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        return Files.readAllBytes(filePath);
    }

    @Override
    public void deleteWorkshopImage(String fileName) throws IOException {
        deleteImage(fileName, workshopUploadDir);
    }

    @Override
    public void deleteProfileImage(String fileName) throws IOException {
        deleteImage(fileName, profileUploadDir);
    }

    private void deleteImage(String fileName, String uploadDir) throws IOException {
        if (fileName == null || fileName.isEmpty()) {
            return;
        }

        Path filePath = Paths.get(uploadDir).resolve(fileName);

        try {
            boolean deleted = Files.deleteIfExists(filePath);
            if (!deleted) {
                System.err.println("Warning: File does not exist or could not be deleted: " + fileName);
            }
        } catch (IOException e) {
            System.err.println("Warning: Failed to delete image: " + fileName + ". Error: " + e.getMessage());
        }
    }
}
