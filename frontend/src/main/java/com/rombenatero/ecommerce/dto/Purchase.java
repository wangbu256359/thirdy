package com.rombenatero.ecommerce.dto;

import com.rombenatero.ecommerce.entity.Address;
import com.rombenatero.ecommerce.entity.Customer;
import com.rombenatero.ecommerce.entity.Order;
import com.rombenatero.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data

public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
