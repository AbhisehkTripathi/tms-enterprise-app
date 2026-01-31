package com.tms.shipment.app.controllers;

import com.tms.shipment.app.models.ShipmentDto;
import com.tms.shipment.app.services.ShipmentService;
import javax.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "*")
public class ShipmentController {

  private final ShipmentService shipmentService;

  public ShipmentController(ShipmentService shipmentService) {
    this.shipmentService = shipmentService;
  }

  @GetMapping
  public Page<ShipmentDto> list(
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String shipperName,
      @RequestParam(required = false) String carrierName,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "createdAt") String sortBy,
      @RequestParam(defaultValue = "desc") String sortOrder) {
    return shipmentService.list(status, shipperName, carrierName, page, size, sortBy, sortOrder);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ShipmentDto> getById(@PathVariable String id) {
    return shipmentService.getById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<ShipmentDto> create(@Valid @RequestBody ShipmentDto dto) {
    return ResponseEntity.status(HttpStatus.CREATED).body(shipmentService.create(dto));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<ShipmentDto> update(@PathVariable String id, @RequestBody ShipmentDto dto) {
    return shipmentService.update(id, dto)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    return shipmentService.delete(id)
        ? ResponseEntity.noContent().build()
        : ResponseEntity.notFound().build();
  }
}
