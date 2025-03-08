package com.littlepotters.littlepotters.repositories;

import com.littlepotters.littlepotters.models.entities.Reservation;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByCustomerAndWorkshop(User customer, Workshop workshop);
    List<Reservation> findByCustomer(User customer);
    List<Reservation> findByWorkshop(Workshop workshop);
}
