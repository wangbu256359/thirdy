package com.rombenatero.ecommerce.controller;

import com.rombenatero.ecommerce.dto.Purchase;
import com.rombenatero.ecommerce.dto.PurchaseResponse;
import com.rombenatero.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService){
        this.checkoutService = checkoutService;

    }
    @PostMapping("/purchase")
    public PurchaseResponse placeholder(@RequestBody Purchase purchase){
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }

}
