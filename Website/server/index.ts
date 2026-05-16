import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleEnquiry } from "./routes/enquiry";
import { handleVisitSchedule } from "./routes/visit-schedule";
import { handleContact } from "./routes/contact";
import { handleAdmissions } from "./routes/admissions";
import {
  handleLogin,
  handleLogout,
  handleCheckAuth,
  handleGetSMTPConfig,
  handleUpdateSMTPConfig,
  handleTestSMTPConnection,
  handleSendTestEmail,
  requireAuth,
} from "./routes/admin";
import {
  handleGetDocuments,
  handleGetDocument,
  handleUpdateDocument,
  uploadMiddleware,
  requireDocumentAuth,
} from "./routes/documents";
import {
  handleGetHeroImages,
  handleAddHeroImage,
  handleRemoveHeroImage,
  handleUpdateHeroImagesOrder,
  uploadMiddleware as heroImageUploadMiddleware,
  requireHeroImageAuth,
} from "./routes/hero-images";
import {
  handleGetGalleryImages,
  handleGetGalleryConfig,
  handleUpdateGalleryConfig,
  handleFetchGoogleDriveImages,
  handleAddGalleryImage,
  handleUpdateGalleryImage,
  handleDeleteGalleryImage,
  handleReorderGalleryImages,
  requireGalleryAuth,
} from "./routes/gallery";
import path from "path";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Serve static files from public directory (including uploads)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Form submission endpoints (all use SMTP from backend admin)
  app.post("/api/enquiry", handleEnquiry);
  app.post("/api/visit-schedule", handleVisitSchedule);
  app.post("/api/contact", handleContact);
  app.post("/api/admissions", handleAdmissions);

  // Admin authentication routes
  app.post("/api/admin/login", handleLogin);
  app.post("/api/admin/logout", handleLogout);
  app.get("/api/admin/check-auth", handleCheckAuth); // Public endpoint to check auth status

  // Admin SMTP management routes (require authentication)
  app.get("/api/admin/smtp", requireAuth, handleGetSMTPConfig);
  app.put("/api/admin/smtp", requireAuth, handleUpdateSMTPConfig);
  app.post("/api/admin/smtp/test-connection", requireAuth, handleTestSMTPConnection);
  app.post("/api/admin/smtp/test-email", requireAuth, handleSendTestEmail);

  // Public document routes (for frontend)
  app.get("/api/documents", handleGetDocuments);
  app.get("/api/documents/:id", handleGetDocument);

  // Admin document management routes (require authentication)
  app.put("/api/admin/documents/:id", requireDocumentAuth, uploadMiddleware, handleUpdateDocument);

  // Public hero images routes (for frontend)
  app.get("/api/hero-images", handleGetHeroImages);

  // Admin hero images management routes (require authentication)
  app.post("/api/admin/hero-images", requireHeroImageAuth, heroImageUploadMiddleware, handleAddHeroImage);
  app.delete("/api/admin/hero-images/:id", requireHeroImageAuth, handleRemoveHeroImage);
  app.put("/api/admin/hero-images/order", requireHeroImageAuth, handleUpdateHeroImagesOrder);

  // Public gallery routes (for frontend)
  app.get("/api/gallery", handleGetGalleryImages);

  // Admin gallery management routes (require authentication)
  app.get("/api/admin/gallery/config", requireGalleryAuth, handleGetGalleryConfig);
  app.put("/api/admin/gallery/config", requireGalleryAuth, handleUpdateGalleryConfig);
  app.post("/api/admin/gallery/fetch-drive", requireGalleryAuth, handleFetchGoogleDriveImages);
  app.post("/api/admin/gallery/images", requireGalleryAuth, handleAddGalleryImage);
  app.put("/api/admin/gallery/images/:id", requireGalleryAuth, handleUpdateGalleryImage);
  app.delete("/api/admin/gallery/images/:id", requireGalleryAuth, handleDeleteGalleryImage);
  app.put("/api/admin/gallery/images/reorder", requireGalleryAuth, handleReorderGalleryImages);

  return app;
}
