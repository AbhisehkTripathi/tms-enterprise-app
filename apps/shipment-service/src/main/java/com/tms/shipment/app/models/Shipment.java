package com.tms.shipment.app.models;

import javax.persistence.*;
import org.hibernate.annotations.GenericGenerator;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "shipments")
public class Shipment {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  private String id;

  @Column(nullable = false, length = 255)
  private String shipperName;

  @Column(nullable = false, length = 255)
  private String carrierName;

  @Column(nullable = false, length = 500)
  private String pickupLocation;

  @Column(nullable = false, length = 500)
  private String deliveryLocation;

  @Column(length = 100)
  private String trackingNumber;

  @Column(length = 50, nullable = false)
  private String status = "pending";

  @Column(precision = 12, scale = 2, nullable = false)
  private BigDecimal rate = BigDecimal.ZERO;

  @Column(columnDefinition = "clob")
  @Convert(converter = JsonMapConverter.class)
  private Map<String, Object> trackingData;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

  @PrePersist
  void timestamps() {
    Instant now = Instant.now();
    if (createdAt == null) createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void updated() {
    updatedAt = Instant.now();
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getShipperName() { return shipperName; }
  public void setShipperName(String shipperName) { this.shipperName = shipperName; }
  public String getCarrierName() { return carrierName; }
  public void setCarrierName(String carrierName) { this.carrierName = carrierName; }
  public String getPickupLocation() { return pickupLocation; }
  public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
  public String getDeliveryLocation() { return deliveryLocation; }
  public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }
  public String getTrackingNumber() { return trackingNumber; }
  public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public BigDecimal getRate() { return rate; }
  public void setRate(BigDecimal rate) { this.rate = rate; }
  public Map<String, Object> getTrackingData() { return trackingData; }
  public void setTrackingData(Map<String, Object> trackingData) { this.trackingData = trackingData; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
