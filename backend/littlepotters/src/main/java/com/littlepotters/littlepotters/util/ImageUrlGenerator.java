package com.littlepotters.littlepotters.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ImageUrlGenerator {

    @Value("${app.image.base-url:/api/workshops/images/}")
    private String imageBaseUrl;

    public String generateImageUrl(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }
        return imageBaseUrl + fileName;
    }
}
