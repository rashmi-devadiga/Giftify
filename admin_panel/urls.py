from django.urls import path
from . import views

app_name = "admin_panel"

urlpatterns = [

    # DASHBOARD
    path("", views.dashboard, name="dashboard"),
    path("dashboard/", views.dashboard, name="dashboard"),


    # PRODUCTS
    path(
        "product/",
        views.product,
        name="product"
    ),

    path(
        "products/add/",
        views.add_product,
        name="add_product"
    ),

    path(
        'products/edit/<str:product_id>/',
        views.edit_product,
        name='edit_product'
    ),


    path(
        "products/<str:product_id>/delete/",
        views.delete_product,
        name="delete_product"
    ),

    
    # GIFT HAMPER
    path(
        "gift-hamper/",
        views.gift_hamper,
        name="gift_hamper"
    ),

    path(
        "gift-hamper/add/",
        views.add_gift_hamper,
        name="add_gift_hamper"
    ),

    path(
        "gift-hamper/edit/<str:hamper_id>/",
        views.edit_gift_hamper,
        name="edit_gift_hamper"
    ),

    path(
        "gift-hamper/<str:hamper_id>/delete/",
        views.delete_gift_hamper,
        name="delete_gift_hamper"
    ),


    # INVENTORY
    path(
        "inventory/",
        views.inventory,
        name="inventory"
    ),

    path(
        "inventory/increase/<str:item_type>/<str:item_id>/",
        views.increase_inventory,
        name="increase_inventory"
    ),

    path(
        "inventory/decrease/<str:item_type>/<str:item_id>/",
        views.decrease_inventory,
        name="decrease_inventory"
    ),

    path(
        "inventory/remove/<str:item_type>/<str:item_id>/",
        views.remove_inventory,
        name="remove_inventory"
    ),


    # ORDERS
    path(
        "orders/",
        views.orders,
        name="orders"
    ),

    path(
        "orders/<str:order_id>/",
        views.order_detail,
        name="order_detail"
    ),

    path(
        "orders/<str:order_id>/status/",
        views.update_order_status,
        name="update_order_status"
    ),
]