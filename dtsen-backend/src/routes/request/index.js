import express from "express";
import requestRoutes from "./request.routes.js";
import documentRoutes from "./document.routes.js";
import requestedDatasetRoutes from "./requestedDataset.routes.js";
import requestStageRoutes from "./requestStage.routes.js";

const router = express.Router();

// Prefix masing-masing bagian
router.use("/requests", requestRoutes);
router.use("/documents", documentRoutes);
router.use("/datasets", requestedDatasetRoutes);
router.use("/stages", requestStageRoutes);

export default router;
