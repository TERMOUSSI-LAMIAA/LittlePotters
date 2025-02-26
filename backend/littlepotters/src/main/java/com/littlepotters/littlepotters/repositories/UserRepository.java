package com.littlepotters.littlepotters.repositories;

import com.littlepotters.littlepotters.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

    boolean existsByEmail(String login);
}
