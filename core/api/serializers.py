from rest_framework import serializers
from core.models import Todo, Item, Order, OrderItem, Coupon, Sizes, OtherMarks, Variation, ItemVariation

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = (
            'id',
            'title',
            'description',
            'image'
        )


class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = (
            'id',
            'code',
            'amount'
        )

#################################################################
class ItemSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sizes
        fields = (
            'id',
            'name',
            'size'
        )

class ItemOtherMarksSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherMarks
        fields = (
            'id',
            'mark'
        )


class ItemsSerializer(serializers.ModelSerializer):
    # category = serializers.SerializerMethodField()
    # label = serializers.SerializerMethodField()
    # size = serializers.SerializerMethodField()
    # size = ItemSizeSerializer(many=True)
    # other_marks = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id',
            'title',
            'price',
            'discount_price',
            'category',
            'category_type',
            'size',
            'other_marks',
            'label',
            'slug',
            'description',
            'image'
        )

##################################################################


class ItemMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherMarks
        fields = (
            'id',
            'mark'
        )


class ItemSerializer(serializers.ModelSerializer):
    # category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    # size = serializers.SerializerMethodField()
    size = ItemSizeSerializer(many=True)
    other_marks = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id',
            'title',
            'price',
            'discount_price',
            'category',
            'category_type',
            'size',
            'other_marks',
            'label',
            'slug',
            'description',
            'image'
        )

    def create(self, validated_data):
        size_data = validated_data.pop('size')
        item = Item.objects.update_or_create(**validated_data)
        for size_data in size_data:
            Sizes.objects.create(item=item, **size_data)
        return item

    # def get_category(self, obj):
    #     return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()

    # def get_size(self, obj):
    #     return ItemSizeSerializer(obj.size, many=True).data
    
    def get_other_marks(self, obj):
        return ItemMarkSerializer(obj.other_marks, many=True).data


class VariationDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Variation
        fields = (
            'id',
            'name'
        )


class ItemVariationDetailSerializer(serializers.ModelSerializer):
    variation = serializers.SerializerMethodField()

    class Meta:
        model = ItemVariation
        fields = (
            'id',
            'variation',
            'value',
            'attachment'
        )
    
    def get_variation(self, obj):
        return VariationDetailSerializer(obj.variation).data


class OrderItemSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    item_variations = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'item',
            'item_variations',
            'size',
            'quantity',
            'final_price'
        )
    
    def get_item(self, obj):
        return ItemSerializer(obj.item).data

    def get_item_variations(self, obj):
        return ItemVariationDetailSerializer(obj.item_variations.all(), many=True).data

    def get_size(self, obj):
        return ItemSizeSerializer(obj.item_size, many=True).data

    def get_final_price(self, obj):
        return obj.get_final_price() # уже є ця функція в models


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    coupon = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'id',
            'order_items',
            'total',
            'coupon',
        )

    def get_order_items(self, obj):
        return OrderItemSerializer(obj.items.all(), many=True).data

    def get_total(self, obj):
        return obj.get_total() # уже є ця функція в models

    def get_coupon(self, obj):
        if obj.coupon is not None:
            return CouponSerializer(obj.coupon).data   # .data робить дані JSON serializeble ?
        return None


class ItemVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVariation
        fields = (
            'id',
            'value',
            'attachment'
        )


class VariationSerializer(serializers.ModelSerializer):
    item_variations = serializers.SerializerMethodField()

    class Meta:
        model = Variation
        fields = (
            'id',
            'name',
            'item_variations'
        )
    
    def get_item_variations(self, obj):
        return ItemVariationSerializer(obj.itemvariation_set.all(), many=True).data


class ItemDetailSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    variations = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    other_marks = serializers.SerializerMethodField()

    class Meta:
        model = Item
        lookup_field = 'slug'
        fields = (
            'id',
            'title',
            'price',
            'discount_price',
            'category',
            'category_type',
            'size',
            'other_marks',
            'label',
            'slug',
            'description',
            'image',
            'variations'
        )
        

    def get_category(self, obj):
        return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()

    def get_variations(self, obj):
        return VariationSerializer(obj.variation_set.all(), many=True).data
    
    def get_size(self, obj):
        return ItemSizeSerializer(obj.size, many=True).data
    
    def get_other_marks(self, obj):
        return ItemMarkSerializer(obj.other_marks, many=True).data
