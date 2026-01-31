import Joi from "joi";

export const createShipment = Joi.object({
  shipperName: Joi.string().required().max(255),
  carrierName: Joi.string().required().max(255),
  pickupLocation: Joi.string().required().max(500),
  deliveryLocation: Joi.string().required().max(500),
  trackingNumber: Joi.string().allow(null, "").max(100).optional(),
  status: Joi.string().max(50).optional(),
  rate: Joi.number().min(0).optional(),
  trackingData: Joi.object().allow(null).optional(),
}).options({ abortEarly: false });

export const updateShipment = Joi.object({
  shipperName: Joi.string().max(255).optional(),
  carrierName: Joi.string().max(255).optional(),
  pickupLocation: Joi.string().max(500).optional(),
  deliveryLocation: Joi.string().max(500).optional(),
  trackingNumber: Joi.string().allow(null, "").max(100).optional(),
  status: Joi.string().max(50).optional(),
  rate: Joi.number().min(0).optional(),
  trackingData: Joi.object().allow(null).optional(),
}).options({ abortEarly: false });

export const deleteShipment = Joi.object({
  id: Joi.string().required(),
}).options({ abortEarly: false });
