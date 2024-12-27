import { NestFactory } from "@nestjs/core";
import { MainModule } from "./main.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "@shared/common/utils/HttpExceptionFilter";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(MainModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());

    const options = new DocumentBuilder()
        .setTitle("Mobile Backend")
        .setDescription(
            "Mobile backend API documentation. This API is used by the mobile app.",
        )
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);
    await app.listen(process.env.PORT || 3001);
}

bootstrap();
