package com.tms.shipment.app.services;

import com.tms.shipment.app.models.ShipmentDto;
import com.tms.shipment.app.repositories.ShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceTest {

  private ShipmentRepository repository;
  private ShipmentService service;

  @BeforeEach
  void setUp() {
    repository = mock(ShipmentRepository.class);
    service = new ShipmentService(repository);
  }

  @Test
  void create_setsDefaults() {
    ShipmentDto dto = new ShipmentDto();
    dto.setShipperName("Shipper A");
    dto.setCarrierName("Carrier B");
    dto.setPickupLocation("NYC");
    dto.setDeliveryLocation("LA");
    when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    ShipmentDto result = service.create(dto);
    assertThat(result.getShipperName()).isEqualTo("Shipper A");
    assertThat(result.getCarrierName()).isEqualTo("Carrier B");
    verify(repository).save(any());
  }
}
