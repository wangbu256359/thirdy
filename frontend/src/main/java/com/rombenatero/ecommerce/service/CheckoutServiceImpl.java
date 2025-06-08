package com.rombenatero.ecommerce.service;

import com.rombenatero.ecommerce.dao.CustomerRepository;
import com.rombenatero.ecommerce.dto.Purchase;
import com.rombenatero.ecommerce.dto.PurchaseResponse;
import com.rombenatero.ecommerce.entity.Customer;
import com.rombenatero.ecommerce.entity.Order;
import com.rombenatero.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;


    public CheckoutServiceImpl(CustomerRepository customerRepository){

        this.customerRepository = customerRepository;

    }
    @Override
    @Transactional

    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();

        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer = purchase.getCustomer();

        //check email
        String theEmail = customer.getEmail();
        Customer customerFromDB = customerRepository.findByEmail(theEmail);

        if (customerFromDB != null)  {

            //we found them
            customer = customerFromDB;
        }

        customer.add(order);

        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
