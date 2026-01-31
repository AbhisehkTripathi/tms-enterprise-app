package com.tms.shipment.app.models;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

public class ShipmentDto {

  private String id;
  @NotBlank @Size(max = 255)
  private String shipperName;
  @NotBlank @Size(max = 255)
  private String carrierName;
  @NotBlank @Size(max = 500)
  private String pickupLocation;
  @NotBlank @Size(max = 500)
  private String deliveryLocation;
  @Size(max = 100)
  private String trackingNumber;
  @Size(max = 50)
  private String status;
  @DecimalMin("0")
  private BigDecimal rate;
  private Map<String, Object> trackingData;
  private Instant createdAt;
  private Instant updatedAt;

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
