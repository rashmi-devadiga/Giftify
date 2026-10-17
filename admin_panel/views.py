from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from decimal import Decimal

from firebase_admin import firestore

from .models import Product, GiftHamper, HamperItem

from firebase_config.firebase import db, bucket
import uuid

import os

import base64
from django.shortcuts import render, redirect

from decimal import Decimal, InvalidOperation



# DASHBOARD
def dashboard(request):


    # PRODUCTS
    products_docs = db.collection("products").stream()

    products = []

    for doc in products_docs:

        product = doc.to_dict()

        product["id"] = doc.id

        products.append(product)


    # GIFT HAMPERS
    hampers_docs = db.collection("hampers").stream()

    hampers = []

    for doc in hampers_docs:

        hamper = doc.to_dict()

        hamper["id"] = doc.id

        hampers.append(hamper)


    # ORDERS
    orders_docs = db.collection("orders").stream()

    orders = []

    for doc in orders_docs:

        order = doc.to_dict()

        order["id"] = doc.id

        orders.append(order)


    # TOTAL PRODUCTS
    total_products = len(products)


    # TOTAL GIFTS
    total_gifts = len(hampers)


    # TOTAL ORDERS
    total_orders = len(orders)


    # TOTAL SALES
    total_sales = 0

    for order in orders:

        amount = (
            order.get("amount")
            or order.get("total")
            or order.get("total_amount")
            or order.get("final_amount")
            or 0
        )

        try:

            total_sales += float(amount)

        except (ValueError, TypeError):

            pass


    # RECENT ORDERS
    recent_orders = []

    for order in orders:


        # Here we used get customer name
        # use the same address name as per order page
        address = order.get(
            "address",
            {}
        )

        if not isinstance(address, dict):

            address = {}


        customer_name = address.get(
            "name",
            ""
        )


        if not customer_name:

            customer_name = "Customer"


        # RECENT ORDER DATA
        recent_orders.append({

            "id": order.get(
                "order_id",
                order["id"]
            ),

            "customer_name": customer_name,

            "address": address,

            "amount": order.get(
                "amount",
                order.get(
                    "total",
                    order.get(
                        "total_amount",
                        0
                    )
                )
            ),

            "status": order.get(
                "status",
                "Pending"
            )

        })

   
    # NEWEST ORDERS FIRST
    recent_orders.reverse()


    # SHOW ONLY LATEST 5
    recent_orders = recent_orders[:5]


    # RENDER DASHBOARD
    return render(
        request,
        "admin_panel/dashboard.html",
        {
            "current_page": "dashboard",

            "total_products": total_products,

            "total_gifts": total_gifts,

            "total_orders": total_orders,

            "total_sales": total_sales,

            "recent_orders": recent_orders,
        }
    )



# PRODUCT
def product(request):

    products_ref = db.collection('products')

    products_docs = products_ref.stream()

    products = []

    for doc in products_docs:

        data = doc.to_dict()

        data['id'] = doc.id

        products.append(data)


    # Newest products first
    products.reverse()

    return render(
        request,
        'admin_panel/product.html',
        {
            'products': products
        }
    )



# ADD PRODUCT 
def add_product(request):

    if request.method == 'POST':

        product_name = request.POST.get(
            'product_name',
            ''
        ).strip()

        price = request.POST.get(
            'price',
            ''
        ).strip()

        category = request.POST.get(
            'category',
            ''
        ).strip()

        quantity = request.POST.get(
            'quantity',
            ''
        ).strip()

        description = request.POST.get(
            'description',
            ''
        ).strip()

        availability = request.POST.get(
            'availability',
            'available'
        )

        product_image = request.FILES.get(
            'product_image'
        )


        # VALIDATION
        if not product_name:

            messages.error(
                request,
                'Please enter product name.'
            )

            return redirect(
                'admin_panel:add_product'
            )

        if not price:

            messages.error(
                request,
                'Please enter product price.'
            )

            return redirect(
                'admin_panel:add_product'
            )

        if not category:

            messages.error(
                request,
                'Please select a category.'
            )

            return redirect(
                'admin_panel:add_product'
            )

        if not quantity:

            messages.error(
                request,
                'Please enter quantity.'
            )

            return redirect(
                'admin_panel:add_product'
            )


        # PRICE VALIDATION
        try:

            product_price = float(price)

            if product_price < 0:

                messages.error(
                    request,
                    'Price cannot be negative.'
                )

                return redirect(
                    'admin_panel:add_product'
                )

        except (ValueError, TypeError):

            messages.error(
                request,
                'Please enter a valid price.'
            )

            return redirect(
                'admin_panel:add_product'
            )


        # STOCK VALIDATION
        try:

            product_stock = int(quantity)

            if product_stock < 0:

                messages.error(
                    request,
                    'Stock quantity cannot be negative.'
                )

                return redirect(
                    'admin_panel:add_product'
                )

        except (ValueError, TypeError):

            messages.error(
                request,
                'Please enter a valid stock quantity.'
            )

            return redirect(
                'admin_panel:add_product'
            )


        # AUTOMATIC AVAILABILITY
        if product_stock == 0:

            availability = 'out_of_stock'

        else:

            availability = 'available'


        # IMAGE - BASE64
        image_data = ''

        if product_image:

            if product_image.size > 700 * 1024:

                messages.error(
                    request,
                    'Image is too large. Please upload an image below 700 KB.'
                )

                return redirect(
                    'admin_panel:add_product'
                )


            # Read image as bytes
            image_bytes = product_image.read()


            # Convert image bytes to Base64
            base64_image = base64.b64encode(
                image_bytes
            ).decode('utf-8')


            # Create complete data URL
            image_data = (
                f'data:{product_image.content_type};base64,'
                f'{base64_image}'
            )


        # CREATE FIRESTORE DOCUMENT
        product_data = {

            'name': product_name,

            'price': product_price,

            'category': category,

            'stock': product_stock,

            'description': description,

            'availability': availability,

            'image': image_data,

            'created_at': firestore.SERVER_TIMESTAMP,

        }


        # SAVE TO FIRESTORE
        try:

            db.collection(
                'products'
            ).add(
                product_data
            )

        except Exception as e:

            messages.error(
                request,
                f'Could not save product: {str(e)}'
            )

            return redirect(
                'admin_panel:add_product'
            )


        # SUCCESS
        messages.success(
            request,
            'Product added successfully!'
        )

        return redirect(
            'admin_panel:product'
        )

    return render(
        request,
        'admin_panel/add_product.html'
    )



# EDIT PRODUCT
def edit_product(request, product_id):

    product_ref = (
        db.collection('products')
        .document(product_id)
    )

    product_doc = product_ref.get()


    # PRODUCT NOT FOUND
    if not product_doc.exists:

        messages.error(
            request,
            'Product not found.'
        )

        return redirect(
            'admin_panel:product'
        )

    product = product_doc.to_dict()

    product['id'] = product_doc.id


    # UPDATE PRODUCT
    if request.method == 'POST':

        product_name = request.POST.get(
            'product_name',
            ''
        ).strip()

        price = request.POST.get(
            'price',
            ''
        ).strip()

        category = request.POST.get(
            'category',
            ''
        ).strip()

        quantity = request.POST.get(
            'quantity',
            ''
        ).strip()

        description = request.POST.get(
            'description',
            ''
        ).strip()

        availability = request.POST.get(
            'availability',
            'available'
        )

        product_image = request.FILES.get(
            'product_image'
        )


        # VALIDATION
        if not product_name:

            messages.error(
                request,
                'Product name is required.'
            )

            return render(
                request,
                'admin_panel/edit_product.html',
                {
                    'product': product
                }
            )

        if not price:

            messages.error(
                request,
                'Price is required.'
            )

            return render(
                request,
                'admin_panel/edit_product.html',
                {
                    'product': product
                }
            )

        if not category:

            messages.error(
                request,
                'Category is required.'
            )

            return render(
                request,
                'admin_panel/edit_product.html',
                {
                    'product': product
                }
            )

        if not quantity:

            messages.error(
                request,
                'Stock quantity is required.'
            )

            return render(
                request,
                'admin_panel/edit_product.html',
                {
                    'product': product
                }
            )


        # CONVERT PRICE
        try:

            price_value = float(price)

        except ValueError:

            messages.error(
                request,
                'Please enter a valid price.'
            )

            return render(
                request,
                'admin_panel/edit_product.html',
                {
                    'product': product
                }
            )


        # CONVERT STOCK
        try:

            quantity_value = int(quantity)

        except ValueError:

            messages.error(
                request,
                'Please enter a valid stock quantity.'
            )

            return render(
                request,
                'admin_panel/edit_product.html',
                {
                    'product': product
                }
            )


        # STOCK / AVAILABILITY
        if quantity_value <= 0:

            quantity_value = 0
            availability = 'out_of_stock'

        else:

            availability = 'available'


        # PRODUCT DATA
        product_data = {

            'name': product_name,

            'price': price_value,

            'category': category,

            'stock': quantity_value,

            'description': description,

            'availability': availability,

        }


        # IMAGE
        if product_image:

            image_data = (
                'data:'
                + product_image.content_type
                + ';base64,'
                + base64.b64encode(
                    product_image.read()
                ).decode('utf-8')
            )

            product_data['image'] = image_data


        # UPDATE FIRESTORE
        try:

            product_ref.update(
                product_data
            )

            messages.success(
                request,
                'Product updated successfully.'
            )

            return redirect(
                'admin_panel:product'
            )

        except Exception as e:

            messages.error(
                request,
                f'Error updating product: {str(e)}'
            )

            return render(
                request,
                'admin_panel/edit_product.html',
                {
                    'product': product
                }
            )


    # SHOW PRODUCT
    return render(
        request,
        'admin_panel/edit_product.html',
        {
            'product': product
        }
    )



# EDIT GIFT HAMPER
def edit_gift_hamper(request, hamper_id):

    hamper_ref = db.collection("hampers").document(hamper_id)
    hamper_doc = hamper_ref.get()


    # CHECK HAMPER
    if not hamper_doc.exists:

        messages.error(
            request,
            "Gift hamper not found."
        )

        return redirect(
            "admin_panel:gift_hamper"
        )

    hamper = hamper_doc.to_dict()

    hamper["id"] = hamper_id


    # UPDATE
    if request.method == "POST":


        # BASIC INFORMATION
        hamper_name = request.POST.get(
            "hamper_name",
            ""
        ).strip()

        category = request.POST.get(
            "category",
            ""
        ).strip()

        description = request.POST.get(
            "description",
            ""
        ).strip()


        # OTHER INFORMATION
        discount = request.POST.get(
            "discount",
            "0"
        )

        delivery_charge = request.POST.get(
            "delivery_charge",
            "0"
        )

        stock_quantity = request.POST.get(
            "stock_quantity",
            "0"
        )

        availability = request.POST.get(
            "availability",
            hamper.get(
                "availability",
                "available"
            )
        )

        customization = request.POST.get(
            "customization",
            hamper.get(
                "customization",
                "yes"
            )
        )


        # VALIDATION
        if not hamper_name:

            messages.error(
                request,
                "Please enter hamper name."
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )


        if not category:

            messages.error(
                request,
                "Please select a category."
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )


        if not description:

            messages.error(
                request,
                "Please enter description."
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )


        # ITEMS
        item_names = request.POST.getlist(
            "item_name[]"
        )

        item_prices = request.POST.getlist(
            "item_price[]"
        )

        item_quantities = request.POST.getlist(
            "item_quantity[]"
        )


        items = []

        selling_price = Decimal("0")


        for name, price, quantity in zip(
            item_names,
            item_prices,
            item_quantities
        ):

            name = name.strip()

            if not name:
                continue


            # ITEM PRICE
            try:

                item_price = Decimal(
                    price or "0"
                )

            except (
                ValueError,
                TypeError,
                InvalidOperation
            ):

                item_price = Decimal("0")


            # ITEM QUANTITY
            try:

                item_quantity = int(
                    quantity or "1"
                )

            except (
                ValueError,
                TypeError
            ):

                item_quantity = 1


            if item_quantity < 1:
                item_quantity = 1


            # ITEM TOTAL
            item_total = (
                item_price *
                item_quantity
            )


            selling_price += item_total


            items.append({

                "item_name": name,

                "item_price": float(
                    item_price
                ),

                "quantity": item_quantity,

                "total": float(
                    item_total
                )

            })


        # DISCOUNT
        try:

            discount = Decimal(
                discount or "0"
            )

        except (
            ValueError,
            TypeError,
            InvalidOperation
        ):

            discount = Decimal("0")


        # DELIVERY CHARGE
        try:

            delivery_charge = Decimal(
                delivery_charge or "0"
            )

        except (
            ValueError,
            TypeError,
            InvalidOperation
        ):

            delivery_charge = Decimal("0")


        # STOCK
        try:

            stock_quantity = int(
                stock_quantity or "0"
            )

        except (
            ValueError,
            TypeError
        ):

            stock_quantity = 0


        if stock_quantity < 0:
            stock_quantity = 0


        # FINAL PRICE
        discount_amount = (
            selling_price * discount / Decimal("100")
        )

        final_price = (
            selling_price
            - discount_amount
            + delivery_charge
        )


        if final_price < 0:
            final_price = Decimal("0")


        # UPDATE DATA
        updated_data = {

            "name": hamper_name,

            "category": category,

            "description": description,

            "selling_price": float(
                selling_price
            ),

            "discount": float(
                discount
            ),

            "delivery_charge": float(
                delivery_charge
            ),

            "final_price": float(
                final_price
            ),

            "stock_quantity": stock_quantity,

            "availability": availability,

            "customization": customization,

            "items": items,

            "updated_at":
                firestore.SERVER_TIMESTAMP

        }


        # NEW IMAGE FIRESTORE ONLY
        # NO FIREBASE STORAGE
        new_image = request.FILES.get(
            "image"
        )

        if new_image:

            try:

                # IMAGE SIZE LIMIT
                if new_image.size > 700 * 1024:

                    messages.error(
                        request,
                        "Image is too large. Please choose an image below 700 KB."
                    )

                    return redirect(
                        "admin_panel:edit_gift_hamper",
                        hamper_id=hamper_id
                    )


                # IMAGE - BASE64
                image_bytes = new_image.read()

                encoded_image = (
                    base64.b64encode(
                        image_bytes
                    ).decode("utf-8")
                )

                image_url = (
                    f"data:{new_image.content_type};base64,"
                    f"{encoded_image}"
                )


                # UPDATE IMAGE
                updated_data["image"] = image_url


            except Exception as e:

                messages.error(
                    request,
                    f"Image processing failed: {str(e)}"
                )

                return redirect(
                    "admin_panel:edit_gift_hamper",
                    hamper_id=hamper_id
                )


        # SAVE TO FIRESTORE
        try:

            hamper_ref.update(
                updated_data
            )

        except Exception as e:

            messages.error(
                request,
                f"Could not update hamper: {str(e)}"
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )


        # SUCCESS
        messages.success(
            request,
            f"Gift hamper '{hamper_name}' updated successfully!"
        )


        return redirect(
            "admin_panel:gift_hamper"
        )


    # SHOW EDIT FORM
    return render(
        request,
        "admin_panel/edit_gift_hamper.html",
        {
            "hamper": hamper
        }
    )



# DELETE PRODUCT
def delete_product(request, product_id):

    if request.method == "POST":

        try:

            db.collection(
                "products"
            ).document(
                product_id
            ).delete()


            messages.success(
                request,
                "Product deleted successfully!"
            )


        except Exception as e:

            messages.error(
                request,
                f"Could not delete product: {str(e)}"
            )


    return redirect(
        "admin_panel:product"
    )



# GIFT HAMPER PAGE
def gift_hamper(request):

    hampers_ref = db.collection("hampers")
    hampers_docs = hampers_ref.stream()

    hampers = []

    for doc in hampers_docs:

        hamper = doc.to_dict()

        hamper["id"] = doc.id

        hampers.append(hamper)


    # Newest first
    hampers.reverse()

    return render(
        request,
        "admin_panel/gift_hamper.html",
        {
            "hampers": hampers
        }
    )



# ADD GIFT HAMPER
def add_gift_hamper(request):

    if request.method == "POST":


        # BASIC INFORMATION
        hamper_name = request.POST.get(
            "hamper_name",
            ""
        ).strip()

        category = request.POST.getlist(
            "category"
        )

        description = request.POST.get(
            "description",
            ""
        ).strip()

        image = request.FILES.get("image")


        # OTHER INFORMATION
        discount = request.POST.get(
            "discount",
            "0"
        )

        delivery_charge = request.POST.get(
            "delivery_charge",
            "0"
        )

        stock_quantity = request.POST.get(
            "stock_quantity",
            "0"
        )

        availability = request.POST.get(
            "availability",
            "available"
        )

        customization = request.POST.get(
            "customization",
            "yes"
        )


        # VALIDATION
        if not hamper_name:

            messages.error(
                request,
                "Please enter hamper name."
            )

            return redirect(
                "admin_panel:add_gift_hamper"
            )

        if not category:

            messages.error(
                request,
                "Please select a category."
            )

            return redirect(
                "admin_panel:add_gift_hamper"
            )

        if not description:

            messages.error(
                request,
                "Please enter description."
            )

            return redirect(
                "admin_panel:add_gift_hamper"
            )

        if not image:

            messages.error(
                request,
                "Please select a hamper image."
            )

            return redirect(
                "admin_panel:add_gift_hamper"
            )


        # IMAGE - BASE64
        # FIRESTORE 
        try:

            # Keep image reasonably small because Firestore
            # has a document size limit.
            if image.size > 700 * 1024:

                messages.error(
                    request,
                    "Image is too large. Please choose an image below 700 KB."
                )

                return redirect(
                    "admin_panel:add_gift_hamper"
                )

            image_bytes = image.read()

            encoded_image = base64.b64encode(
                image_bytes
            ).decode("utf-8")

            image_url = (
                f"data:{image.content_type};base64,"
                f"{encoded_image}"
            )

        except Exception as e:

            messages.error(
                request,
                f"Image processing failed: {str(e)}"
            )

            return redirect(
                "admin_panel:add_gift_hamper"
            )


        # GET ITEMS
        item_product_ids = request.POST.getlist(
            "item_product_id[]"
        )

        item_names = request.POST.getlist(
            "item_name[]"
        )

        item_prices = request.POST.getlist(
            "item_price[]"
        )

        item_quantities = request.POST.getlist(
            "item_quantity[]"
        )


        # CALCULATE SELLING PRICE
        selling_price = Decimal("0")

        items = []


        # PROCESS ITEMS
        for index, (name, price, quantity) in enumerate(
            zip(
                item_names,
                item_prices,
                item_quantities
            )
        ):

            name = name.strip()

            if not name:
                continue


            # PRODUCT ID
            product_id = ""

            if index < len(item_product_ids):

                product_id = (
                    item_product_ids[index]
                    or ""
                ).strip()


            # FALLBACK:
            # If product_id was not submitted by the form,
            # try to find the product using its exact name.
            if not product_id:

                try:

                    product_docs = (
                        db.collection("products")
                        .where(
                            "name",
                            "==",
                            name
                        )
                        .limit(1)
                        .stream()
                    )

                    for product_doc in product_docs:

                        product_id = product_doc.id
                        break

                except Exception:

                    product_id = ""


            # ITEM PRICE
            try:

                item_price = Decimal(
                    price or "0"
                )

            except:

                item_price = Decimal("0")


            # ITEM QUANTITY
            try:

                item_quantity = int(
                    quantity or "1"
                )

            except:

                item_quantity = 1

            if item_quantity < 1:
                item_quantity = 1


            # ITEM TOTAL
            item_total = (
                item_price * item_quantity
            )

            selling_price += item_total


            # SAVE ITEM
            items.append({

                "product_id": product_id,

                "item_name": name,

                "item_price": float(
                    item_price
                ),

                "quantity": item_quantity,

                "total": float(
                    item_total
                ),

            })


        # DISCOUNT
        try:

            discount = Decimal(
                discount or "0"
            )

        except:

            discount = Decimal("0")


        # DELIVERY
        try:

            delivery_charge = Decimal(
                delivery_charge or "0"
            )

        except:

            delivery_charge = Decimal("0")


        # STOCK
        try:

            stock_quantity = int(
                stock_quantity or "0"
            )

        except:

            stock_quantity = 0


        # FINAL PRICE
        discount_amount = (
            selling_price
            * discount
            / Decimal("100")
        )

        final_price = (
            selling_price
            - discount_amount
            + delivery_charge
        )

        if final_price < 0:

            final_price = Decimal("0")


        # FIRESTORE DATA
        hamper_data = {

            "name": hamper_name,

            "category": category,

            "image": image_url,

            "description": description,

            "selling_price": float(
                selling_price
            ),

            "discount": float(
                discount
            ),

            "delivery_charge": float(
                delivery_charge
            ),

            "final_price": float(
                final_price
            ),

            "stock_quantity": stock_quantity,

            "availability": availability,

            "customization": customization,

            "items": items,

            "created_at": firestore.SERVER_TIMESTAMP,

        }


        # SAVE TO FIRESTORE
        try:

            db.collection(
                "hampers"
            ).add(
                hamper_data
            )

        except Exception as e:

            messages.error(
                request,
                f"Could not save hamper: {str(e)}"
            )

            return redirect(
                "admin_panel:add_gift_hamper"
            )


        # SUCCESS
        messages.success(
            request,
            f"Gift hamper '{hamper_name}' added successfully!"
        )

        return redirect(
            "admin_panel:gift_hamper"
        )


    # SHOW FORM
    return render(
        request,
        "admin_panel/add_gift_hamper.html"
    )



# EDIT GIFT HAMPER
def edit_gift_hamper(request, hamper_id):

    hamper_ref = (
        db.collection("hampers")
        .document(hamper_id)
    )

    hamper_doc = hamper_ref.get()


    # CHECK HAMPER
    if not hamper_doc.exists:

        messages.error(
            request,
            "Gift hamper not found."
        )

        return redirect(
            "admin_panel:gift_hamper"
        )

    hamper = hamper_doc.to_dict()


    if request.method == "POST":


        # BASIC INFORMATION
        hamper_name = request.POST.get(
            "hamper_name",
            ""
        ).strip()

        category = request.POST.getlist(
            "category"
        )

        description = request.POST.get(
            "description",
            ""
        ).strip()


        # OTHER INFORMATION
        discount = request.POST.get(
            "discount",
            "0"
        )

        delivery_charge = request.POST.get(
            "delivery_charge",
            "0"
        )

        stock_quantity = request.POST.get(
            "stock_quantity",
            "0"
        )

        availability = request.POST.get(
            "availability",
            hamper.get(
                "availability",
                "available"
            )
        )

        customization = request.POST.get(
            "customization",
            hamper.get(
                "customization",
                "yes"
            )
        )


        # VALIDATION
        if not hamper_name:

            messages.error(
                request,
                "Please enter hamper name."
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )

        if not category:

            messages.error(
                request,
                "Please select a category."
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )

        if not description:

            messages.error(
                request,
                "Please enter description."
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )


        # GET ITEMS
        item_product_ids = request.POST.getlist(
            "item_product_id[]"
        )

        item_names = request.POST.getlist(
            "item_name[]"
        )

        item_prices = request.POST.getlist(
            "item_price[]"
        )

        item_quantities = request.POST.getlist(
            "item_quantity[]"
        )


        # BUILD ITEMS
        items = []

        selling_price = Decimal("0")


        # PROCESS ITEMS
        for index, (name, price, quantity) in enumerate(
            zip(
                item_names,
                item_prices,
                item_quantities
            )
        ):

            name = name.strip()

            if not name:
                continue


            # PRODUCT ID
            product_id = ""

            if index < len(item_product_ids):

                product_id = (
                    item_product_ids[index]
                    or ""
                ).strip()


            # FALLBACK:
            # Find product by exact name if the form does
            # not send product_id.
            if not product_id:

                try:

                    product_docs = (
                        db.collection("products")
                        .where(
                            "name",
                            "==",
                            name
                        )
                        .limit(1)
                        .stream()
                    )

                    for product_doc in product_docs:

                        product_id = product_doc.id
                        break

                except Exception:

                    product_id = ""


            # ITEM PRICE
            try:

                item_price = Decimal(
                    price or "0"
                )

            except (ValueError, TypeError):

                item_price = Decimal("0")


            # ITEM QUANTITY
            try:

                item_quantity = int(
                    quantity or "1"
                )

            except (ValueError, TypeError):

                item_quantity = 1

            if item_quantity < 1:

                item_quantity = 1


            # ITEM TOTAL
            item_total = (
                item_price
                * item_quantity
            )

            selling_price += item_total


            # SAVE ITEM
            items.append({

                "product_id": product_id,

                "item_name": name,

                "item_price": float(
                    item_price
                ),

                "quantity": item_quantity,

                "total": float(
                    item_total
                ),

            })


        # PRICE VALUES
        try:

            discount = Decimal(
                discount or "0"
            )

        except (ValueError, TypeError):

            discount = Decimal("0")

        try:

            delivery_charge = Decimal(
                delivery_charge or "0"
            )

        except (ValueError, TypeError):

            delivery_charge = Decimal("0")

        try:

            stock_quantity = int(
                stock_quantity or "0"
            )

        except (ValueError, TypeError):

            stock_quantity = 0


        # FINAL PRICE
        discount_amount = (
            selling_price
            * discount
            / Decimal("100")
        )

        final_price = (
            selling_price
            - discount_amount
            + delivery_charge
        )

        if final_price < 0:

            final_price = Decimal("0")


        # UPDATE FIRESTORE
        updated_data = {

            "name": hamper_name,

            "category": category,

            "description": description,

            "selling_price": float(
                selling_price
            ),

            "discount": float(
                discount
            ),

            "delivery_charge": float(
                delivery_charge
            ),

            "final_price": float(
                final_price
            ),

            "stock_quantity": stock_quantity,

            "availability": availability,

            "customization": customization,

            "items": items,

        }


        # UPDATE IMAGE ONLY IF A NEW IMAGE IS PROVIDED
        image = request.FILES.get("image")

        if image:

            try:

                if image.size > 700 * 1024:

                    messages.error(
                        request,
                        "Image is too large. Please choose an image below 700 KB."
                    )

                    return redirect(
                        "admin_panel:edit_gift_hamper",
                        hamper_id=hamper_id
                    )

                image_bytes = image.read()

                encoded_image = base64.b64encode(
                    image_bytes
                ).decode("utf-8")

                image_url = (
                    f"data:{image.content_type};base64,"
                    f"{encoded_image}"
                )

                updated_data["image"] = image_url

            except Exception as e:

                messages.error(
                    request,
                    f"Image processing failed: {str(e)}"
                )

                return redirect(
                    "admin_panel:edit_gift_hamper",
                    hamper_id=hamper_id
                )


        # SAVE TO FIRESTORE
        try:

            hamper_ref.update(
                updated_data
            )

        except Exception as e:

            messages.error(
                request,
                f"Could not update hamper: {str(e)}"
            )

            return redirect(
                "admin_panel:edit_gift_hamper",
                hamper_id=hamper_id
            )


        # SUCCESS
        messages.success(
            request,
            f"Gift hamper '{hamper_name}' updated successfully!"
        )

        return redirect(
            "admin_panel:gift_hamper"
        )


    # SHOW EDIT FORM
    hamper["id"] = hamper_id


    # NORMALIZE CATEGORY
    # Existing hampers may have category saved as a
    # single string. Convert it to a list for checkboxes.
    existing_categories = hamper.get(
        "category",
        []
    )

    if isinstance(
        existing_categories,
        str
    ):

        existing_categories = [
            existing_categories
        ]

    hamper["category"] = existing_categories

    return render(
        request,
        "admin_panel/edit_gift_hamper.html",
        {
            "hamper": hamper
        }
    )



# DELETE GIFT HAMPER
def delete_gift_hamper(request, hamper_id):

    if request.method == "POST":

        try:

            db.collection(
                "hampers"
            ).document(
                hamper_id
            ).delete()


            messages.success(
                request,
                "Gift hamper deleted successfully!"
            )


        except Exception as e:

            messages.error(
                request,
                f"Could not delete gift hamper: {str(e)}"
            )


    return redirect(
        "admin_panel:gift_hamper"
    )



# INVENTORY
def inventory(request):

    inventory_items = []


    # PRODUCTS FROM FIRESTORE
    products_docs = db.collection("products").stream()

    for doc in products_docs:

        product = doc.to_dict()

        stock = product.get(
            "stock",
            0
        ) or 0

        try:
            stock = int(stock)
        except (TypeError, ValueError):
            stock = 0

        inventory_items.append({

            "id": doc.id,

            "name": product.get(
                "name",
                "Unnamed Product"
            ),

            "category": product.get(
                "category",
                "Product"
            ),

            "stock": stock,

            "type": "product",

            "type_name": "Product",

            "status": (
                "In Stock"
                if stock > 0
                else "Out of Stock"
            )
        })


    # GIFT HAMPERS FROM FIRESTORE
    hampers_docs = db.collection("hampers").stream()

    for doc in hampers_docs:

        hamper = doc.to_dict()

        stock = hamper.get(
            "stock_quantity",
            0
        ) or 0

        try:
            stock = int(stock)
        except (TypeError, ValueError):
            stock = 0

        inventory_items.append({

            "id": doc.id,

            "name": hamper.get(
                "name",
                "Unnamed Hamper"
            ),

            "category": hamper.get(
                "category",
                "Gift Hamper"
            ),

            "stock": stock,

            "type": "hamper",

            "type_name": "Gift Hamper",

            "status": (
                "In Stock"
                if stock > 0
                else "Out of Stock"
            )
        })


    # SORT BY NAME
    inventory_items.sort(
        key=lambda item: item["name"].lower()
    )


    # RENDER
    return render(
        request,
        "admin_panel/inventory.html",
        {
            "inventory_items": inventory_items
        }
    )



# INVENTORY INCREASE BUTTON
def increase_inventory(request, item_type, item_id):


    # PRODUCT FROM FIRESTORE
    if item_type == "product":

        product_ref = db.collection(
            "products"
        ).document(item_id)

        product_doc = product_ref.get()

        if not product_doc.exists:

            messages.error(
                request,
                "Product not found."
            )

            return redirect(
                "admin_panel:inventory"
            )

        product = product_doc.to_dict()

        current_stock = product.get(
            "stock",
            0
        ) or 0

        try:
            current_stock = int(current_stock)
        except (TypeError, ValueError):
            current_stock = 0

        new_stock = current_stock + 1

        product_ref.update({

            "stock": new_stock,

            "availability": "available"

        })

        messages.success(
            request,
            f"{product.get('name', 'Product')} stock increased."
        )


    # GIFT HAMPER FROM FIRESTORE
    elif item_type == "hamper":

        hamper_ref = db.collection(
            "hampers"
        ).document(item_id)

        hamper_doc = hamper_ref.get()

        if not hamper_doc.exists:

            messages.error(
                request,
                "Gift hamper not found."
            )

            return redirect(
                "admin_panel:inventory"
            )

        hamper = hamper_doc.to_dict()

        current_stock = hamper.get(
            "stock_quantity",
            0
        ) or 0

        try:
            current_stock = int(current_stock)
        except (TypeError, ValueError):
            current_stock = 0

        new_stock = current_stock + 1

        hamper_ref.update({

            "stock_quantity": new_stock,

            "availability": "available"

        })

        messages.success(
            request,
            f"{hamper.get('name', 'Gift hamper')} stock increased."
        )


    return redirect(
        "admin_panel:inventory"
    )



# INVENTORY DECREASE BUTTON
def decrease_inventory(request, item_type, item_id):


    # PRODUCT FROM FIRESTORE
    if item_type == "product":

        product_ref = db.collection(
            "products"
        ).document(item_id)

        product_doc = product_ref.get()

        if not product_doc.exists:

            messages.error(
                request,
                "Product not found."
            )

            return redirect(
                "admin_panel:inventory"
            )

        product = product_doc.to_dict()

        current_stock = product.get(
            "stock",
            0
        ) or 0

        try:
            current_stock = int(current_stock)
        except (TypeError, ValueError):
            current_stock = 0

        if current_stock > 0:

            new_stock = current_stock - 1

        else:

            new_stock = 0

        if new_stock == 0:

            availability = "out_of_stock"

        else:

            availability = "available"

        product_ref.update({

            "stock": new_stock,

            "availability": availability

        })

        messages.success(
            request,
            f"{product.get('name', 'Product')} stock updated."
        )


    # GIFT HAMPER FROM FIRESTORE
    elif item_type == "hamper":

        hamper_ref = db.collection(
            "hampers"
        ).document(item_id)

        hamper_doc = hamper_ref.get()

        if not hamper_doc.exists:

            messages.error(
                request,
                "Gift hamper not found."
            )

            return redirect(
                "admin_panel:inventory"
            )

        hamper = hamper_doc.to_dict()

        current_stock = hamper.get(
            "stock_quantity",
            0
        ) or 0

        try:
            current_stock = int(current_stock)
        except (TypeError, ValueError):
            current_stock = 0

        if current_stock > 0:

            new_stock = current_stock - 1

        else:

            new_stock = 0

        if new_stock == 0:

            availability = "out_of_stock"

        else:

            availability = "available"

        hamper_ref.update({

            "stock_quantity": new_stock,

            "availability": availability

        })

        messages.success(
            request,
            f"{hamper.get('name', 'Gift hamper')} stock updated."
        )


    return redirect(
        "admin_panel:inventory"
    )



#INVENTORY DELETE BUTTON
def remove_inventory(request, item_type, item_id):


    # PRODUCT FROM FIRESTORE
    if item_type == "product":

        product_ref = db.collection(
            "products"
        ).document(item_id)

        product_doc = product_ref.get()

        if not product_doc.exists:

            messages.error(
                request,
                "Product not found."
            )

            return redirect(
                "admin_panel:inventory"
            )

        product = product_doc.to_dict()

        product_name = product.get(
            "name",
            "Product"
        )

        product_ref.delete()

        messages.success(
            request,
            f"{product_name} removed successfully."
        )


    # GIFT HAMPER FROM FIRESTORE
    elif item_type == "hamper":

        hamper_ref = db.collection(
            "hampers"
        ).document(item_id)

        hamper_doc = hamper_ref.get()

        if not hamper_doc.exists:

            messages.error(
                request,
                "Gift hamper not found."
            )

            return redirect(
                "admin_panel:inventory"
            )

        hamper = hamper_doc.to_dict()

        hamper_name = hamper.get(
            "name",
            "Gift hamper"
        )

        hamper_ref.delete()

        messages.success(
            request,
            f"{hamper_name} removed successfully."
        )


    return redirect(
        "admin_panel:inventory"
    )



# ORDERS PAGE
def orders(request):

    orders_docs = db.collection("orders").stream()

    order_groups = {}


    # GET ORDERS FROM FIRESTORE
    for doc in orders_docs:

        order = doc.to_dict()

        order_id = order.get(
            "order_id",
            doc.id
        )


        # CREATE ORDER GROUP
        if order_id not in order_groups:

            order_groups[order_id] = {

                "order_id": order_id,

                "items": [],

                "grand_total": 0,

                "created_timestamp": order.get(
                    "created_timestamp",
                    0
                ),

                "order_date": order.get(
                    "order_date",
                    ""
                ),

                "payment_method": order.get(
                    "payment_method",
                    ""
                ),

                "payment_status": order.get(
                    "payment_status",
                    ""
                ),

                "status": order.get(
                    "status",
                    "Order Confirmed"
                ),

                "user_id": order.get(
                    "user_id",
                    ""
                ),

                "customer_name": order.get(
                    "customer_name",
                    ""
                ),

                "address": order.get(
                    "address",
                    {}
                ),

                "address_id": order.get(
                    "address_id",
                    ""
                ),

            }


        group = order_groups[order_id]


        # CUSTOMER NAME
        if not group["customer_name"]:

            group["customer_name"] = order.get(
                "name",
                ""
            )


        # ADDRESS 
        # Here we use the address stored with the order document
        current_address = order.get(
            "address",
            {}
        )

        current_address_id = order.get(
            "address_id",
            ""
        )


        # If this document contains an address ID,
        # prefer it because it identifies the exact
        # selected address.
        if current_address_id:

            group["address"] = current_address

            group["address_id"] = current_address_id

        elif not group["address"] and current_address:

            group["address"] = current_address


        # GRAND TOTAL
        if not group["grand_total"]:

            group["grand_total"] = order.get(
                "grand_total",
                order.get(
                    "total_amount",
                    0
                )
            )


        # ITEM
        group["items"].append({

            "name": order.get(
                "name",
                "Gift Item"
            ),

            "image": order.get(
                "image",
                ""
            ),

            "selling_price": order.get(
                "selling_price",
                0
            ),

            "discount_amount": order.get(
                "discount_amount",
                0
            ),

            "delivery_charge": order.get(
                "delivery_charge",
                0
            ),

            "total_amount": order.get(
                "total_amount",
                0
            ),

            "items": order.get(
                "items",
                []
            ),

        })


    # CUSTOMER DETAILS
    for order in order_groups.values():

        user_id = order.get(
            "user_id",
            ""
        )

        if user_id:

            try:

                user_doc = (
                    db.collection("users")
                    .document(str(user_id))
                    .get()
                )

                if user_doc.exists:

                    user_data = user_doc.to_dict()

                    order["customer_name"] = user_data.get(
                        "full_name",
                        order["customer_name"] or "Customer"
                    )

            except Exception:

                pass


        if not order["customer_name"]:

            order["customer_name"] = "Customer"


    # LIST
    orders_list = list(
        order_groups.values()
    )


    # NEWEST FIRST
    orders_list.sort(
        key=lambda order: order.get(
            "created_timestamp",
            0
        ),
        reverse=True
    )


    # SUMMARY
    total_orders = len(
        orders_list
    )

    packed_orders = 0

    shipped_orders = 0

    delivered_orders = 0


    for order in orders_list:

        status = order.get(
            "status",
            "Order Confirmed"
        )

        if status == "Packed":

            packed_orders += 1

        elif status == "Shipped":

            shipped_orders += 1

        elif status == "Delivered":

            delivered_orders += 1


    # RENDER
    return render(
        request,
        "admin_panel/orders.html",
        {

            "current_page": "orders",

            "orders": orders_list,

            "total_orders": total_orders,

            "packed_orders": packed_orders,

            "shipped_orders": shipped_orders,

            "delivered_orders": delivered_orders,

        }
    )



# ORDER DETAIL / VIEW BUTTON
def order_detail(request, order_id):


    # GET USER ID FROM ADMIN ORDERS PAGE
    # The Admin Orders page passes the user_id belonging
    # to this particular order.
    requested_user_id = request.GET.get(
        "user_id",
        ""
    ).strip()


    # FIND PARTICULAR ORDER
    # Imp: Same logic as the working customer order_details().
    # If user_id is available, match BOTH:
    #     order_id
    #     user_id
    #
    # This prevents Admin from accidentally getting
    # another order belonging to the same order_id.
    if requested_user_id:

        orders_docs = (
            db.collection("orders")
            .where(
                "order_id",
                "==",
                order_id
            )
            .where(
                "user_id",
                "==",
                str(requested_user_id)
            )
            .stream()
        )

    else:

        orders_docs = (
            db.collection("orders")
            .where(
                "order_id",
                "==",
                order_id
            )
            .stream()
        )


    order_documents = []


    for doc in orders_docs:

        order = doc.to_dict()


        # KEEP FIRESTORE DOCUMENT ID
        order["_document_id"] = doc.id

        order_documents.append(
            order
        )


    # ORDER NOT FOUND
    if not order_documents:

        messages.error(
            request,
            "Order not found."
        )

        return redirect(
            "admin_panel:orders"
        )


    # MAIN ORDER
    # Imp: Use the FIRST matching Firestore document.
    #
    # This is exactly how the working customer-side
    # order_details() function selects the order.
    #
    # DO NOT sort.
    # DO NOT use created_timestamp.
    # DO NOT search the user's saved addresses.
    main_order = order_documents[0]


    # CUSTOMER
    user_id = main_order.get(
        "user_id",
        requested_user_id
    )


    customer_name = main_order.get(
        "customer_name",
        main_order.get(
            "name",
            "Customer"
        )
    )


    customer_email = ""


    if user_id:

        try:

            user_doc = (
                db.collection("users")
                .document(str(user_id))
                .get()
            )


            if user_doc.exists:

                user_data = user_doc.to_dict()


                customer_name = user_data.get(
                    "full_name",
                    customer_name
                )


                customer_email = user_data.get(
                    "email",
                    ""
                )

        except Exception:

            pass


    # ADDRESS
    # Imp: The address MUST come directly from the SAME
    # Firestore order document selected above.
    #
    # This is the address snapshot that was selected
    # when this order was placed.
    #
    # NEVER read the user's current saved addresses.
    # NEVER use another order's address.
    # NEVER use created_timestamp to select the address.
    address = main_order.get(
        "address",
        {}
    )


    address_id = main_order.get(
        "address_id",
        ""
    )


    # ADDRESS SAFETY
    if not isinstance(
        address,
        dict
    ):

        address = {}


    # IF address_id WAS NOT SAVED SEPARATELY,
    # GET IT FROM THE ADDRESS OBJECT
    if not address_id:

        address_id = address.get(
            "id",
            ""
        )


    # RECEIVER DETAILS
    # Imp:
    # Receiver details are stored inside the address
    # snapshot for "Someone Else" orders.
    #
    # Also support top-level receiver fields for newer
    # orders where they were saved directly in the order.
    # =====================================================
    receiver_name = main_order.get(
        "receiver_name",
        address.get(
            "receiver_name",
            ""
        )
    )


    receiver_number = main_order.get(
        "receiver_number",
        address.get(
            "receiver_number",
            ""
        )
    )


    receiver_address = main_order.get(
        "receiver_address",
        address.get(
            "receiver_address",
            ""
        )
    )


    message = main_order.get(
        "message",
        address.get(
            "message",
            ""
        )
    )


    # PAYMENT METHOD
    payment_method = main_order.get(
        "payment_method",
        ""
    )


    if payment_method == "Cash on Delivery":

        payment_display = "COD"

    else:

        payment_display = "UPI"


    # PAYMENT STATUS
    payment_status = main_order.get(
        "payment_status",
        ""
    )


    if not payment_status:

        if payment_display == "UPI":

            payment_status = "Paid"

        else:

            payment_status = "Pending"


    # ITEMS
    items = []


    for order in order_documents:

        raw_items = order.get(
            "items",
            []
        ) or []


        formatted_items = []


        for product in raw_items:

            if not isinstance(
                product,
                dict
            ):

                continue


            product_name = product.get(
                "item_name",
                product.get(
                    "name",
                    product.get(
                        "product_name",
                        "Product"
                    )
                )
            )


            quantity = product.get(
                "quantity",
                product.get(
                    "qty",
                    1
                )
            )


            price = product.get(
                "item_price",
                product.get(
                    "price",
                    product.get(
                        "selling_price",
                        0
                    )
                )
            )


            try:

                quantity = int(
                    quantity or 1
                )

            except (
                ValueError,
                TypeError
            ):

                quantity = 1


            try:

                price = float(
                    price or 0
                )

            except (
                ValueError,
                TypeError
            ):

                price = 0


            formatted_items.append({

                "name": product_name,

                "quantity": quantity,

                "price": price,

                "total": price * quantity,

            })


        items.append({

            "name": order.get(
                "name",
                "Gift Item"
            ),

            "image": order.get(
                "image",
                ""
            ),

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

            "included_items": formatted_items,

        })


    # TOTALS
    total_price = 0

    total_discount = 0

    total_delivery = 0


    for item in items:

        total_price += item[
            "selling_price"
        ]

        total_discount += item[
            "discount_amount"
        ]

        total_delivery += item[
            "delivery_charge"
        ]


    # GRAND TOTAL
    grand_total = main_order.get(
        "grand_total",
        total_price
        - total_discount
        + total_delivery
    )


    # ORDER DATA
    order_data = {

        "order_id": order_id,

        "customer_name": customer_name,

        "customer_email": customer_email,

        "order_date": main_order.get(
            "order_date",
            ""
        ),

        "created_timestamp": main_order.get(
            "created_timestamp",
            0
        ),

        "address": address,

        "address_id": address_id,


        # RECEIVER DETAILS
        "receiver_name": receiver_name,

        "receiver_number": receiver_number,

        "receiver_address": receiver_address,

        "message": message,


        # ORDER ITEMS
        "items": items,

        "total_price": total_price,

        "total_discount": total_discount,

        "total_delivery": total_delivery,

        "grand_total": float(
            grand_total or 0
        ),

        "payment_method": payment_display,

        "payment_status": payment_status,

        "status": main_order.get(
            "status",
            "Order Confirmed"
        ),

    }


    # RENDER
    return render(
        request,
        "admin_panel/order_detail.html",
        {

            "current_page": "orders",

            "order": order_data,

        }
    )



# UPDATE ORDER STATUS 
def update_order_status(request, order_id):

    if request.method != "POST":

        return redirect(
            "admin_panel:order_detail",
            order_id=order_id
        )


    # GET STATUS
    new_status = request.POST.get(
        "status",
        ""
    ).strip()


    # ALLOWED STATUSES
    allowed_statuses = [

        "Order Confirmed",

        "Packed",

        "Shipped",

        "Delivered",

    ]


    if new_status not in allowed_statuses:

        messages.error(
            request,
            "Invalid order status."
        )

        return redirect(
            "admin_panel:order_detail",
            order_id=order_id
        )


    # FIND ORDER DOCUMENTS
    orders_docs = (
        db.collection("orders")
        .where(
            "order_id",
            "==",
            order_id
        )
        .stream()
    )


    updated = False


    # UPDATE ALL DOCUMENTS
    for doc in orders_docs:

        doc.reference.update({

            "status": new_status

        })

        updated = True


    # MESSAGE
    if updated:

        messages.success(
            request,
            f"Order {order_id} updated to {new_status}."
        )

    else:

        messages.error(
            request,
            "Order not found."
        )


    # RETURN TO ORDER DETAILS
    return redirect(
        "admin_panel:order_detail",
        order_id=order_id
    )