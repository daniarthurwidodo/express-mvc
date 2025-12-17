import { Request, Response } from 'express';
import { HelloService } from '../services/HelloService';

export class HelloController {
  private helloService: HelloService;

  constructor() {
    this.helloService = new HelloService();
  }

  // GET /hello
  public async hello(req: Request, res: Response): Promise<void> {
    try {
      const { lang } = req.query;
      const language = typeof lang === 'string' ? lang : 'en';
      
      const helloMessage = this.helloService.getHelloMessage(language);
      
      res.status(200).json({
        success: true,
        data: helloMessage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // GET /hello/personalized/:name
  public async personalizedHello(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const { lang } = req.query;
      
      if (!name) {
        res.status(400).json({
          success: false,
          message: 'Name parameter is required'
        });
        return;
      }

      const language = typeof lang === 'string' ? lang : 'en';
      const helloMessage = this.helloService.getPersonalizedHello(name, language);
      
      res.status(200).json({
        success: true,
        data: helloMessage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // GET /hello/random
  public async randomHello(req: Request, res: Response): Promise<void> {
    try {
      const helloMessage = this.helloService.getRandomHello();
      
      res.status(200).json({
        success: true,
        data: helloMessage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // GET /hello/languages
  public async getSupportedLanguages(req: Request, res: Response): Promise<void> {
    try {
      const languages = this.helloService.getAllSupportedLanguages();
      
      res.status(200).json({
        success: true,
        data: {
          languages,
          count: languages.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
