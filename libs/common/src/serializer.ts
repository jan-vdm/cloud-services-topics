export abstract class Serializer {
  serialize(): string {
    return '';
  }
  static deserialize<U>(objectString: string): U {
    return JSON.parse(objectString.toString());
  }
}
