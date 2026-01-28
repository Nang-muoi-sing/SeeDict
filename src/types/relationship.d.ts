declare module 'relationship.js' {
  interface RelationshipOptions {
    text?: string;
    target?: string;
    sex?: 0 | 1 | -1;
    type?: string;
    reverse?: boolean;
    mode?: string;
  }

  export default function relationship(options?: RelationshipOptions): string[];
}
