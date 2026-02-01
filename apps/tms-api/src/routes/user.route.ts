import express from "express";
import { createGraphQLHandler } from "@config/graphql";

const route = express.Router();

route.use("/", createGraphQLHandler());

export default route;
   

