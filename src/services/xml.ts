import { XMLParser } from 'fast-xml-parser';

export function parseXmlToMap(xml: string): any {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  return parser.parse(xml);
}

export function pickFirst<T = string>(...vals: any[]): T | undefined {
  for (const v of vals) if (v !== undefined && v !== null && v !== '') return v as T;
}
