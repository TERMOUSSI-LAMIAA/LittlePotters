package com.littlepotters.littlepotters.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private static final String ISSUER = "LittlePottersApp";
    @Value("${jwt.secret}")
    private  String jwtSecret ;
    @Value("${JWT_EXPIRATION}")
    private  long jwtExpirationMs;

    public String generateToken(String username, String role) {
        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(username)
                .withClaim("role", role)
                .withClaim("jti", UUID.randomUUID().toString())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .sign(Algorithm.HMAC512(jwtSecret));
    }

    public String getUsernameFromToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC512(jwtSecret))
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            JWT.require(Algorithm.HMAC512(jwtSecret)).build().verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
