import { ConfigService } from '@nestjs/config';

export class ConfigHelper {
  private static configService: ConfigService;

  static setConfigService(config: ConfigService) {
    ConfigHelper.configService = config;
  }

  static getBaseUrl(): string {
    const url = new URL(
      ConfigHelper.configService.get<string>('PREFIX'),
      ConfigHelper.configService.get<string>('BASE_URL'),
    );

    return url.toString();
  }

  static getBarcodeGs1(): string {
    return ConfigHelper.configService.get<string>('CODIGO_CONVENIO');
  }
}
