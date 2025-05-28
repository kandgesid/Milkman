package com.milkman.Bridge;

import com.milkman.model.Customer;
import com.milkman.model.Milkman;
import com.milkman.model.User;
import com.milkman.repository.CustomerRepository;
import com.milkman.repository.MilkmanRepository;
import org.springframework.stereotype.Component;

@Component
public class JpaProfilePersistence implements ProfilePersistence {
    private final MilkmanRepository   milkmanRepo;
    private final CustomerRepository customerRepo;

    public JpaProfilePersistence(MilkmanRepository milkmanRepo,
                                 CustomerRepository customerRepo) {
        this.milkmanRepo  = milkmanRepo;
        this.customerRepo = customerRepo;
    }

    @Override
    public void saveProfile(ProfileData data) {
        String role = (String) data.get("role");
        User user = (User)   data.get("user");

        if ("MILKMAN".equalsIgnoreCase(role)) {
            Milkman m = new Milkman();
            m.setUser(user);
            m.setName((String)data.get("name"));
            m.setEmail((String)data.get("email"));
            m.setAddress((String)data.get("address"));
            m.setPhoneNumber((String)data.get("phoneNumber"));
            milkmanRepo.save(m);
        } else {
            Customer c = new Customer();
            c.setUser(user);
            c.setName((String)data.get("name"));
            c.setEmail((String)data.get("email"));
            c.setAddress((String)data.get("address"));
            c.setPhoneNumber((String)data.get("phoneNumber"));
            c.setFamilySize((Integer)data.get("familySize"));
            c.setDefaultMilkQty((Double)data.get("dailyMilkRequired"));
            customerRepo.save(c);
        }
    }
}
