package com.littlepotters.littlepotters.repositories;

import com.littlepotters.littlepotters.models.entities.Reservation;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByCustomerAndWorkshop(User customer, Workshop workshop);
    Page<Reservation> findByWorkshopId(Long workshopId, Pageable pageable);
    Page<Reservation> findByWorkshopIdIn(Collection<Long> workshopIds, Pageable pageable);
    Page<Reservation> findByCustomerId(Long customerId, Pageable pageable);
    Page<Reservation> findByCustomerIdAndWorkshopId(Long customerId, Long workshopId, Pageable pageable);
}
