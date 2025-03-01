interface MetadataSettings {
  type: string;
  values?: string[];
  min?: number;
  max?: number;
}

export class Metadata {
  constructor(
    private id: string,
    public name: string,
    public title: string,
    public settings: MetadataSettings
  ) {}

  public get isTerms() {
    return this.settings.type === "terms";
  }

  public get isInteger() {
    return this.settings.type === "integer";
  }

  public get isFloat() {
    return this.settings.type === "float";
  }

  get hasValues() {
    if (this.isTerms) return this.settings.values?.length > 0;

    return this.settings.max !== null && this.settings.min !== null;
  }
}
