package com.smartcampus;

import com.smartcampus.model.User;
import com.smartcampus.model.Role;
import com.smartcampus.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final AuthService userService;

    public DataLoader(AuthService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        User user = new User();
        user.setName("John Doe");
        user.setEmail("admin@gmail.com");
        user.setPassword("admin");
        user.setRole(Role.ADMIN);
        user.setPhone("0769045132");
        user.setProfilePicture("data:image/png;base64,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");
        user.setStatus(true);
        userService.register(user);
        System.out.println("User saved successfully.");
    }
}
