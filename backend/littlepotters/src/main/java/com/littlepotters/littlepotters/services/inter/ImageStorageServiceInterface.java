package com.littlepotters.littlepotters.services.inter;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageStorageServiceInterface {
    String saveImage(MultipartFile file) throws IOException;
    byte[] getImage(String fileName) throws IOException;
}
