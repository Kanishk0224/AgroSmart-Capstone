package com.agrosmart.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.project-id:original-advantage-wggh3}")
    private String projectId;

    @Value("${firebase.firestore-database-id:ai-studio-1e66ff82-7eb8-42aa-95f5-b9ad2c132e8d}")
    private String firestoreDatabaseId;

    @Value("${firebase.credentials-path:}")
    private String credentialsPath;

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        try {
            FirebaseOptions.Builder builder = new FirebaseOptions.Builder();
            builder.setProjectId(projectId);

            InputStream serviceAccount = null;
            if (credentialsPath != null && !credentialsPath.isEmpty()) {
                File file = new File(credentialsPath);
                if (file.exists()) {
                    serviceAccount = new FileInputStream(file);
                } else {
                    serviceAccount = getClass().getClassLoader().getResourceAsStream(credentialsPath.replace("classpath:", ""));
                }
            }

            if (serviceAccount != null) {
                builder.setCredentials(GoogleCredentials.fromStream(serviceAccount));
                logger.info("Firebase initialized with service account credentials for project: {}", projectId);
            } else {
                builder.setCredentials(GoogleCredentials.getApplicationDefault());
                logger.info("Firebase initialized with Google Application Default Credentials for project: {}", projectId);
            }

            FirebaseApp.initializeApp(builder.build());
        } catch (Exception e) {
            logger.warn("Firebase Admin SDK init notice (Running in local / decoupled environment): {}", e.getMessage());
        }
    }

    @Bean
    public Firestore firestore() {
        if (!FirebaseApp.getApps().isEmpty()) {
            try {
                return FirestoreClient.getFirestore();
            } catch (Exception e) {
                logger.warn("Firestore client init fallback: {}", e.getMessage());
            }
        }
        // Fallback local Firestore options builder
        return FirestoreOptions.getDefaultInstance().getService();
    }
}
