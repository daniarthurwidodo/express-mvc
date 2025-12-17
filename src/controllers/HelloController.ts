import { Request, Response } from 'express';
import { HelloService } from '../services/HelloService';
import { HttpResponse } from '../utils/httpResponse';
import { Logger } from '../utils/logger';

export class HelloController {
  private helloService: HelloService;
  private logger: Logger;

  constructor() {
    this.helloService = new HelloService();
    this.logger = new Logger({ module: 'HelloController' });
  }

  // GET /hello
  public async hello(req: Request, res: Response): Promise<void> {
    try {
      const { lang } = req.query;
      const language = typeof lang === 'string' ? lang : 'en';
      
      this.logger.info(`Getting hello message in language: ${language}`);
      const helloMessage = this.helloService.getHelloMessage(language);
      
      HttpResponse.success(res, helloMessage);
    } catch (error) {
      this.logger.error('Error getting hello message', error as Error);
      HttpResponse.internalError(res, 'Failed to get hello message');
    }
  }

  // GET /hello/personalized/:name
  public async personalizedHello(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const { lang } = req.query;
      
      if (!name) {
        HttpResponse.badRequest(res, 'Name parameter is required');
        return;
      }

      const language = typeof lang === 'string' ? lang : 'en';
      this.logger.info(`Getting personalized hello for: ${name} in ${language}`);
      const helloMessage = this.helloService.getPersonalizedHello(name, language);
      
      HttpResponse.success(res, helloMessage);
    } catch (error) {
      this.logger.error('Error getting personalized hello', error as Error);
      HttpResponse.internalError(res, 'Failed to get personalized hello message');
    }
  }

  // GET /hello/random
  public async randomHello(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info('Getting random hello message');
      const helloMessage = this.helloService.getRandomHello();
      
      HttpResponse.success(res, helloMessage);
    } catch (error) {
      this.logger.error('Error getting random hello', error as Error);
      HttpResponse.internalError(res, 'Failed to get random hello message');
    }
  }

  // GET /hello/languages
  public async getSupportedLanguages(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info('Getting supported languages');
      const languages = this.helloService.getAllSupportedLanguages();
      
      HttpResponse.success(res, { languages, count: languages.length });
    } catch (error) {
      this.logger.error('Error getting supported languages', error as Error);
      HttpResponse.internalError(res, 'Failed to get supported languages');
    }
  }
}
