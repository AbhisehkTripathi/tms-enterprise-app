package com.tms.shipment.app.services;

import com.tms.shipment.app.models.Shipment;
import com.tms.shipment.app.models.ShipmentDto;
import com.tms.shipment.app.repositories.ShipmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
public class ShipmentService {

  private final ShipmentRepository repository;

  public ShipmentService(ShipmentRepository repository) {
    this.repository = repository;
  }

  public Page<ShipmentDto> list(String status, String shipperName, String carrierName, int page, int size, String sortBy, String sortOrder) {
    Sort sort = "asc".equalsIgnoreCase(sortOrder) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
    Pageable pageable = PageRequest.of(page, size, sort);
    Page<Shipment> entities = repository.findAllFiltered(status, shipperName, carrierName, pageable);
    return entities.map(this::toDto);
  }

  public Optional<ShipmentDto> getById(String id) {
    return repository.findById(id).map(this::toDto);
  }

  @Transactional
  public ShipmentDto create(ShipmentDto dto) {
    Shipment e = new Shipment();
    e.setId(UUID.randomUUID().toString());
    mapDtoToEntity(dto, e);
    if (e.getStatus() == null) e.setStatus("pending");
    if (e.getRate() == null) e.setRate(BigDecimal.ZERO);
    return toDto(repository.save(e));
  }

  @Transactional
  public Optional<ShipmentDto> update(String id, ShipmentDto dto) {
    return repository.findById(id)
        .map(e -> {
          mapDtoToEntity(dto, e);
          return toDto(repository.save(e));
        });
  }

  @Transactional
  public boolean delete(String id) {
    if (!repository.existsById(id)) return false;
    repository.deleteById(id);
    return true;
  }

  private void mapDtoToEntity(ShipmentDto dto, Shipment e) {
    if (dto.getShipperName() != null) e.setShipperName(dto.getShipperName());
    if (dto.getCarrierName() != null) e.setCarrierName(dto.getCarrierName());
    if (dto.getPickupLocation() != null) e.setPickupLocation(dto.getPickupLocation());
    if (dto.getDeliveryLocation() != null) e.setDeliveryLocation(dto.getDeliveryLocation());
    if (dto.getTrackingNumber() != null) e.setTrackingNumber(dto.getTrackingNumber());
    if (dto.getStatus() != null) e.setStatus(dto.getStatus());
    if (dto.getRate() != null) e.setRate(dto.getRate());
    if (dto.getTrackingData() != null) e.setTrackingData(dto.getTrackingData());
  }

  private ShipmentDto toDto(Shipment e) {
    ShipmentDto dto = new ShipmentDto();
    dto.setId(e.getId());
    dto.setShipperName(e.getShipperName());
    dto.setCarrierName(e.getCarrierName());
    dto.setPickupLocation(e.getPickupLocation());
    dto.setDeliveryLocation(e.getDeliveryLocation());
    dto.setTrackingNumber(e.getTrackingNumber());
    dto.setStatus(e.getStatus());
    dto.setRate(e.getRate());
    dto.setTrackingData(e.getTrackingData());
    dto.setCreatedAt(e.getCreatedAt());
    dto.setUpdatedAt(e.getUpdatedAt());
    return dto;
  }
}
