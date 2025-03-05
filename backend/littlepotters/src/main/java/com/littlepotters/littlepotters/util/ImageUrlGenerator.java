package com.littlepotters.littlepotters.util;

import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ImageUrlGenerator {

    @Value("${app.image.base-url}")
    private String imageBaseUrl;

    @Named("generateImageUrl")
    public String generateImageUrl(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }
        return imageBaseUrl + fileName;
    }
}
