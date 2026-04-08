import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  listVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehiclesAdmin,
  addVehicleImage,
  deleteVehicleImage,
  getVehicleImages,
  reorderVehicleImages,
  createAppraisal,
  addAppraisalImage,
  getAppraisalImages,
  listAppraisals,
  updateAppraisalStatus,
  createContact,
  listContacts,
  updateContactStatus,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (input.password !== "881231") {
          return { success: false, message: "密碼錯誤" } as const;
        }

        const { sdk } = await import("./_core/sdk");
        const token = await sdk.signSession({
          openId: "local-admin",
          appId: "local-admin-app",
          name: "本機管理員",
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });

        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== PUBLIC VEHICLE API =====
  vehicle: router({
    list: publicProcedure
      .input(z.object({
        series: z.array(z.string()).optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
        yearMin: z.number().optional(),
        yearMax: z.number().optional(),
        mileageMin: z.number().optional(),
        mileageMax: z.number().optional(),
        location: z.string().optional(),
      }).optional())
      .query(({ input }) => listVehicles(input ?? undefined)),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getVehicleById(input.id)),
  }),

  // ===== PUBLIC FORM SUBMISSIONS =====
  appraisal: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        year: z.string().min(1),
        mileage: z.string().min(1),
        relation: z.string().min(1),
        notes: z.string().optional(),
        images: z.array(z.object({
          base64: z.string(),
          mimeType: z.string(),
          fileName: z.string(),
          imageType: z.enum(["license", "vehicle"]),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { images, ...formData } = input;
        const result = await createAppraisal(formData);
        const appraisalId = result.id;

        // Upload images to S3 and save to DB
        if (images && images.length > 0) {
          for (const img of images) {
            const buffer = Buffer.from(img.base64, "base64");
            const ext = img.fileName.split(".").pop() || "jpg";
            const key = `appraisals/${appraisalId}/${nanoid()}.${ext}`;
            const { url } = await storagePut(key, buffer, img.mimeType);
            await addAppraisalImage({
              appraisalId,
              imageUrl: url,
              imageType: img.imageType,
              fileName: img.fileName,
            });
          }
        }

        return { id: appraisalId };
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().optional(),
        licensePlate: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        contactTime: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(({ input }) => createContact(input)),
  }),

  // ===== ADMIN API =====
  admin: router({
    // Vehicle management
    vehicles: router({
      list: adminProcedure.query(() => getAllVehiclesAdmin()),
      create: adminProcedure
        .input(z.object({
          series: z.string().min(1),
          model: z.string().min(1),
          year: z.number(),
          month: z.number(),
          color: z.string().min(1),
          mileage: z.number(),
          price: z.number(),
          location: z.string().min(1),
          imageUrl: z.string().optional(),
          engineType: z.string().optional(),
          displacement: z.string().optional(),
          fuelType: z.string().optional(),
          driveType: z.string().optional(),
          seats: z.number().optional(),
          exteriorFeatures: z.string().optional(),
          interiorFeatures: z.string().optional(),
          safetyFeatures: z.string().optional(),
          description: z.string().optional(),
          isNew: z.number().optional(),
        }))
        .mutation(({ input }) => createVehicle(input)),
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          data: z.object({
            series: z.string().optional(),
            model: z.string().optional(),
            year: z.number().optional(),
            month: z.number().optional(),
            color: z.string().optional(),
            mileage: z.number().optional(),
            price: z.number().optional(),
            location: z.string().optional(),
            imageUrl: z.string().optional(),
            engineType: z.string().optional(),
            displacement: z.string().optional(),
            fuelType: z.string().optional(),
            driveType: z.string().optional(),
            seats: z.number().optional(),
            exteriorFeatures: z.string().optional(),
            interiorFeatures: z.string().optional(),
            safetyFeatures: z.string().optional(),
            description: z.string().optional(),
            isNew: z.number().optional(),
            isActive: z.number().optional(),
          }),
        }))
        .mutation(({ input }) => updateVehicle(input.id, input.data)),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(({ input }) => deleteVehicle(input.id)),
    }),

    // Vehicle image management
    images: router({
      upload: adminProcedure
        .input(z.object({
          vehicleId: z.number(),
          base64: z.string(),
          mimeType: z.string(),
          fileName: z.string(),
        }))
        .mutation(async ({ input }) => {
          // Decode base64 and upload to S3
          const buffer = Buffer.from(input.base64, "base64");
          const ext = input.fileName.split(".").pop() || "jpg";
          const key = `vehicles/${input.vehicleId}/${nanoid()}.${ext}`;
          const { url } = await storagePut(key, buffer, input.mimeType);

          // Get current max sort order
          const existingImages = await getVehicleImages(input.vehicleId);
          const maxSort = existingImages.length > 0
            ? Math.max(...existingImages.map(img => img.sortOrder))
            : -1;

          // Save to DB
          const { insertId } = await addVehicleImage({
            vehicleId: input.vehicleId,
            imageUrl: url,
            sortOrder: maxSort + 1,
          });

          // Update main vehicle imageUrl if first image
          if (existingImages.length === 0) {
            await updateVehicle(input.vehicleId, { imageUrl: url });
          }

          return { url, sortOrder: maxSort + 1, imageId: insertId };
        }),

      delete: adminProcedure
        .input(z.object({ imageId: z.number(), vehicleId: z.number() }))
        .mutation(async ({ input }) => {
          await deleteVehicleImage(input.imageId);
          // Update main image if needed
          const remaining = await getVehicleImages(input.vehicleId);
          if (remaining.length > 0) {
            await updateVehicle(input.vehicleId, { imageUrl: remaining[0].imageUrl });
          } else {
            await updateVehicle(input.vehicleId, { imageUrl: null });
          }
        }),

      reorder: adminProcedure
        .input(z.object({
          vehicleId: z.number(),
          imageIds: z.array(z.number()),
        }))
        .mutation(({ input }) => reorderVehicleImages(input.vehicleId, input.imageIds)),

      list: adminProcedure
        .input(z.object({ vehicleId: z.number() }))
        .query(({ input }) => getVehicleImages(input.vehicleId)),
    }),

    // Appraisal submissions management
    appraisals: router({
      list: adminProcedure.query(() => listAppraisals()),
      getImages: adminProcedure
        .input(z.object({ appraisalId: z.number() }))
        .query(({ input }) => getAppraisalImages(input.appraisalId)),
      updateStatus: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "contacted", "completed", "cancelled"]),
        }))
        .mutation(({ input }) => updateAppraisalStatus(input.id, input.status)),
    }),

    // Contact submissions management
    contacts: router({
      list: adminProcedure.query(() => listContacts()),
      updateStatus: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "contacted", "completed"]),
        }))
        .mutation(({ input }) => updateContactStatus(input.id, input.status)),
    }),
  }),
});

export type AppRouter = typeof appRouter;
