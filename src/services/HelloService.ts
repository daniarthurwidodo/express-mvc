export interface HelloMessage {
  message: string;
  timestamp: Date;
  language?: string;
}

export class HelloService {
  private messages: Record<string, string> = {
    en: 'Hello World!',
    es: '¡Hola Mundo!',
    fr: 'Bonjour le monde!',
    de: 'Hallo Welt!',
    it: 'Ciao Mondo!',
    pt: 'Olá Mundo!',
    ja: 'こんにちは世界！',
    ko: '안녕하세요 세계!',
    zh: '你好世界！'
  };

  public getHelloMessage(language: string = 'en'): HelloMessage {
    const normalizedLanguage = language.toLowerCase();
    const message = this.messages[normalizedLanguage] || this.messages['en'];
    
    return {
      message: message!,
      timestamp: new Date(),
      language: normalizedLanguage
    };
  }

  public getPersonalizedHello(name: string, language: string = 'en'): HelloMessage {
    const normalizedLanguage = language.toLowerCase();
    const baseMessage = this.messages[normalizedLanguage] || this.messages['en'];
    const personalizedMessage = baseMessage!.replace('World', name).replace('Mundo', name).replace('monde', name).replace('Welt', name);
    
    return {
      message: personalizedMessage,
      timestamp: new Date(),
      language: normalizedLanguage
    };
  }

  public getAllSupportedLanguages(): string[] {
    return Object.keys(this.messages);
  }

  public getRandomHello(): HelloMessage {
    const languages = this.getAllSupportedLanguages();
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
    
    return this.getHelloMessage(randomLanguage);
  }
}
