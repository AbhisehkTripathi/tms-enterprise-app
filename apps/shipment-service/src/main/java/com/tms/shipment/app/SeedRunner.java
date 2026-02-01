package com.tms.shipment.app;

import com.tms.shipment.app.models.ShipmentDto;
import com.tms.shipment.app.repositories.ShipmentRepository;
import com.tms.shipment.app.services.ShipmentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds sample shipments on startup when the repository is empty.
 */
@Component
public class SeedRunner implements CommandLineRunner {

  private final ShipmentService shipmentService;
  private final ShipmentRepository shipmentRepository;

  public SeedRunner(ShipmentService shipmentService, ShipmentRepository shipmentRepository) {
    this.shipmentService = shipmentService;
    this.shipmentRepository = shipmentRepository;
  }

  private static List<ShipmentDto> sampleShipments() {
    return List.of(
        dto("Acme Logistics", "FastFreight Inc", "123 Warehouse Ave, Chicago, IL", "456 Commerce St, Dallas, TX", "TRK001234567", "in_transit", "1250.50"),
        dto("Global Supplies Co", "Pacific Haulers", "789 Port Rd, Los Angeles, CA", "321 Industrial Blvd, Seattle, WA", "TRK002345678", "delivered", "890.00"),
        dto("Metro Retail Group", "Eastern Express", "555 Distribution Dr, Atlanta, GA", "777 Mall Way, Miami, FL", null, "pending", "2100.75"),
        dto("TechParts Ltd", "QuickShip Logistics", "100 Tech Park, Austin, TX", "200 Innovation Ave, Boston, MA", "TRK003456789", "in_transit", "675.25"),
        dto("Fresh Foods Distribution", "ColdChain Transport", "400 Farm Rd, Fresno, CA", "600 Market St, Phoenix, AZ", "TRK004567890", "in_transit", "450.00"),
        dto("Auto Parts Wholesale", "HeavyHaul Inc", "800 Industrial Pkwy, Detroit, MI", "900 Commerce Dr, Cleveland, OH", "TRK005678901", "pending", "3200.00"),
        dto("Pharma Supply Co", "SecureLogistics", "200 Lab Way, New Jersey", "300 Medical Center, Baltimore, MD", "TRK006789012", "in_transit", "1850.50"),
        dto("Fashion Imports", "Global Freight", "500 Harbor Blvd, Long Beach, CA", "600 Retail Row, Denver, CO", null, "delivered", "1100.25"),
        dto("Electronics Direct", "Express Tech Ship", "700 Silicon Dr, San Jose, CA", "800 Tech Hub, Portland, OR", "TRK007890123", "in_transit", "950.75"),
        dto("Building Materials Inc", "Bulk Carriers", "1000 Quarry Rd, Houston, TX", "1100 Construction Ave, Nashville, TN", "TRK008901234", "pending", "4200.00")
    );
  }

  private static ShipmentDto dto(String shipper, String carrier, String pickup, String delivery, String tracking, String status, String rate) {
    ShipmentDto d = new ShipmentDto();
    d.setShipperName(shipper);
    d.setCarrierName(carrier);
    d.setPickupLocation(pickup);
    d.setDeliveryLocation(delivery);
    d.setTrackingNumber(tracking);
    d.setStatus(status);
    d.setRate(new BigDecimal(rate));
    return d;
  }

  @Override
  public void run(String... args) {
    if (shipmentRepository.count() > 0) {
      return;
    }
    int count = 0;
    for (ShipmentDto dto : sampleShipments()) {
      shipmentService.create(dto);
      count++;
    }
    if (count > 0) {
      System.out.println("Seeded " + count + " sample shipments (shipment-service).");
    }
  }
}
