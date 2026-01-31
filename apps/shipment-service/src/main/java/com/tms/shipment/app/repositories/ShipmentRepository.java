package com.tms.shipment.app.repositories;

import com.tms.shipment.app.models.Shipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShipmentRepository extends JpaRepository<Shipment, String> {

  @Query("SELECT s FROM Shipment s WHERE (:status IS NULL OR s.status = :status) " +
      "AND (:shipperName IS NULL OR LOWER(s.shipperName) LIKE LOWER(CONCAT('%', :shipperName, '%'))) " +
      "AND (:carrierName IS NULL OR LOWER(s.carrierName) LIKE LOWER(CONCAT('%', :carrierName, '%')))")
  Page<Shipment> findAllFiltered(
      @Param("status") String status,
      @Param("shipperName") String shipperName,
      @Param("carrierName") String carrierName,
      Pageable pageable);
}
