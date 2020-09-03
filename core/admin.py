from django.contrib import admin
from .models import (Item, OrderItem, Order, Payment, BillingAddress, 
					Coupon, UserProfile, Refund, Variation, ItemVariation
)


def make_refund_accepted(modelAdmin, request, queryset):
	queryset.update(refund_requested=False, refund_grunted=True)


make_refund_accepted.short_description = 'Update orders to refund granted'


class OrderAdmin(admin.ModelAdmin):
	list_display = ['user', 
					'ordered', 
					'being_delivered',
					'received',
					'refund_requested',
					'refund_grunted',
					'billing_address',
					'payment',
					'coupon']
	list_display_links = ['user', 
						'billing_address',
						'payment',
						'coupon']

	list_filter = [
		'user', 				
		'ordered', 
		'being_delivered',
		'received',
		'refund_requested',
		'refund_grunted']
	search_fields = [
		'user__username',
		'ref_code',
	]

	actions = [make_refund_accepted]

class BillingAddressAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'city', 
		'delivery',
    ]
    list_filter = ['delivery', 'city']
    search_fields = ['user', 'city', 'delivery']


class ItemVariationAdmin(admin.ModelAdmin):
	list_display = [
		'variation',
		'value',
		'attachment']
	list_filter = ['variation', 'variation__item']
	search_fields = ['value']


class ItemVariationInLineAdmin(admin.TabularInline):
	model = ItemVariation
	extra = 1


class VariationAdmin(admin.ModelAdmin):
	list_display = [
		'item',
		'name']
	list_filter = ['item']
	search_fields = ['name']
	inlines = [ItemVariationInLineAdmin]


admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(Item)
admin.site.register(OrderItem)
admin.site.register(Order, OrderAdmin)
admin.site.register(Payment)
admin.site.register(Coupon)
admin.site.register(Refund)
admin.site.register(BillingAddress, BillingAddressAdmin)
admin.site.register(UserProfile)
