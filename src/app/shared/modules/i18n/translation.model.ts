export class TranslationModel {
  public code: string;
  public name: string;
  public icon_url?: string;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
    this.icon_url = `/assets/img/flags/${this.code}.png`;
  }
}
