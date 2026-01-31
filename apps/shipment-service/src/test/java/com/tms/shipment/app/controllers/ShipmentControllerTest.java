package com.tms.shipment.app.controllers;

import com.tms.shipment.app.models.ShipmentDto;
import com.tms.shipment.app.services.ShipmentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentControllerTest {

  private final ShipmentService shipmentService = mock(ShipmentService.class);
  private final ShipmentController controller = new ShipmentController(shipmentService);

  @Test
  void list_returnsPage() {
    when(shipmentService.list(any(), any(), any(), eq(0), eq(10), any(), any()))
        .thenReturn(new PageImpl<>(List.of(new ShipmentDto()), PageRequest.of(0, 10), 1));
    var result = controller.list(null, null, null, 0, 10, "createdAt", "desc");
    assertThat(result.getContent()).hasSize(1);
    assertThat(result.getTotalElements()).isEqualTo(1);
  }

  @Test
  void getById_returnsNotFoundWhenMissing() {
    when(shipmentService.getById("missing")).thenReturn(Optional.empty());
    ResponseEntity<ShipmentDto> res = controller.getById("missing");
    assertThat(res.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
  }

  @Test
  void getById_returnsOkWhenFound() {
    ShipmentDto dto = new ShipmentDto();
    dto.setId("id1");
    when(shipmentService.getById("id1")).thenReturn(Optional.of(dto));
    ResponseEntity<ShipmentDto> res = controller.getById("id1");
    assertThat(res.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(res.getBody()).isNotNull();
    assertThat(res.getBody().getId()).isEqualTo("id1");
  }
}
