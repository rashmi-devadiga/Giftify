from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    availability = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('out_of_stock', 'Out of Stock'),
        ],
        default='available'
    )

    def __str__(self):
        return self.name


# GIFT HAMPER
class GiftHamper(models.Model):

    name = models.CharField(max_length=200)

    category = models.CharField(max_length=100)

    image = models.ImageField(
        upload_to='gift_hampers/',
        blank=True,
        null=True
    )

    description = models.TextField()

    selling_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    delivery_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    final_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    stock_quantity = models.PositiveIntegerField(
        default=0
    )

    availability = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('out_of_stock', 'Out of Stock'),
        ],
        default='available'
    )

    customization = models.CharField(
        max_length=10,
        choices=[
            ('yes', 'Yes'),
            ('no', 'No'),
        ],
        default='yes'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ITEMS INSIDE GIFT HAMPER
class HamperItem(models.Model):

    hamper = models.ForeignKey(
        GiftHamper,
        on_delete=models.CASCADE,
        related_name='items'
    )

    item_name = models.CharField(max_length=200)

    item_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.item_name