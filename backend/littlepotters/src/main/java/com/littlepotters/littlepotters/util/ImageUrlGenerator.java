package com.littlepotters.littlepotters.util;

import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ImageUrlGenerator {

    @Value("${app.image.workshop-base-url}")
    private String workshopImageBaseUrl;

    @Value("${app.image.profile-base-url}")
    private String profileImageBaseUrl;

    @Named("generateWorkshopImageUrl")
    public String generateWorkshopImageUrl(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }
        return workshopImageBaseUrl + fileName;
    }

    @Named("generateProfileImageUrl")
    public String generateProfileImageUrl(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return null;
        }
        return profileImageBaseUrl + fileName;
    }
}
