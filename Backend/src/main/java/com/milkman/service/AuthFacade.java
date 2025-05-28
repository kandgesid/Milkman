package com.milkman.service;

import com.milkman.Adapter.AuthRequestAdapter;
import com.milkman.Adapter.AuthResponseAdapter;
import com.milkman.Adapter.DtoEntityAdapter;
import com.milkman.DTO.JwtResponse;
import com.milkman.DTO.LoginRequest;
import com.milkman.DTO.SignUpRequest;
import com.milkman.exception.DetailedExceptionBuilder;
import com.milkman.exception.UserAlreadyExistsException;
import com.milkman.model.User;
import com.milkman.repository.UserRepository;
import com.milkman.security.JwtProvider;
import com.milkman.security.UserDetailsImpl;
import com.milkman.factory.UserProfileFactory;
import com.milkman.types.ErrorType;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthFacade {

    private final DtoEntityAdapter<SignUpRequest, User> signupAdapter;
    private final DtoEntityAdapter<JwtResponse, UserDetailsImpl> responseAdapter;
    private final AuthenticationManager authenticationManager;
    private final UserRepository        userRepository;
    private final JwtProvider           jwtProvider;
    private final UserProfileFactory    userProfileFactory;
    private final UserLookupService userLookupService;

    LoggerService logger = LoggerService.getInstance();

    public AuthFacade(AuthRequestAdapter signupAdapter,
                      AuthResponseAdapter responseAdapter,
                      AuthenticationManager authenticationManager,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtProvider jwtProvider,
                      UserProfileFactory userProfileFactory, UserLookupService userLookupService) {
        this.signupAdapter = signupAdapter;
        this.responseAdapter = responseAdapter;
        this.authenticationManager = authenticationManager;
        this.userRepository        = userRepository;
        this.jwtProvider           = jwtProvider;
        this.userProfileFactory    = userProfileFactory;
        this.userLookupService = userLookupService;
    }

    public String registerUser(SignUpRequest req) {
        String phone = req.getPhoneNumber();
        if (!StringUtils.hasText(phone) || userLookupService.existsByUsername(phone)) {
            throw new UserAlreadyExistsException(phone);
        }

        User user = signupAdapter.toEntity(req);
        userRepository.save(user);
        // delegate profile‐creation (Milkman vs Customer) to factory
        userProfileFactory.createUserProfile(req, user);
        return "User registered successfully";
    }

    public JwtResponse loginUser(LoginRequest req) {
        try{
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getUsername(), req.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            String jwt = jwtProvider.generateToken(auth);
            UserDetailsImpl ud = (UserDetailsImpl) auth.getPrincipal();
            JwtResponse response =  responseAdapter.toDto(ud);
            response.setToken(jwt);
            return response;
        } catch (Exception e) {
            logger.logError("Failed to login user");
            throw new DetailedExceptionBuilder()
                    .withErrorCode("AUTH-500-USER")
                    .withStatusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .withType(ErrorType.DATABASE)
                    .withDetails(e.getMessage())
                    .build();
        }

    }
}
