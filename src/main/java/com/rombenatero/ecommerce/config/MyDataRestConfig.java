package com.rombenatero.ecommerce.config;

import com.rombenatero.ecommerce.entity.Country;
import com.rombenatero.ecommerce.entity.Product;
import com.rombenatero.ecommerce.entity.ProductCategory;
import com.rombenatero.ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        this.entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        // Disable HTTP methods for Product: PUT, POST, DELETE

        // Disable HTTP methods for ProductCategory: PUT, POST, DELETE
        extracted(ProductCategory.class, config, theUnsupportedActions);
        extracted(Product.class, config, theUnsupportedActions);
        extracted(Country.class, config, theUnsupportedActions);
        extracted(State.class, config, theUnsupportedActions);
        // Expose entity IDs
        exposeIDs(config);
    }

    private static void extracted(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIDs(RepositoryRestConfiguration config) {
        // Get all entity types
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        List<Class<?>> entityClasses = new ArrayList<>();

        // Extract entity class types
        for (EntityType<?> tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // Expose the entity IDs
        config.exposeIdsFor(entityClasses.toArray(new Class[0]));
    }
}
