package com.rombenatero.ecommerce.service;

import com.rombenatero.ecommerce.dto.Purchase;
import com.rombenatero.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
