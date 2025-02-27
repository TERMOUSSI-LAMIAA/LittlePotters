package com.littlepotters.littlepotters.services.security;

import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.security.CustomUserDetails;
import com.littlepotters.littlepotters.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;


    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + email));

        return new CustomUserDetails(
                user.getEmail(),
                user.getPassword(),
                user.getActive(),
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" +role.getName()))
                        .collect(Collectors.toList())
        );
    }
}
