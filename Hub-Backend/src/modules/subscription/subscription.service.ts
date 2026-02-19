import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  AppPermissionDto,
  LicenseCheckResponseDto,
  PermissionsDto,
} from './dto/app-permission.dto';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/create-subscription.dto';
import { CreateProductMappingDto, UpdateProductMappingDto } from './dto/product-mapping.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
  ) { }

  // ==================== 앱 관리 ====================

  async getAllApps() {
    return this.prisma.hubApp.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
  }

  async getAppById(appId: string) {
    const app = await this.prisma.hubApp.findUnique({ where: { id: appId } });
    if (!app) {
      throw new NotFoundException(`앱을 찾을 수 없습니다: ${appId}`);
    }
    return app;
  }

  async createApp(appData: { id: string; name: string; description?: string; icon_url?: string; app_url?: string; pricing?: any; features?: any }) {
    const existing = await this.prisma.hubApp.findUnique({ where: { id: appData.id } });
    if (existing) {
      throw new ConflictException(`이미 존재하는 앱 ID입니다: ${appData.id}`);
    }
    return this.prisma.hubApp.create({ data: appData });
  }

  // ==================== 구독 관리 ====================

  async getMemberSubscriptions(memberId: string) {
    return this.prisma.hubAppSubscription.findMany({
      where: { member_id: memberId },
      include: { app: true },
    });
  }

  async getMemberAppSubscription(memberId: string, appId: string) {
    return this.prisma.hubAppSubscription.findUnique({
      where: { member_id_app_id: { member_id: memberId, app_id: appId } },
      include: { app: true },
    });
  }

  async createOrUpdateSubscription(dto: CreateSubscriptionDto) {
    await this.getAppById(dto.appId);

    return this.prisma.hubAppSubscription.upsert({
      where: { member_id_app_id: { member_id: dto.memberId, app_id: dto.appId } },
      update: {
        plan: dto.plan,
        status: 'active',
        started_at: new Date(),
        expires_at: dto.expiresAt ? new Date(dto.expiresAt) : null,
        payment_order_id: dto.paymentOrderId,
        features: dto.features,
        usage_limit: dto.usageLimit,
        usage_count: 0,
        auto_renew: dto.autoRenew ?? false,
      },
      create: {
        member_id: dto.memberId,
        app_id: dto.appId,
        plan: dto.plan,
        status: 'active',
        started_at: new Date(),
        expires_at: dto.expiresAt ? new Date(dto.expiresAt) : null,
        payment_order_id: dto.paymentOrderId,
        features: dto.features,
        usage_limit: dto.usageLimit,
        usage_count: 0,
        auto_renew: dto.autoRenew ?? false,
      },
    });
  }

  async updateSubscription(memberId: string, appId: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.getMemberAppSubscription(memberId, appId);
    if (!subscription) {
      throw new NotFoundException(`구독 정보를 찾을 수 없습니다`);
    }

    const updateData: Record<string, any> = {};
    if (dto.plan) updateData.plan = dto.plan;
    if (dto.status) updateData.status = dto.status;
    if (dto.expiresAt) updateData.expires_at = new Date(dto.expiresAt);
    if (dto.features) updateData.features = dto.features;
    if (dto.autoRenew !== undefined) updateData.auto_renew = dto.autoRenew;

    return this.prisma.hubAppSubscription.update({
      where: { member_id_app_id: { member_id: memberId, app_id: appId } },
      data: updateData,
    });
  }

  async cancelSubscription(memberId: string, appId: string) {
    return this.updateSubscription(memberId, appId, { status: 'cancelled' });
  }

  // ==================== JWT 권한 정보 ====================

  /**
   * 구독이 유효한지 확인하는 헬퍼 메서드
   * (기존 AppSubscriptionEntity.isValid() 메서드를 대체)
   */
  private isSubscriptionValid(subscription: { status: string; expires_at: Date | null }): boolean {
    if (subscription.status !== 'active') return false;
    if (subscription.expires_at && new Date() > subscription.expires_at) return false;
    return true;
  }

  async getMemberPermissions(memberId: string): Promise<PermissionsDto> {
    const subscriptions = await this.getMemberSubscriptions(memberId);
    const apps = await this.getAllApps();

    const permissions: PermissionsDto = {};

    for (const app of apps) {
      const subscription = subscriptions.find((s) => s.app_id === app.id);
      const features = app.features as any;

      if (subscription && this.isSubscriptionValid(subscription)) {
        permissions[app.id] = {
          plan: subscription.plan,
          expires: subscription.expires_at?.toISOString(),
          features: (subscription.features as any) || features?.[subscription.plan] || [],
        };
      } else {
        permissions[app.id] = {
          plan: features?.free ? 'free' : 'none',
          features: features?.free || [],
        };
      }
    }

    return permissions;
  }

  // ==================== 라이선스 확인 API (각 앱용) ====================

  async checkLicense(memberId: string, appId: string): Promise<LicenseCheckResponseDto> {
    const subscription = await this.getMemberAppSubscription(memberId, appId);
    const app = await this.getAppById(appId);
    const features = app.features as any;

    if (!subscription || !this.isSubscriptionValid(subscription)) {
      const hasFreeAccess = features?.free && features.free.length > 0;
      return {
        hasAccess: hasFreeAccess,
        plan: hasFreeAccess ? 'free' : 'none',
        features: features?.free || [],
      };
    }

    const response: LicenseCheckResponseDto = {
      hasAccess: true,
      plan: subscription.plan,
      features: (subscription.features as any) || features?.[subscription.plan] || [],
      expiresAt: subscription.expires_at?.toISOString(),
    };

    if (subscription.usage_limit) {
      response.remainingUsage = subscription.usage_limit - subscription.usage_count;
    }

    return response;
  }

  async incrementUsage(memberId: string, appId: string): Promise<boolean> {
    const subscription = await this.getMemberAppSubscription(memberId, appId);
    if (!subscription || !this.isSubscriptionValid(subscription)) {
      return false;
    }

    if (subscription.usage_limit && subscription.usage_count >= subscription.usage_limit) {
      return false;
    }

    await this.prisma.hubAppSubscription.update({
      where: { member_id_app_id: { member_id: memberId, app_id: appId } },
      data: { usage_count: { increment: 1 } },
    });
    return true;
  }

  // ==================== 만료 처리 ====================

  async processExpiredSubscriptions(): Promise<number> {
    const result = await this.prisma.hubAppSubscription.updateMany({
      where: {
        status: 'active',
        expires_at: { lt: new Date() },
      },
      data: { status: 'expired' },
    });

    return result.count;
  }

  // ==================== 상품-권한 매핑 관리 (관리자용) ====================

  async getAllProductMappings(appId?: string) {
    return this.prisma.hubProductPermissionMapping.findMany({
      where: appId ? { app_id: appId } : undefined,
      orderBy: { created_at: 'desc' },
    });
  }

  async getProductMappingById(id: number) {
    const mapping = await this.prisma.hubProductPermissionMapping.findUnique({ where: { id: BigInt(id) } });
    if (!mapping) {
      throw new NotFoundException(`상품-권한 매핑을 찾을 수 없습니다: ID ${id}`);
    }
    return mapping;
  }

  async getProductMappingByExternalId(appId: string, externalProductId: string) {
    return this.prisma.hubProductPermissionMapping.findFirst({
      where: {
        app_id: appId,
        external_product_id: externalProductId,
        is_active: true,
      },
    });
  }

  async createProductMapping(dto: CreateProductMappingDto) {
    await this.getAppById(dto.appId);

    const existing = await this.prisma.hubProductPermissionMapping.findFirst({
      where: {
        app_id: dto.appId,
        external_product_id: dto.externalProductId,
      },
    });

    if (existing) {
      throw new ConflictException(
        `이미 존재하는 상품 매핑입니다: ${dto.appId}/${dto.externalProductId}`,
      );
    }

    return this.prisma.hubProductPermissionMapping.create({
      data: {
        app_id: dto.appId,
        external_product_id: dto.externalProductId,
        product_name: dto.productName,
        plan: dto.plan,
        features: dto.features,
        duration_days: dto.durationDays,
        usage_limit: dto.usageLimit,
        is_active: dto.isActive ?? true,
        memo: dto.memo,
      },
    });
  }

  async updateProductMapping(id: number, dto: UpdateProductMappingDto) {
    await this.getProductMappingById(id);

    const updateData: Record<string, any> = {};
    if (dto.productName) updateData.product_name = dto.productName;
    if (dto.plan) updateData.plan = dto.plan;
    if (dto.features) updateData.features = dto.features;
    if (dto.durationDays !== undefined) updateData.duration_days = dto.durationDays;
    if (dto.usageLimit !== undefined) updateData.usage_limit = dto.usageLimit;
    if (dto.isActive !== undefined) updateData.is_active = dto.isActive;
    if (dto.memo !== undefined) updateData.memo = dto.memo;

    return this.prisma.hubProductPermissionMapping.update({
      where: { id: BigInt(id) },
      data: updateData,
    });
  }

  async deleteProductMapping(id: number): Promise<void> {
    await this.getProductMappingById(id);
    await this.prisma.hubProductPermissionMapping.delete({ where: { id: BigInt(id) } });
  }
}
