from firebase_config.firebase import db

from django.http import JsonResponse
from django.views.decorators.http import require_POST

import json
import uuid

from django.shortcuts import redirect, render

from datetime import datetime

from django.shortcuts import render, redirect
import random
import string

from django.contrib.auth.hashers import make_password, check_password

from firebase_admin import firestore

from django.http import HttpResponse

from django.urls import reverse

from django.views.decorators.clickjacking import xframe_options_sameorigin


# LOGIN
def login_view(request):

    if request.method == "GET":

        return render(
            request,
            "main/login.html"
        )


    if request.method == "POST":

        email = request.POST.get(
            "email",
            ""
        ).strip().lower()

        password = request.POST.get(
            "password",
            ""
        )


        # BASIC VALIDATION
        if not email or not password:

            return render(
                request,
                "main/login.html",
                {
                    "error":
                        "Please enter your email and password."
                }
            )


        # FIND USER
        try:

            user_docs = (
                db.collection("users")
                .where(
                    "email",
                    "==",
                    email
                )
                .limit(1)
                .stream()
            )


            user = None

            for doc in user_docs:

                user = doc.to_dict()

                user["document_id"] = doc.id

                break


        except Exception as e:

            print(
                "LOGIN ERROR:",
                e
            )

            return render(
                request,
                "main/login.html",
                {
                    "error":
                        "Something went wrong. Please try again."
                }
            )


        # USER NOT FOUND
        if not user:

            return render(
                request,
                "main/login.html",
                {
                    "error":
                        "Invalid email or password."
                }
            )


        # CHECK PASSWORD
        stored_password = user.get(
            "password",
            ""
        )


        if not check_password(
            password,
            stored_password
        ):

            return render(
                request,
                "main/login.html",
                {
                    "error":
                        "Invalid email or password."
                }
            )


        # LOGIN SUCCESS
        request.session["giftify_user_id"] = (
            user.get(
                "document_id",
                ""
            )
        )

        request.session["giftify_user_name"] = (
            user.get(
                "full_name",
                ""
            )
        )

        request.session["giftify_user_email"] = (
            user.get(
                "email",
                ""
            )
        )


        # GO TO HOME
        return redirect(
            "main:home"
        )



# REGISTER
def register(request):

    if request.method == "GET":

        return render(
            request,
            "main/register.html"
        )


    if request.method == "POST":

        full_name = request.POST.get(
            "full_name",
            ""
        ).strip()

        email = request.POST.get(
            "email",
            ""
        ).strip().lower()

        password = request.POST.get(
            "password",
            ""
        )

        confirm_password = request.POST.get(
            "confirm_password",
            ""
        )


        # VALIDATION
        if (
            not full_name
            or not email
            or not password
            or not confirm_password
        ):

            return render(
                request,
                "main/register.html",
                {
                    "error":
                        "Please fill in all fields."
                }
            )


        if password != confirm_password:

            return render(
                request,
                "main/register.html",
                {
                    "error":
                        "Passwords do not match."
                }
            )


        if len(password) < 6:

            return render(
                request,
                "main/register.html",
                {
                    "error":
                        "Password must be at least 6 characters."
                }
            )


        # CHECK EXISTING EMAIL
        try:

            existing_users = (
                db.collection("users")
                .where(
                    "email",
                    "==",
                    email
                )
                .limit(1)
                .stream()
            )


            existing_user = None

            for doc in existing_users:

                existing_user = doc

                break


        except Exception as e:

            print(
                "REGISTER CHECK ERROR:",
                e
            )

            return render(
                request,
                "main/register.html",
                {
                    "error":
                        "Something went wrong. Please try again."
                }
            )


        # EMAIL ALREADY EXISTS
        if existing_user:

            return render(
                request,
                "main/register.html",
                {
                    "error":
                        "An account with this email already exists."
                }
            )


        # HASH PASSWORD
        hashed_password = make_password(
            password
        )


        # CREATE USER
        user_data = {

            "full_name":
                full_name,

            "email":
                email,

            "password":
                hashed_password,

        }


        try:

            user_reference = (
                db.collection("users")
                .add(
                    user_data
                )
            )


            # Firestore returns:
            # (timestamp, document_reference)
            document_reference = (
                user_reference[1]
            )


        except Exception as e:

            print(
                "REGISTER ERROR:",
                e
            )

            return render(
                request,
                "main/register.html",
                {
                    "error":
                        "Unable to create account. Please try again."
                }
            )


        # LOGIN USER AUTOMATICALLY
        request.session["giftify_user_id"] = (
            document_reference.id
        )

        request.session["giftify_user_name"] = (
            full_name
        )

        request.session["giftify_user_email"] = (
            email
        )


        # DIRECTLY OPEN HOME
        return redirect(
            "main:home"
        )



# LOGOUT
def logout_view(request):

    # Clear Giftify login session
    request.session.pop(
        "giftify_user_id",
        None
    )

    request.session.pop(
        "giftify_user_name",
        None
    )

    request.session.pop(
        "giftify_user_email",
        None
    )

    # Save session changes
    request.session.modified = True

    # Go back to Home
    return redirect(
        "main:home"
    )



# LAYOUT
def layout(request):
    return render(request, "main/layout.html")



# HOME
def home(request):
    hampers = []

    try:
        docs = db.collection("hampers").stream()

        for doc in docs:
            hamper = doc.to_dict()
            hamper["id"] = doc.id
            hampers.append(hamper)

        # Newest first
        hampers.reverse()

    except Exception as e:
        print("Error loading hampers:", e)

    return render(
        request,
        "main/home.html",
        {
            "hampers": hampers
        }
    )



# GIFT HAMPER
def gift_hamper(request): 
    hampers = [] 
 
    try: 
        docs = db.collection("hampers").stream() 
 
        for doc in docs: 
            hamper = doc.to_dict() 
            hamper["id"] = doc.id 


            # CATEGORY
            categories = hamper.get(
                "category",
                []
            )

            if isinstance(
                categories,
                str
            ):
                categories = [
                    categories
                ]

            hamper["category"] = categories


            hampers.append(hamper) 
 
        # Newest first 
        hampers.reverse() 
 
    except Exception as e: 
        print("Error loading hampers:", e) 
 
    return render( 
        request, 
        "main/gift_hamper.html", 
        { 
            "hampers": hampers 
        } 
    )



# CUSTOMIZE HAMPERS
def customize(request):

    hampers = []

    try:

        docs = db.collection("hampers").stream()

        for doc in docs:

            hamper = doc.to_dict()


            # Keep Firestore document ID
            hamper["id"] = doc.id


            # CATEGORY
            categories = hamper.get(
                "category",
                []
            )

            if isinstance(
                categories,
                str
            ):
                categories = [
                    categories
                ]

            hamper["category"] = categories


            # CHECK CUSTOMIZATION
            customization = str(
                hamper.get(
                    "customization",
                    ""
                )
            ).strip().lower()


            # ONLY CUSTOMIZABLE HAMPERS
            if customization in [
                "yes",
                "true",
                "1",
                "customizable"
            ]:

                hampers.append(
                    hamper
                )


        # NEWEST FIRST
        hampers.reverse()

    except Exception as e:

        print(
            "Error loading customizable hampers:",
            e
        )


    # RENDER CUSTOMIZE PAGE
    return render(
        request,
        "main/customize.html",
        {
            "hampers": hampers
        }
    )



# GIFTIFY CHAT
def giftify_chat(request):

    hampers = []

    try:

        docs = db.collection("hampers").stream()

        for doc in docs:

            hamper = doc.to_dict()

            hamper["id"] = doc.id


            # CATEGORY
            categories = hamper.get(
                "category",
                []
            )

            if isinstance(
                categories,
                str
            ):
                categories = [
                    categories
                ]

            hamper["category"] = categories

            hampers.append(
                hamper
            )

    except Exception as e:

        print(
            "Giftify Chat hampers error:",
            e
        )


    return render(
        request,
        "main/giftify_chat.html",
        {
            "hampers": hampers
        }
    )



# VIEW GIFT HAMPER
def view_gift_hamper(request, hamper_id):


    # GET SELECTED GIFT HAMPER
    hamper_ref = db.collection("hampers").document(hamper_id)
    hamper_doc = hamper_ref.get()

    if not hamper_doc.exists:

        return render(
            request,
            "main/view_gift_hamper.html",
            {
                "hamper": None,
                "recommendations": [],
                "products": []
            }
        )

    hamper = hamper_doc.to_dict()


    # Keep Firestore document ID
    hamper["id"] = hamper_doc.id


    # STOCK / AVAILABILITY
    stock_quantity = int(
        hamper.get(
            "stock_quantity",
            0
        ) or 0
    )

    if stock_quantity <= 0:

        availability = "out_of_stock"

    elif stock_quantity <= 2:

        availability = "low_stock"

    else:

        availability = "available"

    hamper["stock_quantity"] = stock_quantity

    hamper["availability"] = availability


    # GET OTHER GIFT HAMPERS
    all_docs = db.collection("hampers").stream()

    other_hampers = []

    for doc in all_docs:


        # Don't show the currently opened hamper
        if doc.id == hamper_id:
            continue

        item = doc.to_dict()

        item["id"] = doc.id


        # STOCK / AVAILABILITY FOR RECOMMENDATIONS
        stock_quantity = int(
            item.get(
                "stock_quantity",
                0
            ) or 0
        )

        if stock_quantity <= 0:

            availability = "out_of_stock"

        elif stock_quantity <= 2:

            availability = "low_stock"

        else:

            availability = "available"

        item["stock_quantity"] = stock_quantity

        item["availability"] = availability

        other_hampers.append(item)


    # RANDOM 4 HAMPERS
    if len(other_hampers) > 4:

        recommendations = random.sample(
            other_hampers,
            4
        )

    else:

        recommendations = other_hampers


    # GET PRODUCTS ADDED BY ADMIN
    products = []

    try:

        product_docs = db.collection("products").stream()

        for doc in product_docs:

            product = doc.to_dict()


            # Keep Firestore document ID
            product["id"] = doc.id

            products.append(product)

    except Exception as e:

        print("Products error:", e)


    # SEND DATA TO TEMPLATE
    context = {

        "hamper": hamper,

        "recommendations": recommendations,

        "products": products,

    }


    return render(
        request,
        "main/view_gift_hamper.html",
        context
    )



# WISHLIST PAGE
def wishlist(request):


    # Get logged-in user's unique Firestore document ID
    user_id = request.session.get("giftify_user_id")


    # USER NOT LOGGED IN
    if not user_id:

        return render(
            request,
            "main/wishlist.html",
            {
                "wishlist_items": [],
                "login_required": True
            }
        )


    wishlist_items = []


    try:

        docs = (
            db.collection("wishlists")
            .document(str(user_id))
            .collection("items")
            .stream()
        )


        for doc in docs:

            item = doc.to_dict()

            item["id"] = doc.id

            wishlist_items.append(
                item
            )


    except Exception as e:

        print(
            "Wishlist error:",
            e
        )


    return render(
        request,
        "main/wishlist.html",
        {
            "wishlist_items": wishlist_items,
            "login_required": False
        }
    )



# ADD / REMOVE WISHLIST
@require_POST
def wishlist_toggle(request):


    # Get logged-in user's unique Firestore document ID
    user_id = request.session.get(
        "giftify_user_id"
    )


    # User must be logged in
    if not user_id:

        return JsonResponse(
            {
                "success": False,
                "message":
                    "Please login to use your wishlist.",
                "login_required": True
            },
            status=401
        )


    hamper_id = request.POST.get(
        "id"
    )

    name = request.POST.get(
        "name"
    )

    price = request.POST.get(
        "price"
    )

    image = request.POST.get(
        "image"
    )


    if not hamper_id:

        return JsonResponse(
            {
                "success": False,
                "message":
                    "Hamper ID is required."
            },
            status=400
        )


    item_ref = (
        db.collection("wishlists")
        .document(str(user_id))
        .collection("items")
        .document(str(hamper_id))
    )


    try:

        existing = item_ref.get()


        # REMOVE
        if existing.exists:

            item_ref.delete()

            return JsonResponse(
                {
                    "success": True,
                    "action": "removed"
                }
            )


        # ADD
        item_ref.set(

            {
                "id": str(hamper_id),

                "name": name or "",

                "price": price or "",

                "image": image or "",
            }

        )


        return JsonResponse(
            {
                "success": True,
                "action": "added"
            }
        )


    except Exception as e:

        print(
            "Wishlist toggle error:",
            e
        )

        return JsonResponse(
            {
                "success": False,
                "message": str(e)
            },
            status=500
        )



# REMOVE FROM WISHLIST PAGE
@require_POST
def remove_from_wishlist(request):


    # Get logged-in user's unique Firestore document ID
    user_id = request.session.get("giftify_user_id")


    # User must be logged in
    if not user_id:
        return JsonResponse({
            "success": False,
            "message": "Please login."
        }, status=401)


    hamper_id = request.POST.get("id")


    if not hamper_id:
        return JsonResponse({
            "success": False
        }, status=400)


    try:

        (
            db.collection("wishlists")
            .document(str(user_id))
            .collection("items")
            .document(str(hamper_id))
            .delete()
        )


        return JsonResponse({
            "success": True
        })


    except Exception as e:

        print("Remove wishlist error:", e)

        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=500)



# CHECK WISHLIST
def wishlist_check(request):


    # Get logged-in user's unique Firestore document ID
    user_id = request.session.get("giftify_user_id")


    # User must be logged in
    if not user_id:
        return JsonResponse({
            "success": False,
            "in_wishlist": False,
            "login_required": True
        }, status=401)


    hamper_id = request.GET.get("id")


    if not hamper_id:
        return JsonResponse({
            "success": False
        }, status=400)


    try:

        item_ref = (
            db.collection("wishlists")
            .document(str(user_id))
            .collection("items")
            .document(str(hamper_id))
        )


        item = item_ref.get()


        return JsonResponse({
            "success": True,
            "in_wishlist": item.exists
        })


    except Exception as e:

        print("Wishlist check error:", e)

        return JsonResponse({
            "success": False,
            "message": str(e)
        }, status=500)



# CART
def cart(request):


    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )


    # USER NOT LOGGED IN
    if not user_id:

        return render(
            request,
            "main/cart.html",
            {
                "cart_items": [],
                "cart_total_price": 0,
                "cart_discount": 0,
                "cart_delivery": 0,
                "cart_grand_total": 0,
                "has_available_items": False,
                "login_required": True
            }
        )


    # ACCOUNT-SPECIFIC CART KEY
    cart_key = f"giftify_cart_{user_id}"


    cart_items = request.session.get(
        cart_key,
        []
    )


    if not isinstance(
        cart_items,
        list
    ):

        cart_items = []


    # CHECK LATEST FIRESTORE STOCK
    # Every time Cart page opens/refreshed
    # stock = 0 then Out of Stock
    # stock = 1 or more then Available
    # Item is NEVER automatically deleted
    for item in cart_items:

        hamper_id = str(
            item.get(
                "hamper_id",
                ""
            ) or ""
        )


        # DEFAULT VALUES
        item["is_out_of_stock"] = False

        item["available_stock"] = 0


        if not hamper_id:

            continue


        # GET LATEST HAMPER STOCK FROM FIRESTORE
        try:

            hamper_ref = (
                db.collection(
                    "hampers"
                )
                .document(
                    hamper_id
                )
            )


            hamper_doc = hamper_ref.get()


            # HAMPER EXISTS
            if hamper_doc.exists:

                hamper = hamper_doc.to_dict()


                latest_stock = int(
                    hamper.get(
                        "stock_quantity",
                        0
                    ) or 0
                )


                item["available_stock"] = (
                    latest_stock
                )


                # OUT OF STOCK
                if latest_stock <= 0:

                    item["is_out_of_stock"] = True


                # AVAILABLE
                else:

                    item["is_out_of_stock"] = False


            # HAMPER DOES NOT EXIST
            else:

                item["available_stock"] = 0

                item["is_out_of_stock"] = True


        except Exception as e:

            print(
                "Cart stock check error:",
                e
            )


            # Keep existing behavior.
            # If Firestore check fails, don't mark
            # the item as unavailable.

            item["is_out_of_stock"] = False


    # CALCULATE CART TOTAL
    # ONLY AVAILABLE ITEMS ARE INCLUDED
    # Out-of-stock item:
    # selling_price NOT included
    # discount_amount NOT included
    # delivery_charge NOT included
    # But values remain unchanged inside the
    # cart item so its own price can still be displayed
    cart_total_price = 0

    cart_discount = 0

    cart_delivery = 0


    for item in cart_items:


        # SKIP OUT-OF-STOCK ITEM
        if item.get(
            "is_out_of_stock",
            False
        ):

            continue


        # AVAILABLE ITEM PRICE
        cart_total_price += float(
            item.get(
                "selling_price",
                0
            ) or 0
        )


        # AVAILABLE ITEM DISCOUNT
        cart_discount += float(
            item.get(
                "discount_amount",
                0
            ) or 0
        )


        # AVAILABLE ITEM DELIVERY
        cart_delivery += float(
            item.get(
                "delivery_charge",
                0
            ) or 0
        )


    # FINAL CART TOTAL
    cart_grand_total = (
        cart_total_price
        -
        cart_discount
        +
        cart_delivery
    )


    # CHECK AVAILABLE ITEMS
    # If at least one item is available
    # then Continue button stays enabled
    # If every item is out of stock
    # then Continue can be disabled
    available_cart_items = [

        item

        for item in cart_items

        if not item.get(
            "is_out_of_stock",
            False
        )

    ]


    has_available_items = (
        len(available_cart_items) > 0
    )


    # SAVE UPDATED STOCK STATUS
    request.session[
        cart_key
    ] = cart_items

    request.session.modified = True


    # RENDER CART
    return render(
        request,
        "main/cart.html",
        {
            "cart_items":
                cart_items,

            "cart_total_price":
                cart_total_price,

            "cart_discount":
                cart_discount,

            "cart_delivery":
                cart_delivery,

            "cart_grand_total":
                cart_grand_total,

            "has_available_items":
                has_available_items,

            "login_required":
                False
        }
    )



# ADD TO CART
def add_to_cart(request):

    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )


    # LOGIN REQUIRED
    # If the user is not logged in
    # Add to Cart - Login
    if not user_id:

        return JsonResponse(
            {
                "success": False,

                "message":
                    "Please login to add items to cart.",

                "login_required":
                    True,

                "login_url":
                    reverse("main:login")
            },
            status=401
        )


    # REQUEST METHOD
    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,

                "message":
                    "Invalid request."
            },
            status=400
        )


    # READ JSON
    try:

        data = json.loads(
            request.body
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,

                "message":
                    "Invalid data."
            },
            status=400
        )


    # GET DATA
    hamper_id = data.get(
        "hamper_id"
    )

    customized = data.get(
        "customized",
        False
    )

    selected_items = data.get(
        "items",
        []
    )


    if not hamper_id:

        return JsonResponse(
            {
                "success": False,

                "message":
                    "Hamper ID missing."
            },
            status=400
        )


    # MAKE SURE ITEMS IS ALWAYS A LIST
    if not isinstance(
        selected_items,
        list
    ):

        selected_items = []


    # GET HAMPER FROM FIRESTORE
    hamper_ref = (
        db.collection(
            "hampers"
        )
        .document(
            hamper_id
        )
    )


    hamper_doc = hamper_ref.get()


    if not hamper_doc.exists:

        return JsonResponse(
            {
                "success": False,

                "message":
                    "Hamper not found."
            },
            status=404
        )


    hamper = hamper_doc.to_dict()


    # BASIC HAMPER DETAILS
    hamper_name = hamper.get(
        "name",
        ""
    )

    hamper_image = hamper.get(
        "image",
        ""
    )

    selling_price = float(
        hamper.get(
            "selling_price",
            0
        ) or 0
    )

    discount_percent = float(
        hamper.get(
            "discount",
            0
        ) or 0
    )

    delivery_charge = float(
        hamper.get(
            "delivery_charge",
            0
        ) or 0
    )


    # ORIGINAL HAMPER ITEMS
    original_items = hamper.get(
        "items",
        []
    )


    if not isinstance(
        original_items,
        list
    ):

        original_items = []


    # CALCULATE ORIGINAL ITEMS TOTAL
    original_items_total = 0


    for item in original_items:

        item_price = float(
            item.get(
                "item_price",
                0
            ) or 0
        )

        item_quantity = int(
            item.get(
                "quantity",
                0
            ) or 0
        )

        original_items_total += (
            item_price
            *
            item_quantity
        )


    # FIXED HAMPER AMOUNT
    fixed_amount = (
        selling_price
        -
        original_items_total
    )


    if fixed_amount < 0:

        fixed_amount = 0


    # ITEMS TO SAVE IN CART
    cart_items = []


    # NON-CUSTOMIZABLE HAMPER
    if not customized:


        # ORIGINAL ADMIN ITEMS
        for item in original_items:

            product_id = str(
                item.get(
                    "product_id",
                    ""
                ) or ""
            )

            item_name = item.get(
                "item_name",
                ""
            )

            item_price = float(
                item.get(
                    "item_price",
                    0
                ) or 0
            )

            item_quantity = int(
                item.get(
                    "quantity",
                    1
                ) or 1
            )


            if not item_name:

                continue


            if item_quantity < 1:

                item_quantity = 1


            cart_items.append({

                "product_id":
                    product_id,

                "name":
                    item_name,

                "price":
                    item_price,

                "quantity":
                    item_quantity

            })


        # NEW PRODUCTS ADDED BY CUSTOMER
        for selected in selected_items:

            if not isinstance(
                selected,
                dict
            ):

                continue


            product_id = str(
                selected.get(
                    "product_id",
                    ""
                ) or ""
            )

            product_name = str(
                selected.get(
                    "name",
                    ""
                ) or ""
            ).strip()

            product_price = float(
                selected.get(
                    "price",
                    0
                ) or 0
            )

            quantity = int(
                selected.get(
                    "quantity",
                    1
                ) or 1
            )


            if not product_name:

                continue


            if quantity < 1:

                continue


            # GET LATEST PRODUCT DATA
            if product_id:

                try:

                    product_ref = (
                        db.collection(
                            "products"
                        )
                        .document(
                            product_id
                        )
                    )


                    product_doc = (
                        product_ref.get()
                    )


                    if product_doc.exists:

                        product = (
                            product_doc.to_dict()
                        )


                        firestore_name = (
                            product.get(
                                "name",
                                product_name
                            )
                        )


                        firestore_price = float(
                            product.get(
                                "price",
                                product_price
                            ) or 0
                        )


                        cart_items.append({

                            "product_id":
                                product_id,

                            "name":
                                firestore_name,

                            "price":
                                firestore_price,

                            "quantity":
                                quantity

                        })


                    else:

                        cart_items.append({

                            "product_id":
                                product_id,

                            "name":
                                product_name,

                            "price":
                                product_price,

                            "quantity":
                                quantity

                        })


                except Exception as e:

                    print(
                        "Cart product error:",
                        e
                    )


                    cart_items.append({

                        "product_id":
                            product_id,

                        "name":
                            product_name,

                        "price":
                            product_price,

                        "quantity":
                            quantity

                    })


            # PRODUCT WITHOUT ID
            else:

                cart_items.append({

                    "product_id":
                        "",

                    "name":
                        product_name,

                    "price":
                        product_price,

                    "quantity":
                        quantity

                })


    # CUSTOMIZED HAMPER
    else:

        for selected in selected_items:

            if not isinstance(
                selected,
                dict
            ):

                continue


            # SELECTED ITEM DATA
            product_id = str(
                selected.get(
                    "product_id",
                    ""
                ) or ""
            )

            product_name = str(
                selected.get(
                    "name",
                    ""
                ) or ""
            ).strip()

            product_price = float(
                selected.get(
                    "price",
                    0
                ) or 0
            )

            quantity = int(
                selected.get(
                    "quantity",
                    1
                ) or 1
            )

            original_item = (
                selected.get(
                    "original_item",
                    False
                )
            )


            # INVALID ITEM
            if not product_name:

                continue


            if quantity < 1:

                continue


            # ORIGINAL HAMPER ITEM
            if original_item:

                cart_items.append({

                    "product_id":
                        product_id,

                    "name":
                        product_name,

                    "price":
                        product_price,

                    "quantity":
                        quantity

                })

                continue


            # NEWLY ADDED PRODUCT
            if product_id:

                try:

                    product_ref = (
                        db.collection(
                            "products"
                        )
                        .document(
                            product_id
                        )
                    )


                    product_doc = (
                        product_ref.get()
                    )


                    if product_doc.exists:

                        product = (
                            product_doc.to_dict()
                        )


                        firestore_name = (
                            product.get(
                                "name",
                                product_name
                            )
                        )


                        firestore_price = float(
                            product.get(
                                "price",
                                product_price
                            ) or 0
                        )


                        cart_items.append({

                            "product_id":
                                product_id,

                            "name":
                                firestore_name,

                            "price":
                                firestore_price,

                            "quantity":
                                quantity

                        })


                    else:

                        cart_items.append({

                            "product_id":
                                product_id,

                            "name":
                                product_name,

                            "price":
                                product_price,

                            "quantity":
                                quantity

                        })


                except Exception as e:

                    print(
                        "Cart product error:",
                        e
                    )


                    cart_items.append({

                        "product_id":
                            product_id,

                        "name":
                            product_name,

                        "price":
                            product_price,

                        "quantity":
                            quantity

                    })


            # ITEM WITHOUT PRODUCT ID
            else:

                cart_items.append({

                    "product_id":
                        "",

                    "name":
                        product_name,

                    "price":
                        product_price,

                    "quantity":
                        quantity

                })


    # CALCULATE SELECTED ITEMS TOTAL
    items_total = 0


    for item in cart_items:

        item_price = float(
            item.get(
                "price",
                0
            ) or 0
        )

        item_quantity = int(
            item.get(
                "quantity",
                1
            ) or 1
        )


        items_total += (
            item_price
            *
            item_quantity
        )


    # FINAL HAMPER PRICE
    hamper_total = (
        fixed_amount
        +
        items_total
    )


    if hamper_total < 0:

        hamper_total = 0


    # DISCOUNT
    discount_amount = (
        hamper_total
        *
        discount_percent
        /
        100
    )


    # PRICE AFTER DISCOUNT
    price_after_discount = (
        hamper_total
        -
        discount_amount
    )


    # FINAL TOTAL
    final_total = (
        price_after_discount
        +
        delivery_charge
    )


    # CREATE CART ITEM
    cart_item = {

        "cart_id":
            uuid.uuid4().hex,

        "hamper_id":
            hamper_id,

        "quantity":
            1,

        "name":
            hamper_name,

        "image":
            hamper_image,

        "selling_price":
            hamper_total,

        "discount_percent":
            discount_percent,

        "discount_amount":
            discount_amount,

        "delivery_charge":
            delivery_charge,

        "items":
            cart_items,

        "total":
            final_total
    }


    # ACCOUNT-SPECIFIC CART KEY
    cart_key = f"giftify_cart_{user_id}"


    # GET EXISTING CART
    cart = request.session.get(
        cart_key,
        []
    )


    if not isinstance(
        cart,
        list
    ):

        cart = []


    # CHECK CURRENT HAMPER STOCK
    current_stock = int(
        hamper.get(
            "stock_quantity",
            0
        ) or 0
    )


    # COUNT SAME HAMPER ALREADY IN CART
    existing_quantity = 0


    for existing_item in cart:

        if str(
            existing_item.get(
                "hamper_id",
                ""
            )
        ) == str(hamper_id):

            existing_quantity += int(
                existing_item.get(
                    "quantity",
                    1
                ) or 1
            )


    # CHECK STOCK
    if current_stock <= 0:

        return JsonResponse({

            "success":
                False,

            "message":
                "Out of stock."

        })


    if (
        existing_quantity + 1
        >
        current_stock
    ):

        return JsonResponse({

            "success":
                False,

            "message":
                f"Only {current_stock} available. "
                f"You already have {existing_quantity} "
                f"in your cart."

        })


    # ADD NEW CART ITEM
    cart.append(
        cart_item
    )


    # SAVE ACCOUNT-SPECIFIC CART
    request.session[
        cart_key
    ] = cart


    # SAVE CART FOR NAVBAR COUNT
    request.session[
        "giftify_cart"
    ] = cart


    request.session.modified = True


    # SUCCESS
    return JsonResponse({

        "success":
            True,

        "message":
            "Hamper added to cart.",

        "cart_count":
            len(cart)

    })



# REMOVE FROM CART
def remove_from_cart(request):

    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )

    if not user_id:

        return JsonResponse(
            {
                "success": False,
                "message": "Please login.",
                "login_required": True
            },
            status=401
        )


    if request.method != "POST":

        return JsonResponse(
            {
                "success": False
            },
            status=400
        )


    # READ JSON
    try:

        data = json.loads(
            request.body
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False
            },
            status=400
        )


    cart_id = data.get(
        "cart_id"
    )


    if not cart_id:

        return JsonResponse(
            {
                "success": False
            },
            status=400
        )


    # ACCOUNT-SPECIFIC CART KEY
    cart_key = f"giftify_cart_{user_id}"


    # GET CART
    cart = request.session.get(
        cart_key,
        []
    )


    # REMOVE SELECTED CART ITEM
    # Works for both available and out-of-stock items
    new_cart = [

        item

        for item in cart

        if item.get(
            "cart_id"
        ) != cart_id

    ]


    # SAVE CART
    request.session[
        cart_key
    ] = new_cart


    # SAVE CART FOR NAVBAR COUNT
    request.session[
        "giftify_cart"
    ] = new_cart


    request.session.modified = True


    # SUCCESS
    return JsonResponse({

        "success":
            True,

        "cart_count":
            len(new_cart)

    })



# BUY NOW
def buy_now(request):

    # GET LOGGED-IN USER
    user_id = request.session.get("giftify_user_id")

    if not user_id:

        return JsonResponse({
            "success": False,
            "message": "Please login to continue.",
            "login_required": True
        }, status=401)


    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "Invalid request."
        })


    try:

        data = json.loads(
            request.body
        )


        hamper_id = data.get(
            "hamper_id"
        )


        customized = data.get(
            "customized",
            False
        )


        items = data.get(
            "items",
            []
        )


        if not hamper_id:

            return JsonResponse({
                "success": False,
                "message": "Hamper ID missing."
            })


        # GET HAMPER FROM FIRESTORE
        hamper_ref = (
            db.collection("hampers")
            .document(hamper_id)
        )


        hamper_doc = hamper_ref.get()


        if not hamper_doc.exists:

            return JsonResponse({
                "success": False,
                "message": "Gift hamper not found."
            })


        hamper = hamper_doc.to_dict()

        hamper["id"] = hamper_doc.id


        # HAMPER PRICE DETAILS
        selling_price = float(
            hamper.get(
                "selling_price",
                0
            ) or 0
        )


        discount_percent = float(
            hamper.get(
                "discount",
                0
            ) or 0
        )


        delivery_charge = float(
            hamper.get(
                "delivery_charge",
                0
            ) or 0
        )


        # CALCULATE CURRENT PRODUCT TOTAL
        items_total = 0


        for item in items:

            price = float(
                item.get(
                    "price",
                    0
                ) or 0
            )


            quantity = int(
                item.get(
                    "quantity",
                    1
                ) or 1
            )


            items_total += (
                price * quantity
            )


        # CALCULATE SUBTOTAL
        if customized:


            # CUSTOMIZABLE HAMPER
            original_items_total = 0


            original_items = (
                hamper.get(
                    "items",
                    []
                ) or []
            )


            for item in original_items:

                price = float(
                    item.get(
                        "item_price",
                        0
                    ) or 0
                )


                quantity = int(
                    item.get(
                        "quantity",
                        0
                    ) or 0
                )


                original_items_total += (
                    price * quantity
                )


            # Remove original included-product value
            # from the hamper selling price.
            fixed_amount = (
                selling_price -
                original_items_total
            )


            if fixed_amount < 0:

                fixed_amount = 0


            # Add current products.
            subtotal = (
                fixed_amount +
                items_total
            )


        else:

            # NON-CUSTOMIZABLE HAMPER
            # The hamper selling price is already
            # the price of the complete hamper
            subtotal = (
                selling_price +
                items_total
            )


        # DISCOUNT
        discount_amount = (
            subtotal *
            discount_percent /
            100
        )


        # FINAL TOTAL
        total_amount = (
            subtotal -
            discount_amount +
            delivery_charge
        )


        # ACCOUNT-SPECIFIC BUY NOW KEY
        buy_now_key = f"giftify_buy_now_{user_id}"


        # SAVE BUY NOW DATA IN SESSION
        request.session[
            buy_now_key
        ] = {

            "hamper_id":
                hamper["id"],

            "name":
                hamper.get(
                    "name",
                    ""
                ),

            "image":
                hamper.get(
                    "image",
                    ""
                ),

            "customized":
                customized,

            "items":
                items,

            "quantity": 1,

            "selling_price":
                subtotal,

            "discount_percent":
                discount_percent,

            "discount_amount":
                discount_amount,

            "delivery_charge":
                delivery_charge,

            "total_amount":
                total_amount
        }


        request.session.modified = True


        return JsonResponse({

            "success": True,

            "redirect_url":
                "/review-order/"

        })


    except Exception as e:

        print(
            "Buy Now error:",
            e
        )


        return JsonResponse({

            "success": False,

            "message":
                "Unable to continue."

        })



# REVIEW ORDER
def review_order(request):

    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )

    if not user_id:

        return redirect(
            "main:login"
        )


    # ACCOUNT-SPECIFIC SESSION KEYS
    cart_key = f"giftify_cart_{user_id}"

    buy_now_key = f"giftify_buy_now_{user_id}"

    addresses_key = f"giftify_addresses_{user_id}"


    source = request.GET.get(
        "source",
        "buy_now"
    )


    orders = []


    total_price = 0
    total_discount = 0
    total_delivery = 0


    # CART CHECKOUT
    if source == "cart":

        cart_items = request.session.get(
            cart_key,
            []
        )


        if not cart_items:

            return redirect(
                "main:cart"
            )


        # CHECK LATEST FIRESTORE STOCK
        # IMPORTANT
        # We create a separate available_cart list
        # We DO NOT modify the actual session cart
        # Therefore, out-of-stock items remain in the
        # user's cart and can become available again later
        available_cart = []


        for item in cart_items:

            hamper_id = str(
                item.get(
                    "hamper_id",
                    ""
                ) or ""
            )


            if not hamper_id:

                continue


            try:

                hamper_ref = (
                    db.collection("hampers")
                    .document(hamper_id)
                )


                hamper_doc = hamper_ref.get()


                # HAMPER DOES NOT EXIST
                if not hamper_doc.exists:

                    continue


                hamper = hamper_doc.to_dict()


                # GET LATEST STOCK FROM FIRESTORE
                latest_stock = int(
                    hamper.get(
                        "stock_quantity",
                        0
                    ) or 0
                )


                # ONLY AVAILABLE ITEMS GO TO REVIEW ORDER
                if latest_stock > 0:

                    available_cart.append(
                        item
                    )


            except Exception as e:

                print(
                    "Review order stock check error:",
                    e
                )


                # DO NOT ADD ITEM IF STOCK CHECK FAILS
                # This prevents an item from being ordered when
                # its latest stock could not be verified
                continue


        # IF NOTHING IS AVAILABLE
        if not available_cart:

            return redirect(
                "main:cart"
            )


        # IMPORTANT
        # Use ONLY available_cart for this review/order
        # The original cart_items session remains untouched
        cart = available_cart


        # CREATE ORDERS FROM AVAILABLE ITEMS ONLY
        for item in cart:

            selling_price = float(
                item.get(
                    "selling_price",
                    0
                ) or 0
            )


            discount_amount = float(
                item.get(
                    "discount_amount",
                    0
                ) or 0
            )


            delivery_charge = float(
                item.get(
                    "delivery_charge",
                    0
                ) or 0
            )


            total_amount = (
                selling_price
                - discount_amount
                + delivery_charge
            )


            order = {

                "cart_id":
                    item.get(
                        "cart_id",
                        ""
                    ),


                "hamper_id":
                    item.get(
                        "hamper_id",
                        ""
                    ),


                "name":
                    item.get(
                        "name",
                        ""
                    ),


                "image":
                    item.get(
                        "image",
                        ""
                    ),


                "customized":
                    item.get(
                        "customized",
                        False
                    ),


                "items":
                    item.get(
                        "items",
                        []
                    ),


                "selling_price":
                    selling_price,


                "discount_percent":
                    item.get(
                        "discount_percent",
                        0
                    ),


                "discount_amount":
                    discount_amount,


                "delivery_charge":
                    delivery_charge,


                "total_amount":
                    total_amount

            }


            orders.append(
                order
            )


            total_price += selling_price

            total_discount += discount_amount

            total_delivery += delivery_charge


    # BUY NOW CHECKOUT
    else:

        order_data = request.session.get(
            buy_now_key
        )


        if not order_data:

            return redirect(
                "main:home"
            )


        orders.append(
            order_data
        )


        total_price = float(
            order_data.get(
                "selling_price",
                0
            ) or 0
        )


        total_discount = float(
            order_data.get(
                "discount_amount",
                0
            ) or 0
        )


        total_delivery = float(
            order_data.get(
                "delivery_charge",
                0
            ) or 0
        )


    # GRAND TOTAL
    grand_total = (
        total_price
        - total_discount
        + total_delivery
    )


    # SAVED ADDRESSES
    addresses = request.session.get(
        addresses_key,
        []
    )


    context = {

        "orders":
            orders,


        "total_price":
            total_price,


        "total_discount":
            total_discount,


        "total_delivery":
            total_delivery,


        "grand_total":
            grand_total,


        "addresses":
            addresses

    }


    return render(
        request,
        "main/review.html",
        context
    )



# SAVE ADDRESS
def save_address(request):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "Invalid request."
        })

    try:

        # GET LOGGED-IN USER
        user_id = request.session.get(
            "giftify_user_id"
        )

        if not user_id:

            return JsonResponse({
                "success": False,
                "message": "Please login.",
                "login_required": True
            }, status=401)


        # USER-SPECIFIC ADDRESS SESSION KEY
        addresses_key = f"giftify_addresses_{user_id}"

        data = json.loads(
            request.body
        )

        addresses = request.session.get(
            addresses_key,
            []
        )

        address_id = data.get(
            "address_id"
        )

        address = {

            "id":
                address_id or str(
                    uuid.uuid4()
                ),

            "name":
                data.get(
                    "name",
                    ""
                ),

            "mobile":
                data.get(
                    "mobile",
                    ""
                ),

            "house":
                data.get(
                    "house",
                    ""
                ),

            "address":
                data.get(
                    "address",
                    ""
                ),

            "locality":
                data.get(
                    "locality",
                    ""
                ),

            "pincode":
                data.get(
                    "pincode",
                    ""
                ),

            "city":
                data.get(
                    "city",
                    ""
                ),

            "state":
                data.get(
                    "state",
                    ""
                ),

            "address_type":
                data.get(
                    "address_type",
                    "myself"
                ),

            "receiver_name":
                data.get(
                    "receiver_name",
                    ""
                ),

            "receiver_number":
                data.get(
                    "receiver_number",
                    ""
                ),

            "receiver_address":
                data.get(
                    "receiver_address",
                    ""
                ),

            "message":
                data.get(
                    "message",
                    ""
                ),

            "default":
                bool(
                    data.get(
                        "default",
                        False
                    )
                )
        }


        # IF THIS ADDRESS IS DEFAULT,
        # REMOVE DEFAULT FROM OTHER ADDRESSES
        if address["default"]:

            for existing in addresses:

                existing["default"] = False


        # UPDATE EXISTING ADDRESS
        updated = False

        for index, existing in enumerate(
            addresses
        ):

            if existing.get("id") == address["id"]:

                addresses[index] = address

                updated = True

                break


        # ADD NEW ADDRESS
        if not updated:

            addresses.append(
                address
            )


        # SAVE TO USER-SPECIFIC SESSION
        request.session[
            addresses_key
        ] = addresses

        request.session.modified = True

        return JsonResponse({
            "success": True,
            "addresses": addresses
        })

    except Exception as e:

        print(
            "Save address error:",
            e
        )

        return JsonResponse({
            "success": False,
            "message": "Unable to save address."
        })



# DELETE ADDRESS
def delete_address(request):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "Invalid request."
        })

    try:

        # GET LOGGED-IN USER
        user_id = request.session.get(
            "giftify_user_id"
        )

        if not user_id:

            return JsonResponse({
                "success": False,
                "message": "Please login.",
                "login_required": True
            }, status=401)


        # USER-SPECIFIC ADDRESS SESSION KEY
        addresses_key = f"giftify_addresses_{user_id}"

        data = json.loads(
            request.body
        )

        address_id = data.get(
            "address_id"
        )

        addresses = request.session.get(
            addresses_key,
            []
        )

        addresses = [
            address
            for address in addresses
            if address.get("id") != address_id
        ]


        # SAVE UPDATED ADDRESS LIST
        request.session[
            addresses_key
        ] = addresses

        request.session.modified = True

        return JsonResponse({
            "success": True,
            "addresses": addresses
        })

    except Exception as e:

        print(
            "Delete address error:",
            e
        )

        return JsonResponse({
            "success": False,
            "message": "Unable to delete address."
        })



# SELECT DELIVERY ADDRESS
def select_address(request):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "Invalid request."
        })


    try:

        # GET LOGGED-IN USER
        user_id = request.session.get(
            "giftify_user_id"
        )


        if not user_id:

            return JsonResponse({
                "success": False,
                "message": "Please login.",
                "login_required": True
            }, status=401)


        # USER-SPECIFIC ADDRESS SESSION KEY
        addresses_key = (
            f"giftify_addresses_{user_id}"
        )


        data = json.loads(
            request.body
        )


        address_id = data.get(
            "address_id"
        )


        if not address_id:

            return JsonResponse({
                "success": False,
                "message": "Please select a delivery address."
            })


        # GET SAVED ADDRESSES
        addresses = request.session.get(
            addresses_key,
            []
        )


        # FIND SELECTED ADDRESS
        selected_address = None


        for address in addresses:

            if str(
                address.get("id", "")
            ) == str(address_id):

                selected_address = address

                break


        # ADDRESS NOT FOUND
        if not selected_address:

            return JsonResponse({
                "success": False,
                "message": "Selected delivery address was not found."
            })


        # SAVE SELECTED ADDRESS
        selected_address_key = (
            f"giftify_selected_address_{user_id}"
        )


        request.session[
            selected_address_key
        ] = selected_address


        request.session.modified = True


        return JsonResponse({
            "success": True,
            "selected_address": selected_address
        })


    except Exception as e:

        print(
            "Select address error:",
            e
        )


        return JsonResponse({
            "success": False,
            "message": "Unable to select delivery address."
        })



def payment(request):

    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )

    if not user_id:

        return redirect(
            "main:login"
        )


    # USER-SPECIFIC SESSION KEYS
    cart_key = f"giftify_cart_{user_id}"

    buy_now_key = f"giftify_buy_now_{user_id}"

    addresses_key = f"giftify_addresses_{user_id}"

    source = request.GET.get(
        "source",
        "buy_now"
    )


    # CART CHECKOUT
    if source == "cart":

        cart_items = request.session.get(
            cart_key,
            []
        )

        if not cart_items:

            return redirect(
                "main:cart"
            )

        orders = []

        total_price = 0
        total_discount = 0
        total_delivery = 0

        for item in cart_items:

            selling_price = float(
                item.get(
                    "selling_price",
                    0
                ) or 0
            )

            discount_amount = float(
                item.get(
                    "discount_amount",
                    0
                ) or 0
            )

            delivery_charge = float(
                item.get(
                    "delivery_charge",
                    0
                ) or 0
            )

            total_amount = (
                selling_price
                - discount_amount
                + delivery_charge
            )

            order = {

                "cart_id": item.get(
                    "cart_id",
                    ""
                ),

                "hamper_id": item.get(
                    "hamper_id",
                    ""
                ),

                "name": item.get(
                    "name",
                    ""
                ),

                "image": item.get(
                    "image",
                    ""
                ),

                "customized": item.get(
                    "customized",
                    False
                ),

                "items": item.get(
                    "items",
                    []
                ),

                "selling_price": selling_price,

                "discount_amount": discount_amount,

                "delivery_charge": delivery_charge,

                "total_amount": total_amount,
            }

            orders.append(order)

            total_price += selling_price
            total_discount += discount_amount
            total_delivery += delivery_charge


    # BUY NOW CHECKOUT
    else:

        order_data = request.session.get(
            buy_now_key
        )

        if not order_data:

            return redirect(
                "main:home"
            )

        orders = [order_data]

        total_price = float(
            order_data.get(
                "selling_price",
                0
            ) or 0
        )

        total_discount = float(
            order_data.get(
                "discount_amount",
                0
            ) or 0
        )

        total_delivery = float(
            order_data.get(
                "delivery_charge",
                0
            ) or 0
        )


    # GRAND TOTAL
    grand_total = (
        total_price
        - total_discount
        + total_delivery
    )


    # SAVED ADDRESSES
    addresses = request.session.get(
        addresses_key,
        []
    )

    context = {

        "orders": orders,

        "total_price": total_price,

        "total_discount": total_discount,

        "total_delivery": total_delivery,

        "grand_total": grand_total,

        "addresses": addresses,

        "source": source,
    }

    return render(
        request,
        "main/payment.html",
        context
    )



# CONFIRMED
def confirmed(request):

    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )

    if not user_id:

        return redirect(
            "main:login"
        )


    # USER-SPECIFIC SESSION KEYS
    order_id_key = f"giftify_order_id_{user_id}"

    payment_method_key = f"giftify_payment_method_{user_id}"

    grand_total_key = f"giftify_grand_total_{user_id}"

    order_date_key = f"giftify_order_date_{user_id}"


    # GET CONFIRMATION DATA
    order_id = request.session.get(
        order_id_key
    )

    payment_method = request.session.get(
        payment_method_key
    )

    grand_total = request.session.get(
        grand_total_key,
        0
    )

    order_date = request.session.get(
        order_date_key
    )


    # IF USER DIRECTLY OPENS CONFIRMED PAGE
    if not order_id:

        return redirect(
            "main:home"
        )

    return render(
        request,
        "main/confirmed.html",
        {
            "order_id": order_id,
            "payment_method": payment_method,
            "grand_total": grand_total,
            "order_date": order_date,
        }
    )



# DECREASE STOCK AFTER ORDER CONFIRMATION
def decrease_order_stock(transaction, orders):

    # COLLECT REQUIRED STOCK CHANGES
    hamper_quantities = {}
    product_quantities = {}

    for order in orders:

        # HAMPER QUANTITY
        hamper_id = str(
            order.get(
                "hamper_id",
                ""
            ) or ""
        )

        if hamper_id:

            hamper_quantity = order.get(
                "quantity",
                1
            )

            try:
                hamper_quantity = int(
                    hamper_quantity or 1
                )
            except (ValueError, TypeError):

                hamper_quantity = 1

            if hamper_quantity < 1:

                hamper_quantity = 1

            hamper_quantities[hamper_id] = (
                hamper_quantities.get(
                    hamper_id,
                    0
                )
                + hamper_quantity
            )


        # PRODUCTS INSIDE HAMPER
        items = order.get(
            "items",
            []
        )

        if not isinstance(items, list):

            continue

        for item in items:

            if not isinstance(item, dict):

                continue

            product_id = str(
                item.get(
                    "product_id",
                    ""
                ) or ""
            )

            if not product_id:

                continue

            quantity = item.get(
                "quantity",
                1
            )

            try:
                quantity = int(
                    quantity or 1
                )
            except (ValueError, TypeError):

                quantity = 1

            if quantity < 1:

                continue

            product_quantities[product_id] = (
                product_quantities.get(
                    product_id,
                    0
                )
                + quantity
            )


    # CREATE FIRESTORE REFERENCES
    hamper_refs = {}

    for hamper_id in hamper_quantities:

        hamper_refs[hamper_id] = (
            db.collection(
                "hampers"
            ).document(
                hamper_id
            )
        )

    product_refs = {}

    for product_id in product_quantities:

        product_refs[product_id] = (
            db.collection(
                "products"
            ).document(
                product_id
            )
        )


    # READ ALL HAMPERS
    hamper_snapshots = {}

    for hamper_id, hamper_ref in hamper_refs.items():

        snapshots = transaction.get(
            hamper_ref
        )

        snapshot = next(
            snapshots,
            None
        )

        if snapshot is None or not snapshot.exists:

            raise ValueError(
                f"Gift hamper not found: {hamper_id}"
            )

        hamper_snapshots[hamper_id] = snapshot


    # READ ALL PRODUCTS
    product_snapshots = {}

    for product_id, product_ref in product_refs.items():

        snapshots = transaction.get(
            product_ref
        )

        snapshot = next(
            snapshots,
            None
        )

        if snapshot is None or not snapshot.exists:

            raise ValueError(
                f"Product not found: {product_id}"
            )

        product_snapshots[product_id] = snapshot


    # DECREASE HAMPER STOCK
    for hamper_id, ordered_quantity in hamper_quantities.items():

        hamper_data = (
            hamper_snapshots[
                hamper_id
            ].to_dict()
        )

        current_stock = hamper_data.get(
            "stock_quantity",
            0
        ) or 0

        try:
            current_stock = int(
                current_stock
            )
        except (ValueError, TypeError):

            current_stock = 0


        # NOT ENOUGH STOCK
        if current_stock < ordered_quantity:

            raise ValueError(
                f"Not enough stock for gift hamper: "
                f"{hamper_data.get('name', 'Gift Hamper')}"
            )


        # NEW STOCK
        new_stock = (
            current_stock
            - ordered_quantity
        )

        if new_stock > 0:

            availability = "available"

        else:

            availability = "out_of_stock"


        # UPDATE HAMPER
        transaction.update(
            hamper_refs[hamper_id],
            {
                "stock_quantity": new_stock,
                "availability": availability
            }
        )


    # DECREASE PRODUCT STOCK
    for product_id, ordered_quantity in product_quantities.items():

        product_data = (
            product_snapshots[
                product_id
            ].to_dict()
        )

        current_stock = product_data.get(
            "stock",
            0
        ) or 0

        try:
            current_stock = int(
                current_stock
            )
        except (ValueError, TypeError):

            current_stock = 0


        # NOT ENOUGH STOCK
        if current_stock < ordered_quantity:

            raise ValueError(
                f"Not enough stock for product: "
                f"{product_data.get('name', 'Product')}"
            )


        # NEW STOCK
        new_stock = (
            current_stock
            - ordered_quantity
        )

        if new_stock > 0:

            availability = "available"

        else:

            availability = "out_of_stock"


        # UPDATE PRODUCT
        transaction.update(
            product_refs[product_id],
            {
                "stock": new_stock,
                "availability": availability
            }
        )



# COMPLETE PAYMENT
def complete_payment(request):

    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )

    if not user_id:

        return redirect(
            "main:login"
        )


    # USER-SPECIFIC SESSION KEYS
    cart_key = f"giftify_cart_{user_id}"

    buy_now_key = f"giftify_buy_now_{user_id}"

    addresses_key = f"giftify_addresses_{user_id}"

    selected_address_key = f"giftify_selected_address_{user_id}"

    order_id_key = f"giftify_order_id_{user_id}"

    payment_method_key = f"giftify_payment_method_{user_id}"

    grand_total_key = f"giftify_grand_total_{user_id}"

    order_date_key = f"giftify_order_date_{user_id}"


    # REQUEST METHOD
    if request.method != "POST":

        return redirect(
            "main:payment"
        )


    # PAYMENT METHOD
    payment_method = request.POST.get(
        "payment_method"
    )

    if payment_method not in [
        "upi",
        "cod"
    ]:

        return redirect(
            "main:payment"
        )


    # SOURCE
    source = request.GET.get(
        "source",
        "buy_now"
    )


    # GET SESSION ID
    session_id = request.session.session_key

    if not session_id:

        request.session.create()

        session_id = request.session.session_key


    # GET DELIVERY ADDRESS
    # FIXED:
    # ALWAYS RESOLVE THE EXACT SELECTED ADDRESS
    addresses = request.session.get(
        addresses_key,
        []
    )

    selected_address = None


    # FIRST TRY:
    # ADDRESS SAVED BY REVIEW ORDER
    session_address = request.session.get(
        selected_address_key
    )

    if session_address:

        # SESSION CONTAINS FULL ADDRESS
        if isinstance(
            session_address,
            dict
        ):

            session_address_id = session_address.get(
                "id",
                ""
            )


            # FIND EXACT ADDRESS USING ITS ID
            if session_address_id:

                for address in addresses:

                    if str(
                        address.get(
                            "id",
                            ""
                        )
                    ) == str(
                        session_address_id
                    ):

                        selected_address = address

                        break


            # IF ADDRESS WAS NOT FOUND,
            # KEEP THE EXACT SESSION ADDRESS
            if not selected_address:

                selected_address = session_address


        # SESSION CONTAINS ONLY ADDRESS ID
        else:

            session_address_id = str(
                session_address
            )

            for address in addresses:

                if str(
                    address.get(
                        "id",
                        ""
                    )
                ) == session_address_id:

                    selected_address = address

                    break


    # SECOND TRY:
    # ADDRESS ID SENT FROM PAYMENT PAGE
    if not selected_address:

        address_id = request.POST.get(
            "address_id"
        )

        if address_id:

            for address in addresses:

                if str(
                    address.get(
                        "id",
                        ""
                    )
                ) == str(
                    address_id
                ):

                    selected_address = address

                    break


    # THIRD TRY:
    # DEFAULT ADDRESS
    if not selected_address and addresses:

        for address in addresses:

            if address.get(
                "default",
                False
            ) is True:

                selected_address = address

                break


    # FOURTH TRY:
    # FIRST ADDRESS
    # ONLY USED IF NOTHING WAS SELECTED
    if not selected_address and addresses:

        selected_address = addresses[0]


    # IF NO ADDRESS
    if not selected_address:

        selected_address = {}


    # CART CHECKOUT
    if source == "cart":

        cart_items = request.session.get(
            cart_key,
            []
        )

        if not cart_items:

            return redirect(
                "main:cart"
            )

        orders = []

        total_price = 0

        total_discount = 0

        total_delivery = 0

        for item in cart_items:

            selling_price = float(
                item.get(
                    "selling_price",
                    0
                ) or 0
            )

            discount_amount = float(
                item.get(
                    "discount_amount",
                    0
                ) or 0
            )

            delivery_charge = float(
                item.get(
                    "delivery_charge",
                    0
                ) or 0
            )

            total_amount = (
                selling_price
                - discount_amount
                + delivery_charge
            )


            # HAMPER QUANTITY
            quantity = item.get(
                "quantity",
                1
            )

            try:

                quantity = int(
                    quantity or 1
                )

            except (ValueError, TypeError):

                quantity = 1

            if quantity < 1:

                quantity = 1

            order = {

                "cart_id": item.get(
                    "cart_id",
                    ""
                ),

                "hamper_id": item.get(
                    "hamper_id",
                    ""
                ),

                "name": item.get(
                    "name",
                    ""
                ),

                "image": item.get(
                    "image",
                    ""
                ),

                "customized": item.get(
                    "customized",
                    False
                ),

                "items": item.get(
                    "items",
                    []
                ),


                # QUANTITY
                "quantity": quantity,

                "selling_price": selling_price,

                "discount_amount": discount_amount,

                "delivery_charge": delivery_charge,

                "total_amount": total_amount,

            }

            orders.append(
                order
            )

            total_price += selling_price

            total_discount += discount_amount

            total_delivery += delivery_charge


    # BUY NOW CHECKOUT
    else:

        order_data = request.session.get(
            buy_now_key
        )

        if not order_data:

            return redirect(
                "main:home"
            )

        selling_price = float(
            order_data.get(
                "selling_price",
                0
            ) or 0
        )

        discount_amount = float(
            order_data.get(
                "discount_amount",
                0
            ) or 0
        )

        delivery_charge = float(
            order_data.get(
                "delivery_charge",
                0
            ) or 0
        )

        total_amount = (
            selling_price
            - discount_amount
            + delivery_charge
        )

        order_data["selling_price"] = selling_price

        order_data["discount_amount"] = discount_amount

        order_data["delivery_charge"] = delivery_charge

        order_data["total_amount"] = total_amount


        # HAMPER QUANTITY
        quantity = order_data.get(
            "quantity",
            1
        )

        try:

            quantity = int(
                quantity or 1
            )

        except (ValueError, TypeError):

            quantity = 1

        if quantity < 1:

            quantity = 1

        order_data["quantity"] = quantity

        orders = [
            order_data
        ]

        total_price = selling_price

        total_discount = discount_amount

        total_delivery = delivery_charge


    # GRAND TOTAL
    grand_total = (
        total_price
        - total_discount
        + total_delivery
    )


    # GENERATE ORDER ID
    random_code = "".join(
        random.choices(
            string.ascii_uppercase
            + string.digits,
            k=6
        )
    )

    order_id = (
        "GIF"
        + random_code
    )


    # ORDER DATE
    order_date = datetime.now().strftime(
        "%d %b %Y"
    )


    # PAYMENT NAME
    if payment_method == "upi":

        payment_name = "UPI"

        payment_status = "Paid"

    else:

        payment_name = "Cash on Delivery"

        payment_status = "Pending"


    # PREPARE FIRESTORE ORDERS
    firestore_orders = []

    for order in orders:

        # GET RECEIVER DETAILS FROM EXACT SELECTED ADDRESS
        receiver_name = ""

        receiver_number = ""

        receiver_address = ""

        message = ""

        if isinstance(
            selected_address,
            dict
        ):

            receiver_name = selected_address.get(
                "receiver_name",
                ""
            )

            receiver_number = selected_address.get(
                "receiver_number",
                ""
            )

            receiver_address = selected_address.get(
                "receiver_address",
                ""
            )

            message = selected_address.get(
                "message",
                ""
            )


        # CREATE FIRESTORE ORDER
        firestore_order = {


            # USER OWNERSHIP
            "user_id": str(
                user_id
            ),


            # BASIC ORDER INFORMATION
            "order_id": order_id,

            "session_id": session_id,

            "order_date": order_date,

            "created_timestamp":
                datetime.now().timestamp(),


            # PAYMENT
            "payment_method": payment_name,

            "payment_status": payment_status,


            # ORDER STATUS
            "status": "Order Confirmed",


            # STOCK
            "stock_decreased": False,


            # HAMPER QUANTITY
            "quantity": int(
                order.get(
                    "quantity",
                    1
                ) or 1
            ),


            # HAMPER INFORMATION
            "name": order.get(
                "name",
                ""
            ),

            "image": order.get(
                "image",
                ""
            ),

            "hamper_id": order.get(
                "hamper_id",
                ""
            ),

            "cart_id": order.get(
                "cart_id",
                ""
            ),

            "customized": order.get(
                "customized",
                False
            ),

            "items": order.get(
                "items",
                []
            ),


            # PRICE
            "selling_price": float(
                order.get(
                    "selling_price",
                    0
                ) or 0
            ),

            "discount_amount": float(
                order.get(
                    "discount_amount",
                    0
                ) or 0
            ),

            "delivery_charge": float(
                order.get(
                    "delivery_charge",
                    0
                ) or 0
            ),

            "total_amount": float(
                order.get(
                    "total_amount",
                    0
                ) or 0
            ),


            # GRAND TOTAL
            "grand_total": float(
                grand_total
            ),


            # DELIVERY ADDRESS
            # KEEP COMPLETE SELECTED ADDRESS
            "address": selected_address,


            # FIX:
            # SAVE EXACT SELECTED ADDRESS ID
            "address_id": (
                selected_address.get(
                    "id",
                    ""
                )
                if isinstance(
                    selected_address,
                    dict
                )
                else ""
            ),


            # FIX:
            # SAVE SOMEONE ELSE RECEIVER DETAILS DIRECTLY
            # IN THE ORDER DOCUMENT
            "receiver_name": receiver_name,

            "receiver_number": receiver_number,

            "receiver_address": receiver_address,

            "message": message,

        }

        firestore_orders.append(
            firestore_order
        )


    # DECREASE STOCK + SAVE ORDER
    try:

        transaction = db.transaction()

        @firestore.transactional
        def confirm_order_transaction(transaction):


            # FIRST: CHECK + DECREASE STOCK
            decrease_order_stock(
                transaction,
                orders
            )


            # SECOND: SAVE ORDER
            for firestore_order in firestore_orders:

                order_ref = (
                    db.collection(
                        "orders"
                    ).document()
                )

                firestore_order[
                    "stock_decreased"
                ] = True

                transaction.set(
                    order_ref,
                    firestore_order
                )

        confirm_order_transaction(
            transaction
        )

    except Exception as e:

        import traceback

        print("\n")

        print(
            "=============================================="
        )

        print(
            "COMPLETE PAYMENT FAILED"
        )

        print(
            "ERROR:",
            repr(e)
        )

        print(
            "=============================================="
        )

        traceback.print_exc()

        print(
            "=============================================="
        )

        print("\n")

        return HttpResponse(
            f"""
            <h1>Payment Error</h1>
            <pre>{traceback.format_exc()}</pre>
            """,
            status=500
        )


    # SAVE CONFIRMATION DATA IN USER SESSION
    request.session[
        order_id_key
    ] = order_id

    request.session[
        payment_method_key
    ] = payment_name

    request.session[
        grand_total_key
    ] = grand_total

    request.session[
        order_date_key
    ] = order_date


    # CLEAR CHECKOUT DATA
    if source == "cart":

        request.session[
            cart_key
        ] = []

    else:

        request.session.pop(
            buy_now_key,
            None
        )


    # CLEAR SELECTED ADDRESS
    request.session.pop(
        selected_address_key,
        None
    )

    request.session.modified = True


    # CONFIRMATION
    return redirect(
        "main:confirmed"
    )



# MY ORDERS
def my_orders(request):

    orders = []


    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )


    # USER NOT LOGGED IN
    if not user_id:

        return render(
            request,
            "main/my_order.html",
            {
                "orders": [],
                "login_required": True
            }
        )


    # GET ORDERS FROM FIRESTORE
    try:

        order_docs = (
            db.collection(
                "orders"
            )
            .where(
                "user_id",
                "==",
                str(user_id)
            )
            .stream()
        )


        for doc in order_docs:

            order_data = doc.to_dict()

            order_data[
                "document_id"
            ] = doc.id

            orders.append(
                order_data
            )


    except Exception as e:

        print(
            "MY ORDERS ERROR:",
            e
        )


    # NEWEST ORDERS FIRST
    orders.sort(
        key=lambda order: order.get(
            "created_timestamp",
            0
        ),
        reverse=True
    )


    # RETURN PAGE
    return render(
        request,
        "main/my_order.html",
        {
            "orders": orders,
            "login_required": False
        }
    )



# ORDER DETAILS
def order_details(request, order_id):

    order = None

    # GET LOGGED-IN USER
    user_id = request.session.get(
        "giftify_user_id"
    )

    if not user_id:

        return redirect(
            "main:login"
        )


    # FIND PARTICULAR ORDER
    try:

        order_docs = (
            db.collection(
                "orders"
            )
            .where(
                "order_id",
                "==",
                order_id
            )
            .where(
                "user_id",
                "==",
                str(user_id)
            )
            .stream()
        )

        for doc in order_docs:

            order = doc.to_dict()

            order[
                "document_id"
            ] = doc.id

            break

    except Exception as e:

        print(
            "ORDER DETAILS ERROR:",
            e
        )


    # ORDER NOT FOUND
    if not order:

        return redirect(
            "main:my_orders"
        )


    # PAYMENT METHOD
    payment_method = order.get(
        "payment_method",
        ""
    )


    # PAYMENT STATUS
    saved_payment_status = order.get(
        "payment_status"
    )

    if saved_payment_status:

        payment_status = (
            saved_payment_status
        )

    elif payment_method == "UPI":

        payment_status = "Paid"

    else:

        payment_status = "Pending"


    # ORDER STATUS
    status = order.get(
        "status",
        "Order Confirmed"
    )


    # DELIVERY ADDRESS
    saved_address = order.get(
        "address",
        {}
    )

    if not isinstance(
        saved_address,
        dict
    ):

        saved_address = {}


    # RECEIVER DETAILS
    # FIRST- USE TOP-LEVEL ORDER FIELDS
    # SECOND- FALL BACK TO SAVED ADDRESS FIELDS
    # THIS SUPPORTS BOTH NEW AND OLD ORDERS
    receiver_name = order.get(
        "receiver_name"
    )

    if not receiver_name:

        receiver_name = saved_address.get(
            "receiver_name",
            ""
        )

    receiver_number = order.get(
        "receiver_number"
    )

    if not receiver_number:

        receiver_number = saved_address.get(
            "receiver_number",
            ""
        )

    receiver_address = order.get(
        "receiver_address"
    )

    if not receiver_address:

        receiver_address = saved_address.get(
            "receiver_address",
            ""
        )

    message = order.get(
        "message"
    )

    if not message:

        message = saved_address.get(
            "message",
            ""
        )


    # ADD RECEIVER DETAILS TO ORDER CONTEXT
    # EXISTING ORDER DATA IS NOT CHANGED
    order[
        "receiver_name"
    ] = receiver_name

    order[
        "receiver_number"
    ] = receiver_number

    order[
        "receiver_address"
    ] = receiver_address

    order[
        "message"
    ] = message


    # RETURN ORDER DETAILS PAGE
    return render(
        request,
        "main/order_details.html",
        {
            "order": order,

            "payment_status":
                payment_status,

            "status":
                status,
        }
    )



# MY ACCOUNT
@xframe_options_sameorigin
def my_account(request):

    # CHECK LOGIN
    user_id = request.session.get(
        "giftify_user_id"
    )


    # GUEST USER
    if not user_id:

        return render(
            request,
            "main/my_account.html",
            {
                "user_id": None,
                "full_name": "",
                "email": "",
                "profile_picture": "",
                "initials": "G",
                "addresses": [],
            }
        )


    # GET USER DETAILS FROM FIRESTORE
    user = {}

    try:

        user_reference = (
            db.collection("users")
            .document(user_id)
        )

        user_document = (
            user_reference.get()
        )

        if user_document.exists:

            user = (
                user_document.to_dict()
            )

    except Exception as e:

        print(
            "MY ACCOUNT USER ERROR:",
            e
        )


    # USER NAME
    full_name = (
        user.get(
            "full_name",
            ""
        )
    )

    if not full_name:

        full_name = (
            request.session.get(
                "giftify_user_name",
                ""
            )
        )


    # USER EMAIL
    email = (
        user.get(
            "email",
            ""
        )
    )

    if not email:

        email = (
            request.session.get(
                "giftify_user_email",
                ""
            )
        )


    # PROFILE PICTURE
    profile_picture = (
        user.get(
            "profile_picture",
            ""
        )
    )


    # CREATE USER INITIALS
    initials = "G"

    if full_name:

        name_parts = (
            full_name.strip().split()
        )

        if len(name_parts) >= 2:

            initials = (
                name_parts[0][0]
                +
                name_parts[-1][0]
            )

        elif len(name_parts) == 1:

            initials = (
                name_parts[0][0]
            )

    initials = initials.upper()


    # GET SAVED ADDRESSES
    addresses_key = (
        f"giftify_addresses_{user_id}"
    )

    addresses = (
        request.session.get(
            addresses_key,
            []
        )
    )


    # SAFETY CHECK
    if not isinstance(
        addresses,
        list
    ):

        addresses = []


    # MAKE SURE EVERY ADDRESS IS A DICTIONARY
    valid_addresses = []

    for address in addresses:

        if isinstance(
            address,
            dict
        ):

            valid_addresses.append(
                address
            )

    addresses = valid_addresses


    # RENDER MY ACCOUNT
    return render(

        request,

        "main/my_account.html",

        {

            "user_id":
                user_id,

            "full_name":
                full_name,

            "email":
                email,

            "profile_picture":
                profile_picture,

            "initials":
                initials,

            "addresses":
                addresses,

        }
    )