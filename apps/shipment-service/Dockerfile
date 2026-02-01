# Build stage: Maven package
FROM maven:3.9-eclipse-temurin-11-alpine AS builder
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Run stage: JRE + jar
FROM eclipse-temurin:11-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/shipment-service-*.jar app.jar
EXPOSE 8082
CMD ["java", "-jar", "app.jar"]
