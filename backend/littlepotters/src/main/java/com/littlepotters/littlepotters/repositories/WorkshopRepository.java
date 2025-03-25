package com.littlepotters.littlepotters.repositories;

import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
    List<Workshop> findByInstructor(User instructor);
    Page<Workshop> findByInstructorId(Long instructorId, Pageable pageable);
    Page<Workshop> findByDateGreaterThanEqual(LocalDate date, Pageable pageable);
}
