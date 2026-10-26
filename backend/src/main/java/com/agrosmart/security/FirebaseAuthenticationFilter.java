package com.agrosmart.security;

import com.agrosmart.service.FirebaseTokenVerifierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private final FirebaseTokenVerifierService tokenVerifierService;

    @Autowired
    public FirebaseAuthenticationFilter(FirebaseTokenVerifierService tokenVerifierService) {
        this.tokenVerifierService = tokenVerifierService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            SecurityUser user = tokenVerifierService.verifyToken(token);

            if (user != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                FirebaseAuthenticationToken authToken = new FirebaseAuthenticationToken(
                        user,
                        token,
                        user.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
