from django.urls import path
from . import views

app_name = "main"

urlpatterns = [

    #LOGIN
    path(
        "login/",
        views.login_view,
        name="login"
    ),


    #NEW USER
    path(
        "register/",
        views.register,
        name="register"
    ),


    #LOGOUT
    path(
        "logout/",
        views.logout_view,
        name="logout"
    ),


    #HOME
    path("", views.home, name="home"),


    #GIFT HAMPER
    path(
        "gift-hamper/",
        views.gift_hamper,
        name="gift_hamper"
    ),

    path(
        "gift-hamper/<str:hamper_id>/",
        views.view_gift_hamper,
        name="view_gift_hamper"
    ),


    #CUSTOMIZE HAMPER
    path(
        "customize/",
        views.customize,
        name="customize"
    ),


    #GIFTIFY CHAT
    path(
        "giftify-chat/",
        views.giftify_chat,
        name="giftify_chat"
    ),


    #WISHLIST
    path(
        "wishlist/",
        views.wishlist,
        name="wishlist"
    ),

    path(
        "wishlist/toggle/",
        views.wishlist_toggle,
        name="wishlist_toggle"
    ),

    path(
        "wishlist/remove/",
        views.remove_from_wishlist,
        name="remove_from_wishlist"
    ),

    path(
        "wishlist/check/",
        views.wishlist_check,
        name="wishlist_check"
    ),


    # CART
    path(
        "cart/",
        views.cart,
        name="cart"
    ),

    path(
        "cart/add/",
        views.add_to_cart,
        name="add_to_cart"
    ),

    path(
        "cart/remove/",
        views.remove_from_cart,
        name="remove_from_cart"
    ),


    # ORDER REVIEW
    path(
        "buy-now/",
        views.buy_now,
        name="buy_now"
    ),

    path(
        "review-order/",
        views.review_order,
        name="review_order"
    ),

    path(
        "address/save/",
        views.save_address,
        name="save_address"
    ),

    path(
        "address/delete/",
        views.delete_address,
        name="delete_address"
    ),

    path(
        "address/select/",
        views.select_address,
        name="select_address"
    ),


    #PAYMENT
    path(
            "payment/",
            views.payment,
            name="payment"
        ),


    path(
        "payment/complete/",
        views.complete_payment,
        name="complete_payment"
    ),


    #CONFIRMATION
    path(
        "confirmed/",
        views.confirmed,
        name="confirmed"
    ),


    #MY ORDER
    path(
        "my-orders/",
        views.my_orders,
        name="my_orders"
    ),

    path(
        "my-orders/<str:order_id>/",
        views.order_details,
        name="order_details"
    ),


    # MY ACCOUNT
    path(
        "my-account/",
        views.my_account,
        name="my_account"
    ),

]