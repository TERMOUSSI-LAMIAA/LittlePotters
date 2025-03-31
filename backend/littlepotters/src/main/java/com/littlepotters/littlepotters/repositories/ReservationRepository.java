package com.littlepotters.littlepotters.repositories;

import com.littlepotters.littlepotters.models.entities.Reservation;
import com.littlepotters.littlepotters.models.entities.User;
import com.littlepotters.littlepotters.models.entities.Workshop;
import com.littlepotters.littlepotters.models.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByCustomerAndWorkshop(User customer, Workshop workshop);
    Page<Reservation> findByWorkshopId(Long workshopId, Pageable pageable);
    Page<Reservation> findByWorkshopIdIn(Collection<Long> workshopIds, Pageable pageable);
    Page<Reservation> findByCustomerId(Long customerId, Pageable pageable);
    Page<Reservation> findByCustomerIdAndWorkshopId(Long customerId, Long workshopId, Pageable pageable);
    long countByWorkshopInstructorId(Long instructorId);
    long countByWorkshopInstructorIdAndStatus(Long instructorId, ReservationStatus status);
    long countByStatus(ReservationStatus status);

    @Query("SELECT SUM(r.totalPrice) FROM Reservation r WHERE r.status = 'COMPLETED'")
    Double sumTotalPriceByCompletedStatus();

    long count();
    long countByCustomerId(Long customerId);

    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r " +
            "WHERE r.customer.id = :customerId AND r.status = 'COMPLETED'")
    Double sumCompletedReservationsByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT COALESCE(MAX(r.totalPrice), 0) FROM Reservation r " +
            "WHERE r.customer.id = :customerId AND r.status = 'COMPLETED'")
    Double findMaxCompletedReservationPriceByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT r.workshop.instructor.id, r.workshop.instructor.fullname, COUNT(r) FROM Reservation r " +
        "WHERE r.customer.id = :customerId " +
        "GROUP BY r.workshop.instructor.id, r.workshop.instructor.fullname " +
        "ORDER BY COUNT(r) DESC")
    List<Object[]> findInstructorBookingCounts(@Param("customerId") Long customerId);

    long countByCustomerIdAndStatus(Long customerId, ReservationStatus status);

}
