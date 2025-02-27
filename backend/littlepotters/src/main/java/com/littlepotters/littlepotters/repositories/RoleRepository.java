package com.littlepotters.littlepotters.repositories;

import com.littlepotters.littlepotters.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Long> {

    Role findByName(String name);

}
