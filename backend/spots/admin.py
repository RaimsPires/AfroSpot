from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import (
    Event,
    EventOrder,
    EventRegistration,
    EventTicketTier,
    EventVendorBooking,
    EventVendorTier,
    FeedBoost,
    FeedComment,
    FeedItem,
    FeedLike,
    FeedViewLog,
    OperatingHours,
    Product,
    ProductImage,
    Promotion,
    Service,
    ServiceImage,
    Spot,
    SpotInvitation,
    SpotMember,
)


class OperatingHoursInline(TabularInline):
    model = OperatingHours
    extra = 1


class ProductImageInline(TabularInline):
    model = ProductImage
    extra = 1


class ServiceImageInline(TabularInline):
    model = ServiceImage
    extra = 1


@admin.register(Spot)
class SpotAdmin(ModelAdmin):
    list_display = ("name", "city", "country", "category", "is_active", "is_verified")
    list_filter = ("is_active", "is_verified", "category", "shop_type", "country")
    search_fields = ("name", "city", "country", "email", "phone_number", "instagram_handle")
    ordering = ("-created_at",)
    inlines = [OperatingHoursInline]


@admin.register(SpotMember)
class SpotMemberAdmin(ModelAdmin):
    list_display = ("spot", "user", "role", "is_active")
    list_filter = ("role", "is_active")
    search_fields = ("spot__name", "user__email")
    ordering = ("-created_at",)


@admin.register(SpotInvitation)
class SpotInvitationAdmin(ModelAdmin):
    list_display = ("spot", "email", "role", "status", "expires_at")
    list_filter = ("status", "role")
    search_fields = ("spot__name", "email")
    ordering = ("-created_at",)


@admin.register(OperatingHours)
class OperatingHoursAdmin(ModelAdmin):
    list_display = ("spot", "day", "is_closed", "open_time", "close_time")
    list_filter = ("day", "is_closed")
    search_fields = ("spot__name",)


@admin.register(Event)
class EventAdmin(ModelAdmin):
    list_display = ("title", "spot", "start_datetime", "end_datetime", "status", "event_type")
    list_filter = ("status", "event_type", "is_at_spot_location")
    search_fields = ("title", "spot__name", "description", "category")
    ordering = ("-start_datetime",)


@admin.register(EventTicketTier)
class EventTicketTierAdmin(ModelAdmin):
    list_display = ("event", "name", "price", "capacity", "quantity_sold", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "event__title")


@admin.register(EventRegistration)
class EventRegistrationAdmin(ModelAdmin):
    list_display = ("ticket_id", "event", "user", "ticket_tier", "status", "amount_paid")
    list_filter = ("status",)
    search_fields = ("ticket_id", "event__title", "user__email")


@admin.register(EventOrder)
class EventOrderAdmin(ModelAdmin):
    list_display = ("order_id", "user", "event", "total_amount", "status", "payment_gateway_reference")
    list_filter = ("status",)
    search_fields = ("order_id", "user__email", "payment_gateway_reference", "event__title")


@admin.register(EventVendorBooking)
class EventVendorBookingAdmin(ModelAdmin):
    list_display = ("business_name", "event", "vendor_spot", "vendor_type", "status", "fee_paid")
    list_filter = ("status", "fee_paid", "vendor_type")
    search_fields = ("business_name", "event__title", "vendor_spot__name")


@admin.register(EventVendorTier)
class EventVendorTierAdmin(ModelAdmin):
    list_display = ("event", "name", "price", "capacity", "quantity_sold", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "event__title")


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ("name", "category", "stock_quantity", "sku", "requires_shipping", "is_active")
    list_filter = ("category", "requires_shipping", "is_active")
    search_fields = ("name", "sku", "description")
    inlines = [ProductImageInline]


@admin.register(ProductImage)
class ProductImageAdmin(ModelAdmin):
    list_display = ("product", "is_primary", "display_order")
    list_filter = ("is_primary",)
    search_fields = ("product__name", "alt_text")


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    list_display = ("name", "duration_minutes", "buffer_minutes", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    inlines = [ServiceImageInline]


@admin.register(ServiceImage)
class ServiceImageAdmin(ModelAdmin):
    list_display = ("service", "is_primary", "display_order")
    list_filter = ("is_primary",)
    search_fields = ("service__name", "alt_text")


@admin.register(FeedItem)
class FeedItemAdmin(ModelAdmin):
    list_display = ("spot", "caption", "total_views", "total_watch_time_seconds")
    search_fields = ("spot__name", "caption", "hashtags")
    ordering = ("-created_at",)


@admin.register(FeedViewLog)
class FeedViewLogAdmin(ModelAdmin):
    list_display = ("feed_item", "viewer", "duration_seconds")
    search_fields = ("feed_item__id", "viewer__email")


@admin.register(FeedLike)
class FeedLikeAdmin(ModelAdmin):
    list_display = ("feed", "user")
    search_fields = ("feed__id", "user__email")


@admin.register(FeedComment)
class FeedCommentAdmin(ModelAdmin):
    list_display = ("feed", "user", "parent", "created_at")
    search_fields = ("user__email", "text")
    ordering = ("-created_at",)


@admin.register(FeedBoost)
class FeedBoostAdmin(ModelAdmin):
    list_display = ("feed", "status", "budget_spent", "reach", "link_clicks", "start_date", "end_date")
    list_filter = ("status",)
    search_fields = ("feed__id", "target_audience")


@admin.register(Promotion)
class PromotionAdmin(ModelAdmin):
    list_display = ("title", "code", "discount_type", "discount_value", "target", "start_date", "end_date")
    list_filter = ("discount_type", "target")
    search_fields = ("title", "code")
