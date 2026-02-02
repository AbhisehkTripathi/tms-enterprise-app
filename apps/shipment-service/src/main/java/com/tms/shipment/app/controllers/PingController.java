package com.tms.shipment.app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Lightweight ping for Render activity logs when users land on the web app. */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PingController {

  @GetMapping("/ping")
  public ResponseEntity<Void> ping() {
    return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
