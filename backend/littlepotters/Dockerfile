FROM openjdk:8-jdk-slim
WORKDIR /app
COPY target/littlepotters-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]