import { PrismaModule } from "./prisma.module";
import { PrismaService } from "./prisma.service";
import { PrismaClient, Prisma as PrismaTypes } from "../dist/client";
import type * as PrismaModules from "../dist/client";

export {
  PrismaModule,
  PrismaService,
  PrismaClient,
  PrismaTypes,
  PrismaModules,
};
