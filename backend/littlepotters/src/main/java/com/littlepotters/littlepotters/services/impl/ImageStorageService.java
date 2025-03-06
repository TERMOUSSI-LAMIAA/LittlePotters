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
    private static final String UPLOAD_DIR = "workshop-images/";

    @Override
    public String saveImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Cannot save empty file.");
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

//        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        try (   InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return fileName;
    }

    @Override
    public byte[] getImage(String fileName) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
        return Files.readAllBytes(filePath);
    }

    @Override
    public void deleteImage(String fileName) throws IOException {
        if (fileName == null || fileName.isEmpty()) {
            return;
        }

        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

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
