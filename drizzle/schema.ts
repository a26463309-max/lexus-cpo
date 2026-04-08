import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Vehicles table - stores all CPO vehicle listings
 */
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  series: varchar("series", { length: 20 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: int("year").notNull(),
  month: int("month").notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  mileage: int("mileage").notNull(),
  price: int("price").notNull(), // in 萬
  location: varchar("location", { length: 100 }).notNull(),
  imageUrl: text("imageUrl"), // 主圖（第一張圖片）
  engineType: varchar("engineType", { length: 50 }),
  displacement: varchar("displacement", { length: 50 }),
  fuelType: varchar("fuelType", { length: 50 }),
  driveType: varchar("driveType", { length: 50 }),
  seats: int("seats"),
  exteriorFeatures: text("exteriorFeatures"),
  interiorFeatures: text("interiorFeatures"),
  safetyFeatures: text("safetyFeatures"),
  description: text("description"),
  isNew: int("isNew").default(1),
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VehicleSelect = typeof vehicles.$inferSelect;
export type VehicleInsert = typeof vehicles.$inferInsert;

/**
 * Vehicle images table - stores multiple images per vehicle
 */
export const vehicleImages = mysqlTable("vehicle_images", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VehicleImageSelect = typeof vehicleImages.$inferSelect;
export type VehicleImageInsert = typeof vehicleImages.$inferInsert;

/**
 * Appraisal submissions - stores vehicle appraisal requests
 */
export const appraisalSubmissions = mysqlTable("appraisal_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  brand: varchar("brand", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: varchar("year", { length: 10 }).notNull(),
  mileage: varchar("mileage", { length: 20 }).notNull(),
  relation: varchar("relation", { length: 50 }).notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "contacted", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AppraisalSelect = typeof appraisalSubmissions.$inferSelect;
export type AppraisalInsert = typeof appraisalSubmissions.$inferInsert;

/**
 * Appraisal images - stores uploaded images for appraisal requests
 */
export const appraisalImages = mysqlTable("appraisal_images", {
  id: int("id").autoincrement().primaryKey(),
  appraisalId: int("appraisalId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  imageType: varchar("imageType", { length: 20 }).notNull(), // 'license' or 'vehicle'
  fileName: varchar("fileName", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AppraisalImageSelect = typeof appraisalImages.$inferSelect;
export type AppraisalImageInsert = typeof appraisalImages.$inferInsert;

/**
 * Contact submissions - stores contact form submissions
 */
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 320 }),
  licensePlate: varchar("licensePlate", { length: 20 }),
  city: varchar("city", { length: 50 }),
  district: varchar("district", { length: 50 }),
  contactTime: varchar("contactTime", { length: 50 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "contacted", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSelect = typeof contactSubmissions.$inferSelect;
export type ContactInsert = typeof contactSubmissions.$inferInsert;
